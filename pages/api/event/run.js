import { model, models } from "mongoose";
import Event from "models/Event";
import participantSchemas from "schemas/Participant";
import connectDB from "utils/connectDB";

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

        const hasParticipantWithoutSanta = (steamRegion) =>
          steam[steamRegion].find((participant) => !participant.hasSanta);

        const updateParticipants = async (recipientSteamRegion, santaId) => {
          const recipient = steam[recipientSteamRegion].find(
            (participant) => !participant.hasSanta
          );
          const { id: recipientId } = recipient;

          await Participant.updateOne(
            { id: recipientId },
            {
              hasSanta: true,
            }
          );

          await Participant.updateOne(
            { id: santaId },
            {
              recipient: recipientId,
            }
          );
        };

        participants.forEach(async (participant) => {
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
              // 1 -> a cheaper region, if exists, otherwise — { recipient: null }
              if (sr === "eu") {
                const santaId = steam.eu[0].id;

                if (steam.kz.length && hasParticipantWithoutSanta("kz")) {
                  updateParticipants("kz", santaId);
                } else if (
                  steam.cis.length &&
                  hasParticipantWithoutSanta("cis")
                ) {
                  updateParticipants("cis", santaId);
                } else if (
                  steam.ua.length &&
                  hasParticipantWithoutSanta("ua")
                ) {
                  updateParticipants("ua", santaId);
                } else if (
                  steam.ru.length &&
                  hasParticipantWithoutSanta("ru")
                ) {
                  updateParticipants("ru", santaId);
                } else if (
                  steam.tr.length &&
                  hasParticipantWithoutSanta("tr")
                ) {
                  updateParticipants("tr", santaId);
                } else {
                  await Participant.updateOne(
                    { id: santaId },
                    {
                      recipient: null,
                    }
                  );
                }
              }

              if (sr === "kz") {
                const santaId = steam.kz[0].id;

                if (steam.cis.length && hasParticipantWithoutSanta("cis")) {
                  updateParticipants("cis", santaId);
                } else if (
                  steam.ua.length &&
                  hasParticipantWithoutSanta("ua")
                ) {
                  updateParticipants("ua", santaId);
                } else if (
                  steam.ru.length &&
                  hasParticipantWithoutSanta("ru")
                ) {
                  updateParticipants("ru", santaId);
                } else if (
                  steam.tr.length &&
                  hasParticipantWithoutSanta("tr")
                ) {
                  updateParticipants("tr", santaId);
                } else {
                  await Participant.updateOne(
                    { id: santaId },
                    {
                      recipient: null,
                    }
                  );
                }
              }

              if (sr === "cis") {
                const santaId = steam.cis[0].id;

                if (steam.ua.length && hasParticipantWithoutSanta("ua")) {
                  updateParticipants("ua", santaId);
                } else if (
                  steam.ru.length &&
                  hasParticipantWithoutSanta("ru")
                ) {
                  updateParticipants("ru", santaId);
                } else if (
                  steam.tr.length &&
                  hasParticipantWithoutSanta("tr")
                ) {
                  updateParticipants("tr", santaId);
                } else {
                  await Participant.updateOne(
                    { id: santaId },
                    {
                      recipient: null,
                    }
                  );
                }
              }

              if (sr === "ua") {
                const santaId = steam.ua[0].id;

                if (steam.ru.length && hasParticipantWithoutSanta("ru")) {
                  updateParticipants("ru", santaId);
                } else if (
                  steam.tr.length &&
                  hasParticipantWithoutSanta("tr")
                ) {
                  updateParticipants("tr", santaId);
                } else {
                  await Participant.updateOne(
                    { id: santaId },
                    {
                      recipient: null,
                    }
                  );
                }
              }

              if (sr === "ru") {
                const santaId = steam.ru[0].id;

                if (steam.tr.length && hasParticipantWithoutSanta("tr")) {
                  updateParticipants("tr", santaId);
                } else {
                  await Participant.updateOne(
                    { id: santaId },
                    {
                      recipient: null,
                    }
                  );
                }
              }

              if (sr === "tr") {
                await Participant.updateOne(
                  { id: steam.tr[0].id },
                  {
                    recipient: null,
                  }
                );
              }
            } else if (steam[sr].length === 2) {
              // 1 -> 2 -> a cheaper region, if exists, otherwise — { recipient: null }
              const santa = steam[sr][1].hasSanta ? steam[sr][1] : steam[sr][0];
              const { id: santaId } = santa;
              const recipient = !steam[sr][1].hasSanta
                ? steam[sr][1]
                : steam[sr][0];
              const { id: recipientId } = recipient;

              await Participant.updateOne(
                { id: recipientId },
                {
                  hasSanta: true,
                }
              );

              await Participant.updateOne(
                { id: santaId },
                {
                  recipient: recipientId,
                }
              );

              if (sr === "eu") {
                if (steam.kz.length && hasParticipantWithoutSanta("kz")) {
                  updateParticipants("kz", recipientId);
                } else if (
                  steam.cis.length &&
                  hasParticipantWithoutSanta("cis")
                ) {
                  updateParticipants("cis", recipientId);
                } else if (
                  steam.ua.length &&
                  hasParticipantWithoutSanta("ua")
                ) {
                  updateParticipants("ua", recipientId);
                } else if (
                  steam.ru.length &&
                  hasParticipantWithoutSanta("ru")
                ) {
                  updateParticipants("ru", recipientId);
                } else if (
                  steam.tr.length &&
                  hasParticipantWithoutSanta("tr")
                ) {
                  updateParticipants("tr", recipientId);
                } else {
                  await Participant.updateOne(
                    { id: recipientId },
                    {
                      recipient: null,
                    }
                  );
                }
              }

              if (sr === "kz") {
                if (steam.cis.length && hasParticipantWithoutSanta("cis")) {
                  updateParticipants("cis", recipientId);
                } else if (
                  steam.ua.length &&
                  hasParticipantWithoutSanta("ua")
                ) {
                  updateParticipants("ua", recipientId);
                } else if (
                  steam.ru.length &&
                  hasParticipantWithoutSanta("ru")
                ) {
                  updateParticipants("ru", recipientId);
                } else if (
                  steam.tr.length &&
                  hasParticipantWithoutSanta("tr")
                ) {
                  updateParticipants("tr", recipientId);
                } else {
                  await Participant.updateOne(
                    { id: recipientId },
                    {
                      recipient: null,
                    }
                  );
                }
              }

              if (sr === "cis") {
                if (steam.ua.length && hasParticipantWithoutSanta("ua")) {
                  updateParticipants("ua", recipientId);
                } else if (
                  steam.ru.length &&
                  hasParticipantWithoutSanta("ru")
                ) {
                  updateParticipants("ru", recipientId);
                } else if (
                  steam.tr.length &&
                  hasParticipantWithoutSanta("tr")
                ) {
                  updateParticipants("tr", recipientId);
                } else {
                  await Participant.updateOne(
                    { id: recipientId },
                    {
                      recipient: null,
                    }
                  );
                }
              }

              if (sr === "ua") {
                if (steam.ru.length && hasParticipantWithoutSanta("ru")) {
                  updateParticipants("ru", recipientId);
                } else if (
                  steam.tr.length &&
                  hasParticipantWithoutSanta("tr")
                ) {
                  updateParticipants("tr", recipientId);
                } else {
                  await Participant.updateOne(
                    { id: recipientId },
                    {
                      recipient: null,
                    }
                  );
                }
              }

              if (sr === "ru") {
                if (steam.tr.length && hasParticipantWithoutSanta("tr")) {
                  updateParticipants("tr", recipientId);
                } else {
                  await Participant.updateOne(
                    { id: recipientId },
                    {
                      recipient: null,
                    }
                  );
                }
              }

              if (sr === "tr") {
                await Participant.updateOne(
                  { id: recipientId },
                  {
                    recipient: null,
                  }
                );
              }
            } else {
              // 1 -> 2 -> ... -> 1
            }
          }
        });
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
