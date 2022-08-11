import { model, models } from "mongoose";
import userSchema from "schemas/User";

const User = models.User || model("User", userSchema);

export default User;
