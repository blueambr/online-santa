import { model, models } from "mongoose";
import User from "models/User";
import participantSchemas from "schemas/Participant";
import connectDB from "utils/connectDB";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function addParticipant(req, res) {
  try {
    const {
      collectionRef,
      collectionSchema,
      id,
      telegram,
      comments,
      steamRegion,
      platforms,
    } = req.body;
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
        telegram,
        comments,
        steamRegion,
        platforms,
      });

      const user = await User.findOne({ id }).exec();
      let userParticipant;

      if (user.participant) {
        userParticipant = user.participant;
        userParticipant = JSON.parse(userParticipant);
        userParticipant.push(collectionRef);
        userParticipant = JSON.stringify(userParticipant);

        await User.updateOne(
          { id },
          {
            participant: userParticipant,
          }
        );
      } else {
        userParticipant = JSON.stringify([collectionRef]);

        await User.updateOne(
          { id },
          {
            participant: userParticipant,
          }
        );
      }

      res.json({
        body: { participant, userParticipant },
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
