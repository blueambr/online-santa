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
        participants.forEach((participant) => {
          if (participant.steamRegion) {
            // TODO: Steam algorithm
          } else {
            // TODO: No Steam algorithm
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
