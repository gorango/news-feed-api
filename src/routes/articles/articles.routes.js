import koaRouter from 'koa-router';
import articles from './articles.controller';

export const articlesRouter = koaRouter()
  .get('/', articles.findAll)
  .post('/', articles.create)
  .put('/', articles.create)
  .get('/:id', articles.findById)
  .post('/:id', articles.updateById)
  .del('/:id', articles.deleteById)
  .put('/:id', articles.replaceById)
  .patch('/:id', articles.updateById);
