import request from '../../services/feeds/request.service.js';
import { Article, Publisher } from '../../models';

async function fetch(ctx) {
  const query = ctx.query;
  const type = Object.keys(query)[0];
  let result;

  switch (type) {
    case 'url':
      result = await fetchByUrl(query.url);
      break;
    case 'publisher':
      const publisher = await Publisher.findOne({ _id: query.publisher });
      result = await fetchByPublisher(publisher);
      break;
  }

  ctx.body = await result;
}

async function fetchByUrl(url) {
  const publisher = await Publisher.find({ sub: url }).then(publishers => {
    if (publishers.length) {
      return Promise.resolve(publishers[0]);
    }
    else {
      return request(url)
        .then(feed => {
          const meta = feed.meta
          meta.sub = url;
          const p = new Publisher(meta);
          return p.save();
        })
        .catch(error => {
          throw new Error('Bad url');
        });
    }
  });

  return await fetchByPublisher(publisher);
}

async function fetchByPublisher(publisher) {
  if (!publisher) {
    throw new Error('needs publisher');
  }

  const url = publisher.sub;

  const handleError = error => {
    console.log(error);
    return { error };
   };

  const receiveFeed = articles => {
    const result = articles.map(article => {
      article.meta = publisher;
      article = new Article(article);
      article.save();
      return article;
    });

    return { articles: result };
  };

  return await request(url)
    .then(receiveFeed)
    .catch(handleError);
}

export default {
  fetch
};
