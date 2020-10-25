const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const path = require('path');
const winston = require('winston');

const PORT = 3000;

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

const app = express();
app.use(express.json());
// Static assets.
app.use(express.static(path.join(__dirname, 'public')));

// Logger.
app.use(
  morgan(':method :url :status :response-time ms', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Configure templating engine.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');
nunjucks.configure(app.get('views'), {
  autoescape: true,
  express: app,
});

app.post('/', (req, res) => {
  const username = req.body.username;
  const comment = req.body.comment;
  return res.send({ username, comment });
});

app.get('/', (request, response) => {
  const options = { pageTitle: 'Homepage' };
  return response.render('home', options);
});

app.listen(PORT, () => {
  logger.log({ level: 'info', message: `listening on ${PORT}` });
});
