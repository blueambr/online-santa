import User from "models/User";
import connectDB from "utils/connectDB";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function getUser(req, res) {
  try {
    const { hash, id } = req.body;

    res.setHeader("Cache-Control", "s-maxage=10");

    await connectDB();

    const user = await User.findOne({ id }).exec();

    if (user) {
      const userHash = JSON.parse(user.hash);

      if (userHash.find((item) => item === hash)) {
        res.json({
          user,
          serverMessage: "The requested User has been provided.",
          isSuccess: true,
        });
      } else {
        res.json({
          serverMessage: "Provided hash is invalid.",
          isError: true,
        });
      }
    } else {
      res.json({
        serverMessage: "The requested User does not exist.",
        isError: true,
      });
    }
  } catch (err) {
    res.json({ err, isError: true });
  }
}
