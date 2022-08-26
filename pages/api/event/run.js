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

        const updateParticipantCrossRegions = async (santaId) => {
          if (sr === "eu") {
            if (steam.kz.length && hasParticipantWithoutSanta("kz")) {
              updateParticipants("kz", santaId);
            } else if (steam.cis.length && hasParticipantWithoutSanta("cis")) {
              updateParticipants("cis", santaId);
            } else if (steam.ua.length && hasParticipantWithoutSanta("ua")) {
              updateParticipants("ua", santaId);
            } else if (steam.ru.length && hasParticipantWithoutSanta("ru")) {
              updateParticipants("ru", santaId);
            } else if (steam.tr.length && hasParticipantWithoutSanta("tr")) {
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
            if (steam.cis.length && hasParticipantWithoutSanta("cis")) {
              updateParticipants("cis", santaId);
            } else if (steam.ua.length && hasParticipantWithoutSanta("ua")) {
              updateParticipants("ua", santaId);
            } else if (steam.ru.length && hasParticipantWithoutSanta("ru")) {
              updateParticipants("ru", santaId);
            } else if (steam.tr.length && hasParticipantWithoutSanta("tr")) {
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
            if (steam.ua.length && hasParticipantWithoutSanta("ua")) {
              updateParticipants("ua", santaId);
            } else if (steam.ru.length && hasParticipantWithoutSanta("ru")) {
              updateParticipants("ru", santaId);
            } else if (steam.tr.length && hasParticipantWithoutSanta("tr")) {
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
            if (steam.ru.length && hasParticipantWithoutSanta("ru")) {
              updateParticipants("ru", santaId);
            } else if (steam.tr.length && hasParticipantWithoutSanta("tr")) {
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
              { id: santaId },
              {
                recipient: null,
              }
            );
          }
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
              const santaId = steam[sr][0].id;

              updateParticipantCrossRegions(santaId);
            } else if (steam[sr].length === 2) {
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

              updateParticipantCrossRegions(recipientId);
            } else {
              const participantsNumber = steam[sr].length;
              const participantsIndexes = [...Array(participantsNumber).keys()];

              steam[sr].forEach(async (participant, index) => {
                const santaId = participant.id;
                const recipientIndex = participantsIndexes.find(
                  (participantIndex) =>
                    participantIndex > index &&
                    !steam[sr][participantIndex].hasSanta
                );

                if (recipientIndex !== undefined) {
                  const recipient = steam[sr][recipientIndex];
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
                } else if (participantsNumber === index + 1) {
                  const recipient = steam[sr][0];

                  if (!recipient.hasSanta) {
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
                  } else {
                    updateParticipantCrossRegions(santaId);
                  }
                } else {
                  updateParticipantCrossRegions(santaId);
                }
              });
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
