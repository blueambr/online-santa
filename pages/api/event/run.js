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
              if (sr === "eu" && steam.kz.length) {
                const kz = steam.kz.find(
                  (participant) => !participant.hasSanta
                );

                await Participant.updateOne(
                  { id: kz.id },
                  {
                    hasSanta: true,
                  }
                );

                await Participant.updateOne(
                  { id: steam.eu[0].id },
                  {
                    recipient: kz.id,
                  }
                );
              }

              if (sr === "kz" && steam.cis.length) {
                const cis = steam.cis.find(
                  (participant) => !participant.hasSanta
                );

                await Participant.updateOne(
                  { id: cis.id },
                  {
                    hasSanta: true,
                  }
                );

                await Participant.updateOne(
                  { id: steam.kz[0].id },
                  {
                    recipient: cis.id,
                  }
                );
              }

              if (sr === "cis" && steam.ua.length) {
                const ua = steam.ua.find(
                  (participant) => !participant.hasSanta
                );

                await Participant.updateOne(
                  { id: ua.id },
                  {
                    hasSanta: true,
                  }
                );

                await Participant.updateOne(
                  { id: steam.cis[0].id },
                  {
                    recipient: ua.id,
                  }
                );
              }

              if (sr === "ua" && steam.ru.length) {
                const ru = steam.ru.find(
                  (participant) => !participant.hasSanta
                );

                console.log(ru);

                await Participant.updateOne(
                  { id: ru.id },
                  {
                    hasSanta: true,
                  }
                );

                await Participant.updateOne(
                  { id: steam.ua[0].id },
                  {
                    recipient: ru.id,
                  }
                );
              }

              if (sr === "ru" && steam.tr.length) {
                const tr = steam.tr.find(
                  (participant) => !participant.hasSanta
                );

                await Participant.updateOne(
                  { id: tr.id },
                  {
                    hasSanta: true,
                  }
                );

                await Participant.updateOne(
                  { id: steam.ru[0].id },
                  {
                    recipient: tr.id,
                  }
                );
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
              // 1 -> 2 -> a cheaper region, if exists, otherwise { recipient: null }
            } else {
              // 1 -> 2 -> 3 -> ... -> 1
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
