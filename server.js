const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const PinoHttp = require("pino-http");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const errorResponse = (res) => {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Internal Server Error');
};

app.prepare().then(() => {
  const logger = PinoHttp({
    customSuccessMessage: (req, res) => {
      return `${req.method} ${req.url}`;
    },
    autoLogging: {
      ignore: (req) => {
        if (req.url.startsWith('/_next/static/')) {
          return true;
        }
        if (req.url.startsWith('/decor/')) {
          return true;
        }
        return false;
      },
    },
  });
  const server = createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      logger(req, res);
      await handle(req, res, parsedUrl);
    } catch (err) {
      logger.logger.error(err, `Error occurred handling ${req.url}`);
      return errorResponse(res);
    }
  });
  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    logger.logger.info(`> Ready on http://${hostname}:${port}`);
  });
})
