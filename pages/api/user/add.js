import connectDB from "utils/connectDB";
import User from "models/User";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function addUser(req, res) {
  try {
    connectDB();

    const existingUser = await User.findOne({ id: req.body.id }).exec();

    if (existingUser) {
      res.json({
        existingUser,
        serverMessage: "The requested User already exists.",
      });
    } else {
      const user = User.create(req.body);

      res.json({ user, serverMessage: "The requested User has been created." });
    }
  } catch (err) {
    res.json({ err });
  }
}
