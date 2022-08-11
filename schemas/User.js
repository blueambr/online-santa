import { Schema } from "mongoose";

const userSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  username: {
    type: String,
  },
  hash: {
    type: String,
    required: true,
  },
});

export default userSchema;
