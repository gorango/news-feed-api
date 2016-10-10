import Koa from 'koa';
import koaRouter from 'koa-router';
import bodyParser from 'koa-body';
import koaConvert from 'koa-convert';
import helmet from 'koa-helmet';
import mongo from 'koa-mongo';
import mongoose from 'mongoose';

import { logger } from './services/logger';
import { generateRequestId } from './middleware/request-id-generator';
import { errorResponder } from './middleware/error-responder';
import { k } from './project-env';
import { scheduleFeedsUpdate, scheduleFeedsCleanup } from './services/feeds/schedule.service';

import { rootRouter } from './routes/root.routes';
import { healthCheckRouter } from './routes/health-check/health-check.routes';
import { demoRouter } from './routes/demo/demo.routes';
import { feedsRouter } from './routes/feeds/feeds.routes';
import { articlesRouter } from './routes/articles/articles.routes';
import { publishersRouter } from './routes/publishers/publishers.routes';

export const app = new Koa();

// Entry point for all modules.
const api = koaRouter()
  .use('/', rootRouter.routes())
  .use('/health', healthCheckRouter.routes())
  .use('/demo', demoRouter.routes())
  .use('/feeds', feedsRouter.routes())
  .use('/articles', articlesRouter.routes())
  .use('/publishers', publishersRouter.routes())

/* istanbul ignore if */
if (k.REQUEST_LOGS) {
  const morgan = require('koa-morgan');
  const format = '[RQID=:request-id] - :remote-user' +
    ' [:date[clf]] ":method :url HTTP/:http-version" ' +
    ':status :res[content-length] ":referrer" ":user-agent"';
  morgan.token('request-id', req => req.requestId);
  app.use(morgan(format));
}

app
  .use(mongo())
  .use(helmet())
  .use(koaConvert(bodyParser()))
  .use(generateRequestId)
  .use(errorResponder)
  .use(api.routes())
  .use(api.allowedMethods());

const mongoUrl = 'localhost:27017';
mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl);

function startFunction(id) {
  const PORT = process.env.PORT || 3000;
  logger.info(`Starting server on port ${PORT}`);
  app.listen(PORT);
  // initialize scheduled feed fetching
  if (id === 1) {
    scheduleFeedsUpdate();
    scheduleFeedsCleanup();
  }
}

/* istanbul ignore if */
if (require.main === module) {
  // initialize cluster
  const throng = require('throng');
  throng(startFunction);
}
