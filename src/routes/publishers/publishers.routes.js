import koaRouter from 'koa-router';
import publishers from './publishers.controller';

export const publishersRouter = koaRouter()
  .get('/', publishers.findAll)
  .post('/', publishers.create)
  .put('/', publishers.create)
  .get('/:id', publishers.findById)
  .post('/:id', publishers.updateById)
  .del('/:id', publishers.deleteById)
  .put('/:id', publishers.replaceById)
  .patch('/:id', publishers.updateById);
