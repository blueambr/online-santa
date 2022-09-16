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

        const participantWithoutSanta = (steamRegion) =>
          steam[steamRegion].find((participant) => !participant.hasSanta);

        const updateParticipants = (santa, recipientRegion) => {
          const { steamRegion: santaRegion } = santa;
          const recipient = participantWithoutSanta(recipientRegion);
          const { id: recipientId } = recipient;

          santa.recipient = recipientId;
          recipient.hasSanta = true;

          steam[santaRegion][steam[santaRegion].indexOf(santa)] = santa;
          steam[recipientRegion][steam[recipientRegion].indexOf(recipient)] =
            recipient;
        };

        const updateParticipantCrossRegions = (sr, santa) => {
          if (sr === "eu") {
            if (steam.kz.length) {
              updateParticipants(santa, "kz");
            } else if (steam.cis.length) {
              updateParticipants(santa, "cis");
            } else if (steam.ua.length) {
              updateParticipants(santa, "ua");
            } else if (steam.ru.length) {
              updateParticipants(santa, "ru");
            } else if (steam.tr.length) {
              updateParticipants(santa, "tr");
            }
          }

          if (sr === "kz") {
            if (steam.cis.length) {
              updateParticipants(santa, "cis");
            } else if (steam.ua.length) {
              updateParticipants(santa, "ua");
            } else if (steam.ru.length) {
              updateParticipants(santa, "ru");
            } else if (steam.tr.length) {
              updateParticipants(santa, "tr");
            }
          }

          if (sr === "cis") {
            if (steam.ua.length) {
              updateParticipants(santa, "ua");
            } else if (steam.ru.length) {
              updateParticipants(santa, "ru");
            } else if (steam.tr.length) {
              updateParticipants(santa, "tr");
            }
          }

          if (sr === "ua") {
            if (steam.ru.length) {
              updateParticipants(santa, "ru");
            } else if (steam.tr.length) {
              updateParticipants(santa, "tr");
            }
          }

          if (sr === "ru") {
            if (steam.tr.length) {
              updateParticipants(santa, "tr");
            }
          }
        };

        const updateParticipant = async (id, hasSanta, recipient) =>
          await Participant.updateOne(
            { id },
            {
              hasSanta,
              recipient,
            }
          );

        participants.forEach((participant) => {
          const psr = participant.steamRegion;

          if (psr) {
            const matchedSteamRegion = steamRegions.find((sr) => sr === psr);

            steam[matchedSteamRegion].push(participant);
          } else {
            noSteam.push(participant);
          }
        });

        steamRegions.forEach((sr) => {
          if (steam[sr].length) {
            if (steam[sr].length === 1) {
              updateParticipantCrossRegions(sr, steam[sr][0]);
            } else if (steam[sr].length === 2) {
              const santa = steam[sr][1].hasSanta ? steam[sr][1] : steam[sr][0];
              const { id: santaId } = santa;
              const recipient =
                santaId === steam[sr][0].id ? steam[sr][1] : steam[sr][0];
              const { id: recipientId } = recipient;

              santa.recipient = recipientId;
              recipient.hasSanta = true;

              steam[sr][steam[sr].indexOf(santa)] = santa;
              steam[sr][steam[sr].indexOf(recipient)] = recipient;

              updateParticipantCrossRegions(sr, recipient);
            } else {
              const participantsNumber = steam[sr].length;
              const participantsIndexes = [...Array(participantsNumber).keys()];

              steam[sr].forEach((santa, index) => {
                const recipientIndex = participantsIndexes.find(
                  (participantIndex) =>
                    participantIndex > index &&
                    !steam[sr][participantIndex].hasSanta
                );

                if (recipientIndex !== undefined) {
                  const recipient = steam[sr][recipientIndex];
                  const { id: recipientId } = recipient;

                  santa.recipient = recipientId;
                  recipient.hasSanta = true;

                  steam[sr][steam[sr].indexOf(santa)] = santa;
                  steam[sr][steam[sr].indexOf(recipient)] = recipient;
                } else if (participantsNumber === index + 1) {
                  const recipient = steam[sr][0];

                  if (!recipient.hasSanta) {
                    const { id: recipientId } = recipient;

                    santa.recipient = recipientId;
                    recipient.hasSanta = true;

                    steam[sr][steam[sr].indexOf(santa)] = santa;
                    steam[sr][steam[sr].indexOf(recipient)] = recipient;
                  } else {
                    updateParticipantCrossRegions(sr, santa);
                  }
                } else {
                  updateParticipantCrossRegions(sr, santa);
                }
              });
            }
          }
        });

        const { length: noSteamParticipantsNumber } = noSteam;

        if (noSteamParticipantsNumber) {
          if (noSteamParticipantsNumber === 2) {
            const santa = noSteam[0];
            const recipient = noSteam[1];
            const { id: recipientId } = recipient;

            santa.recipient = recipientId;
            recipient.hasSanta = true;

            noSteam[0] = santa;
            noSteam[1] = recipient;
          } else if (noSteamParticipantsNumber > 2) {
            const participantsIndexes = [
              ...Array(noSteamParticipantsNumber).keys(),
            ];

            noSteam.forEach((santa, index) => {
              const recipientIndex = participantsIndexes.find(
                (participantIndex) =>
                  participantIndex > index &&
                  !noSteam[participantIndex].hasSanta
              );

              if (recipientIndex !== undefined) {
                const recipient = noSteam[recipientIndex];
                const { id: recipientId } = recipient;

                santa.recipient = recipientId;
                recipient.hasSanta = true;

                noSteam[noSteam.indexOf(santa)] = santa;
                noSteam[noSteam.indexOf(recipient)] = recipient;
              } else if (participantsNumber === index + 1) {
                const recipient = noSteam[0];

                if (!recipient.hasSanta) {
                  const { id: recipientId } = recipient;

                  santa.recipient = recipientId;
                  recipient.hasSanta = true;

                  noSteam[noSteam.indexOf(santa)] = santa;
                  noSteam[noSteam.indexOf(recipient)] = recipient;
                }
              }
            });
          }
        }

        steamRegions.forEach((sr) => {
          steam[sr].forEach(async (participant) => {
            const { id, hasSanta, recipient } = participant;
            await updateParticipant(id, hasSanta, recipient);
          });
        });

        noSteam.forEach(async (participant) => {
          const { id, hasSanta, recipient } = participant;

          await updateParticipant(id, hasSanta, recipient);
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
