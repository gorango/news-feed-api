import { Publisher } from '../../models';

async function findAll(ctx) {
  try {
    let conditions = {};
    const query = ctx.query;
    if (query.conditions) {
      conditions = JSON.parse(query.conditions);
    }
    const builder = Publisher.find(conditions);
    ['limit', 'skip', 'sort', 'populate'].forEach(function(key) {
      if (query[key]) {
        builder[key](query[key]);
      }
    })
    const result = await builder.exec();
    ctx.body = result;
  } catch (error) {
    ctx.body = error;
  }
}

async function findById(ctx) {
  try {
    const result = await Publisher.findById(ctx.params.id).exec();
    ctx.body = result;
  } catch (error) {
    ctx.body = error;
  }
}

async function deleteById(ctx) {
  try {
    const result = await Publisher.findByIdAndRemove(ctx.params.id).exec();
    ctx.body = result;
  } catch (error) {
    ctx.body = error;
  }
}

async function replaceById(ctx) {
  try {
    await Publisher.findByIdAndRemove(ctx.params.id).exec();
    const newDocument = ctx.request.body;
    newDocument._id = ctx.params.id;
    const result = await Publisher.create(newDocument);
    ctx.body = result;
  } catch (error) {
    ctx.body = error;
  }
}

async function updateById(ctx) {
  try {
    const result = await Publisher.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true
    }).exec();
    ctx.body = result;
  } catch (error) {
    ctx.body = error;
  }
}

async function create(ctx) {
  try {
    const result = await Publisher.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.body = error;
  }
}

export default {
  findAll,
  findById,
  deleteById,
  replaceById,
  updateById,
  create
};
