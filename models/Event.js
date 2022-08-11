import { model, models } from "mongoose";
import eventSchema from "schemas/Event";

const Event = models.Event || model("Event", eventSchema);

export default Event;
