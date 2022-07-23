import connectDB from "utils/connectDB";
import User from "models/User";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function addUser(req, res) {
  try {
    const { id, first_name, last_name, username, hash } = req.body;

    res.setHeader("Cache-Control", "s-maxage=10");

    await connectDB();

    const existingUser = await User.findOne({ id }).exec();

    if (existingUser) {
      const hashLimit = 10;
      const existingUserHash = JSON.parse(existingUser.hash);

      if (existingUserHash.length < hashLimit) {
        existingUserHash.push(hash);
      } else {
        existingUserHash.shift();
        existingUserHash.push(hash);
      }

      await User.updateOne(
        { id: existingUser.id },
        {
          first_name,
          last_name,
          username,
          hash: JSON.stringify(existingUserHash),
        }
      );

      const user = await User.findOne({ id }).exec();

      res.json({
        user,
        serverMessage: "The requested User has been updated.",
        isSuccess: true,
      });
    } else {
      const user = await User.create({
        id,
        first_name,
        last_name,
        username,
        hash: JSON.stringify([hash]),
      });

      res.json({
        user,
        serverMessage: "The requested User has been created.",
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
