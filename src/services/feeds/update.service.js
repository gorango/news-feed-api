import request from './request.service';
import { logger } from '../logger';
import { Article, Publisher } from '../../models';

export async function updateFeeds() {
  logger.info(`[STARTING UPDATE]: ${new Date()}`);
  let count = 0;
  await Publisher.find().exec().then(publishers => {
    count = publishers.length;
    publishers.forEach(publisher => {
      const url = publisher.sub;
      request(url)
        .then(feed => {
          feed.articles.map(article => {
            article.meta = publisher;
            article = new Article(article);
            article.save();
          });
        })
        .catch(error => {
          logger.error(`[OUTGOING GET ${url}]: FAILED`, error);
          logger.debug(`[OUTGOING GET ${url}]: error:`, error);
        });
    });
  });
  logger.info(`[ENDING UPDATE]: ${count} Publishers updated`);
}

export async function cleanUpFeeds() {
  logger.info(`[STARTING CLEANUP]: ${new Date()}`);
  let count = 0;
  // Remove all older than 7 days.
  await Article.find().exec().then(articles => {
    articles.forEach(article => {
      const now = new Date().valueOf();
      const then = new Date(article.date).valueOf();
      const diff = (now - then) / 1000 / 60 / 60 / 24;

      if (diff > 7) {
        count++;
        Article.findByIdAndRemove(article._id).exec();
      }
    })
  })
  logger.info(`[ENDING CLEANUP]: ${count} Articles removed`);

}
