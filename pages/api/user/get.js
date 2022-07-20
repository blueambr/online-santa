import connectDB from "utils/connectDB";
import User from "models/User";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function getUser(req, res) {
  try {
    res.setHeader("Cache-Control", "s-maxage=10");

    await connectDB();

    const user = await User.findOne({ hash: req.body }).exec();

    if (user) {
      res.json({
        user,
        serverMessage: "The requested User has been provided.",
      });
    } else {
      res.json({ serverMessage: "The requested User does not exist." });
    }
  } catch (err) {
    res.json({ err });
  }
}
