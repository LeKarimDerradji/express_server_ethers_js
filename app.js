const express = require("express");
const ethers = require("ethers");
require("dotenv").config();
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const {logger, timer, shower} = require('./middlewares')

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const INFURA_PROJECT_PRIVATE = process.env.INFURA_PROJECT_PRIVATE;

const provider = new ethers.providers.InfuraProvider("homestead", {
  projectId: INFURA_PROJECT_ID,
  projectSecret: INFURA_PROJECT_PRIVATE,
});


const app = express();

const IP_LOOPBACK = "localhost";
const IP_LOCAL = "172.21.186.59"; // my local ip on my network
const PORT = 3333;

app.use(timer)
app.use(logger)
app.use(shower)

// GET sur la racine
app.get(
  "/",
  async (req, res, next) => {
    await logger(req);
    next();
  },
  (req, res, next) => {
    shower(req);
    next();
  },
  (req, res) => {
    res.send(`Welcome ${req.ip} to my first express app.`);
  }
);

// POST sur la racine
app.post(
  "/",
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
  }
);


app.get(
  "/getBalance/:account",
  async (req, res, next) => {
    await logger(req);
    next();
  },
  (req, res, next) => {
    shower(req);
    next();
  },
  async (req, res) => {
    try {
      const bigNumber = await provider.getBalance(req.params.account);
      const balance = ethers.utils.formatEther(bigNumber);
      res.send(balance);
    } catch (error) {
      res.send(error);
    }
  }
);


app.get(
  "/exec/:command",
  async (req, res, next) => {
    await logger(req);
    next();
  },
  (req, res, next) => {
    shower(req);
    next();
  },
  async (req, res) => {
    let stdout = await exec(req.params.command);
    res.send(stdout);
  }
);

// start the server
app.listen(PORT, IP_LOCAL, () => {
  console.log(`Example app listening at http://${IP_LOOPBACK}:${PORT}`);
});
