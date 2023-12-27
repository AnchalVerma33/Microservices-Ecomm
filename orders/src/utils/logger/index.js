const winston = require("winston");

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;
const winstonTimestampColorize = require("winston-timestamp-colorize");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "blue",
  debug: "white",
  timestamp: "cyan",
};

winston.addColors(colors);

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

const logFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  colorize({ all: true }),
  winstonTimestampColorize({ color: "cyan" }),
  printf((info) => `[ ${info.timestamp} ]  ${info.message}`),
);

const transport = [
  new transports.Console(),
  new transports.File({ filename: "error.log" }),
];

const logger = createLogger({
  level: level(),
  levels,
  format: logFormat,
  transports: transport,
});

module.exports = { logger };
