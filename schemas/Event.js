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
});

export default eventSchema;
