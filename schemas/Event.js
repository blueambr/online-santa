import { Schema } from "mongoose";

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  collectionRef: {
    type: String,
    required: true,
    unique: true,
  },
  collectionSchema: {
    type: String,
    required: true,
  },
});

export default eventSchema;
