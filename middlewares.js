const fsPromises = require("fs/promises");
const path = require("path");

module.exports.timer = (req, res, next) => {
  const date = new Date();
  req.requestDate = date.toUTCString();
  next();
};

// logger middleware
module.exports.logger = async (req, res, next) => {
  try {
    const log = `${req.requestDate} ${req.method} "${req.originalUrl}" from ${req.ip} ${req.headers["user-agent"]}\n`;
    await fsPromises.appendFile(LOG_FILE, log, "utf-8");
  } catch (e) {
    console.error(`Error: can't write in ${LOG_FILE}`);
  } finally {
    next();
  }
};

// shower middleware
module.exports.shower = async (req, res, next) => {
  const log = `${req.requestDate} ${req.method} "${req.originalUrl}" from ${req.ip} ${req.headers["user-agent"]}`;
  console.log(log);
  next();
};
