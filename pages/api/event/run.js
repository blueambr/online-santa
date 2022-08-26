import { model, models } from "mongoose";
import Event from "models/Event";
import participantSchemas from "schemas/Participant";
import connectDB from "utils/connectDB";
import findAsync from "utils/findAsync";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function runEvent(req, res) {
  try {
    const { collectionRef } = req.body;

    res.setHeader("Cache-Control", "s-maxage=10");

    await connectDB();

    const event = await Event.findOne({ collectionRef }).exec();

    if (event) {
      const Participant =
        models[collectionRef] ||
        model(collectionRef, participantSchemas[event.collectionSchema]);

      await Participant.updateMany(
        {},
        {
          hasSanta: false,
          recipient: null,
        }
      );

      const participants = await Participant.find().exec();

      if (event.collectionSchema === "gaming-platforms") {
        // Prices: eu > kz > cis > ua > ru > tr
        const steamRegions = ["eu", "kz", "cis", "ua", "ru", "tr"];
        const steam = {
          eu: [],
          kz: [],
          cis: [],
          ua: [],
          ru: [],
          tr: [],
        };
        const noSteam = [];

        const findParticipant = async (id) =>
          await Participant.findOne({ id }).exec();

        const participantWithoutSanta = async (steamRegion) =>
          await Participant.findOne({ steamRegion, hasSanta: false }).exec();

        const updateRecipient = async (recipientId) =>
          await Participant.updateOne(
            { id: recipientId },
            {
              hasSanta: true,
            }
          );

        const updateSanta = async (santaId, recipientId) =>
          await Participant.updateOne(
            { id: santaId },
            {
              recipient: recipientId,
            }
          );

        const updateParticipants = async (recipientSteamRegion, santaId) => {
          const recipient = await participantWithoutSanta(recipientSteamRegion);
          const { id: recipientId } = recipient;

          await updateRecipient(recipientId);
          await updateSanta(santaId, recipientId);
        };

        const updateParticipantCrossRegions = async (sr, santaId) => {
          if (sr === "eu") {
            if (steam.kz.length && (await participantWithoutSanta("kz"))) {
              await updateParticipants("kz", santaId);
            } else if (
              steam.cis.length &&
              (await participantWithoutSanta("cis"))
            ) {
              await updateParticipants("cis", santaId);
            } else if (
              steam.ua.length &&
              (await participantWithoutSanta("ua"))
            ) {
              await updateParticipants("ua", santaId);
            } else if (
              steam.ru.length &&
              (await participantWithoutSanta("ru"))
            ) {
              await updateParticipants("ru", santaId);
            } else if (
              steam.tr.length &&
              (await participantWithoutSanta("tr"))
            ) {
              await updateParticipants("tr", santaId);
            }
          }

          if (sr === "kz") {
            if (steam.cis.length && (await participantWithoutSanta("cis"))) {
              await updateParticipants("cis", santaId);
            } else if (
              steam.ua.length &&
              (await participantWithoutSanta("ua"))
            ) {
              await updateParticipants("ua", santaId);
            } else if (
              steam.ru.length &&
              (await participantWithoutSanta("ru"))
            ) {
              await updateParticipants("ru", santaId);
            } else if (
              steam.tr.length &&
              (await participantWithoutSanta("tr"))
            ) {
              await updateParticipants("tr", santaId);
            }
          }

          if (sr === "cis") {
            if (steam.ua.length && (await participantWithoutSanta("ua"))) {
              await updateParticipants("ua", santaId);
            } else if (
              steam.ru.length &&
              (await participantWithoutSanta("ru"))
            ) {
              await updateParticipants("ru", santaId);
            } else if (
              steam.tr.length &&
              (await participantWithoutSanta("tr"))
            ) {
              await updateParticipants("tr", santaId);
            }
          }

          if (sr === "ua") {
            if (steam.ru.length && (await participantWithoutSanta("ru"))) {
              await updateParticipants("ru", santaId);
            } else if (
              steam.tr.length &&
              (await participantWithoutSanta("tr"))
            ) {
              await updateParticipants("tr", santaId);
            }
          }

          if (sr === "ru") {
            if (steam.tr.length && (await participantWithoutSanta("tr"))) {
              await updateParticipants("tr", santaId);
            }
          }
        };

        participants.forEach((participant) => {
          const psr = participant.steamRegion;

          if (psr) {
            const matchedSteamRegion = steamRegions.find((sr) => sr === psr);

            steam[matchedSteamRegion].push(participant);
          } else {
            noSteam.push(participant);
          }
        });

        steamRegions.forEach(async (sr) => {
          if (steam[sr].length) {
            if (steam[sr].length === 1) {
              const santaId = steam[sr][0].id;

              await updateParticipantCrossRegions(sr, santaId);
            } else if (steam[sr].length === 2) {
              const santa = (await findParticipant(steam[sr][1].id)).hasSanta
                ? steam[sr][1]
                : steam[sr][0];
              const { id: santaId } = santa;
              const recipient =
                santa.id === steam[sr][0].id ? steam[sr][1] : steam[sr][0];
              const { id: recipientId } = recipient;

              await updateRecipient(recipientId);
              await updateSanta(santaId, recipientId);
              await updateParticipantCrossRegions(sr, recipientId);
            } else {
              const participantsNumber = steam[sr].length;
              const participantsIndexes = [...Array(participantsNumber).keys()];

              steam[sr].forEach(async (participant, index) => {
                const santaId = participant.id;
                const recipientIndex = await findAsync(
                  participantsIndexes,
                  async (participantIndex) =>
                    participantIndex > index &&
                    !(
                      await findParticipant(steam[sr][participantIndex].id)
                    ).hasSanta
                );

                if (recipientIndex !== undefined) {
                  const recipient = steam[sr][recipientIndex];
                  const { id: recipientId } = recipient;

                  await updateRecipient(recipientId);
                  await updateSanta(santaId, recipientId);
                } else if (participantsNumber === index + 1) {
                  const recipientId = steam[sr][0].id;

                  findParticipant(recipientId).then(async (recipient) => {
                    if (!recipient.hasSanta) {
                      await updateRecipient(recipientId);
                      await updateSanta(santaId, recipientId);
                    } else {
                      updateParticipantCrossRegions(sr, santaId);
                    }
                  });
                } else {
                  updateParticipantCrossRegions(sr, santaId);
                }
              });
            }
          }
        });

        const noSteamParticipantsNumber = noSteam.length;

        if (noSteamParticipantsNumber) {
          if (noSteamParticipantsNumber > 1) {
            const noSteamParticipantsIndexes = [
              ...Array(noSteamParticipantsNumber).keys(),
            ];

            noSteam.forEach(async (participant, index) => {
              const santaId = participant.id;
              const recipientIndex = await findAsync(
                noSteamParticipantsIndexes,
                async (participantIndex) =>
                  participantIndex > index &&
                  !(
                    await findParticipant(noSteam[participantIndex].id)
                  ).hasSanta
              );

              if (recipientIndex !== undefined) {
                const recipient = noSteam[recipientIndex];
                const { id: recipientId } = recipient;

                await updateRecipient(recipientId);
                await updateSanta(santaId, recipientId);
              } else if (noSteamParticipantsNumber === index + 1) {
                const recipientId = noSteam[0].id;

                findParticipant(recipientId).then(async (recipient) => {
                  if (!recipient.hasSanta) {
                    const { id: recipientId } = recipient;

                    await updateRecipient(recipientId);
                    await updateSanta(santaId, recipientId);
                  }
                });
              }
            });
          }
        }
      }

      res.json({
        serverMessage: "The run completed succesfully.",
        isSuccess: true,
      });
    } else {
      res.json({
        serverMessage: "The requested Event does not exist.",
        isError: true,
      });
    }
  } catch (err) {
    res.json({
      err,
      isError: true,
    });
  }
}
