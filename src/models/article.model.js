import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const ArticleSchema = new mongoose.Schema({
  title: String,
  entities: Object,
  description: String,
  summary: String,
  text: String,
  link: {
    type: String,
    unique: true
  },
  date: Date,
  pubdate: Date,
  author: String,
  guid: String,
  comments: String,
  image: {
    title: String,
    url: String
  },
  categories: [String],
  source: Object,
  enclosures: [{
    type: { type: String },
    url: String
  }],
  meta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publisher'
  }
});

ArticleSchema.plugin(uniqueValidator);

export const Article = mongoose.model('Article', ArticleSchema);
