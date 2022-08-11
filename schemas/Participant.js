import { Schema } from "mongoose";

const gamingPlatformsParticipantSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
});

const participantSchemas = {
  "gaming-platforms": gamingPlatformsParticipantSchema,
};

export default participantSchemas;
