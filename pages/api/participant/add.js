import { model, models } from "mongoose";
import participantSchemas from "schemas/Participant";
import connectDB from "utils/connectDB";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function addParticipant(req, res) {
  try {
    const { collectionRef, collectionSchema, id } = req.body;
    const Participant =
      models[collectionRef] ||
      model(collectionRef, participantSchemas[collectionSchema]);

    res.setHeader("Cache-Control", "s-maxage=10");

    await connectDB();

    const existingParticipant = await Participant.findOne({ id }).exec();

    if (existingParticipant) {
      res.json({
        serverMessage:
          "The requested Participant is already a part of this event.",
        isError: true,
      });
    } else {
      const participant = await Participant.create({
        id,
      });

      res.json({
        participant,
        serverMessage: "The requested Participant has been created.",
        isSuccess: true,
      });
    }
  } catch (err) {
    res.json({
      err,
      isError: true,
    });
  }
}
