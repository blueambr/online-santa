import { Schema, model, models } from "mongoose";

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
});

const Event = models.Event || model("Event", eventSchema);

export default Event;
