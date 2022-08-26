import { Schema } from "mongoose";

const gamingPlatformsParticipantSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  hasSanta: {
    type: Boolean,
    default: false,
  },
  recipient: {
    type: String,
    default: null,
  },
  telegram: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
  steamRegion: {
    type: String,
  },
  platforms: {
    type: Array,
    required: true,
  },
});

const participantSchemas = {
  "gaming-platforms": gamingPlatformsParticipantSchema,
};

export default participantSchemas;
