import Event from "models/Event";
import connectDB from "utils/connectDB";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function getEvents(req, res) {
  try {
    res.setHeader("Cache-Control", "s-maxage=10");

    await connectDB();

    const events = await Event.find({});

    if (events) {
      res.json({
        events,
        serverMessage: "All Events have been provided.",
        isSuccess: true,
      });
    } else {
      res.json({
        serverMessage: "No Events found.",
        isError: true,
      });
    }
  } catch (err) {
    res.json({ err, isError: true });
  }
}
