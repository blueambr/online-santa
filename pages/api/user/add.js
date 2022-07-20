import connectDB from "utils/connectDB";
import User from "models/User";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function addUser(req, res) {
  try {
    res.setHeader("Cache-Control", "s-maxage=10");

    await connectDB();

    const existingUser = await User.findOne({ id: req.body.id }).exec();

    if (existingUser) {
      await User.updateOne(
        { id: existingUser.id },
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          hash: req.body.hash,
        }
      );

      const user = await User.findOne({ id: req.body.id }).exec();

      res.json({
        user,
        serverMessage: "The requested User has been updated.",
      });
    } else {
      const user = await User.create(req.body);

      res.json({ user, serverMessage: "The requested User has been created." });
    }
  } catch (err) {
    res.json({ err });
  }
}
