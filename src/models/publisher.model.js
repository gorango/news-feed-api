import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const PublisherSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  sub: {
    type: String,
    unique: true
  }
});

PublisherSchema.plugin(uniqueValidator);

export const Publisher = mongoose.model('Publisher', PublisherSchema);
