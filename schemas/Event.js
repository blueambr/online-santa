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
  excerpt: {
    type: String,
  },
  excerptRu: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: "open",
  },
  registrationClosed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default eventSchema;
