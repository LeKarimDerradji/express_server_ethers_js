const express = require("express");
const fsPromises = require("fs/promises");

const LOG_FILE = "access-log.txt";

// async file logger
const logger = async (req) => {
  try {
    const date = new Date();
    const log = `${date.toUTCString()} ${req.method} "${
      req.originalUrl
    }" from ${req.ip} ${req.headers["user-agent"]}\n`;
    await fsPromises.appendFile(LOG_FILE, log, "utf-8");
  } catch (e) {
    console.error(`Error: can't write in ${LOG_FILE}`);
  }
};

// show on console
const shower = async (req) => {
  const date = new Date();
  const log = `${date.toUTCString()} ${req.method} "${req.originalUrl}" from ${
    req.ip
  } ${req.headers["user-agent"]}`;
  console.log(log);
};

const app = express();

const IP_LOOPBACK = "localhost";
const IP_LOCAL = "172.21.186.59"; // my local ip on my network
const PORT = 3333;

// GET sur la racine
app.get("/", 
  async (req, res, next) => {
    await logger(req);
    next();
  },
    (req, res, next) => {
      shower(req);
      next();
    },
    (req, res) => {
      res.send(`Welcome ${req.ip} to my first express app.`)
    });


// POST sur la racine
app.post("/", 
  async (req, res, next) => {
    await logger(req);
    next();
  },
    (req, res, next) => {
      shower(req);
      next();
    },
    (req, res) => {
      res.send("Sorry we don't post requests yet.");
    });

// GET sur '/hello'
app.get(
  "/hello",
  async (req, res, next) => {
    await logger(req);
    next();
  },
  (req, res, next) => {
    shower(req);
    next();
  },
  (req, res) => {
    res.send("Hello World!");
  }
);

// GET sur '/hello/sofiane'
app.get(
  "/planet/:planetId",
  async (req, res, next) => {
    await logger(req);
    next();
  },
  (req, res, next) => {
    shower(req);
    next();
  },
  (req, res) => {
    res.send(`${req.params.planetId}`);
  }
);

// GET sur '/hello/franck'
app.get(
  "/hello/franck",
  async (req, res) => {
    await logger(req);
    next();
  },
  (req, res, next) => {
    shower(req);
    next();
  },
  (req, res) => {
    res.send("Hello Franck!");
  }
);

// start the server
app.listen(PORT, IP_LOCAL, () => {
  console.log(`Example app listening at http://${IP_LOOPBACK}:${PORT}`);
});
