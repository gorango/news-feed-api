import koaRouter from 'koa-router';
import feeds from './feeds.controller';

export const feedsRouter = koaRouter()
  .get('/', feeds.fetch)
