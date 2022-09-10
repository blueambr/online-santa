import { model, models } from "mongoose";
import participantSchemas from "schemas/Participant";
import connectDB from "utils/connectDB";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function getParticipant(req, res) {
  try {
    const { collectionRef, collectionSchema, id } = req.body;
    const Participant =
      models[collectionRef] ||
      model(collectionRef, participantSchemas[collectionSchema]);

    res.setHeader("Cache-Control", "s-maxage=10");

    await connectDB();

    const participant = await Participant.findOne({ id }).exec();

    if (participant) {
      res.json({
        participant,
        serverMessage: "The requested Participant has been provided.",
        isSuccess: true,
      });
    } else {
      res.json({
        serverMessage: "The requested Participant not found.",
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
