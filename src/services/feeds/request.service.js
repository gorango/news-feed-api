import Request from 'request';
import FeedParser from 'feedparser';
import cheerio from 'cheerio';
import { extractEntities } from './entities.service';

async function fetchFeed(url) {
  const feedparser = new FeedParser();
  let request;
  let articles = [];
  let meta;

  try {
    request = await Request(url);
  } catch (error) {
    return Promise.reject(new Error('Bad url'))
  }

  return new Promise((resolve, reject) => {
    request.on('error', handleError);
    request.on('response', receiveRequest);

    feedparser.on('error', handleError);
    feedparser.on('readable', readStream);
    feedparser.on('end', receiveFeed);

    function handleError(error) {
      if (error) reject(error);
    }

    function receiveRequest(result) {
      if (result.statusCode != 200) handleError(result);
      request.pipe(feedparser);
    }

    function readStream() {
      const stream = this;
      let item;
      meta = stream.meta;

      while (item = stream.read()) {
        articles = [...articles, item];
      }
    }

    function receiveFeed() {
      const result = { meta, articles };
      resolve(result);
    }
  });
}

const tidyArticles = (feed) => {
  const articles = feed.articles;
  return articles.map(article => {
    const doc = cheerio.load(article.description);
    const text = doc.text();
    article.text = text;
    article.entities = extractEntities(`${article.title} ${text}`)
    return {
      title: article.title,
      entities: article.entities,
      description: article.description,
      summary: article.summary,
      text: article.text,
      link: article.link,
      date: article.date,
      pubdate: article.pubdate,
      author: article.author,
      guid: article.guid,
      comments: article.comments,
      image: article.image,
      categories: article.categories,
      source: article.source,
      enclosures: article.enclosures
    };
  })
}

async function request(url) {
  if (!url) return Promise.reject(new Error('No url'));

  return await fetchFeed(url)
    .then(feed => tidyArticles(feed));
}

export default request;
