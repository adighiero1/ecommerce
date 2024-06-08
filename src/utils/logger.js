

// const winston = require("winston");
// const { mode } = require("../config/config.js");

// const niveles = {
//   nivel: {
//     fatal: 0,
//     error: 1,
//     warning: 2,
//     info: 3,
//     http: 4,
//     debug: 5
//   },
//   colores: {
//     debug: "white",
//     http: "magenta",
//     info: "green",
//     warning: "blue",
//     error: "yellow",
//     fatal: "red"
//   }
// };

// const developmentLogger = winston.createLogger({
//   levels: niveles.nivel,
//   transports: [
//     new winston.transports.Console({
//       level: "debug",
//       format: winston.format.combine(
//         winston.format.colorize({ colors: niveles.colores }),
//         winston.format.simple()
//       )
//     })
//   ]
// });

// const productionLogger = winston.createLogger({
//   levels: niveles.nivel,
//   transports: [
//     new winston.transports.Console({
//       level: "info",
//       format: winston.format.combine(
//         winston.format.colorize({ colors: niveles.colores }),
//         winston.format.simple()
//       )
//     }),
//     new winston.transports.File({
//       filename: "./errors.log",
//       level: "warning",
//       format: winston.format.simple()
//     })
//   ]
// });

// const addProductionLogger = (req, res, next) => {
//   req.logger = productionLogger;
//   req.logger.http(`${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
//   next();
// };

// const addDevelopmentLogger = (req, res, next) => {
//   req.logger = developmentLogger;
//   req.logger.http(`${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
//   next();
// };

// const addLogger = mode === "produccion" ? addProductionLogger : addDevelopmentLogger;

// module.exports = addLogger;

const winston = require("winston");
const { mode } = require("../config/config.js");

const niveles = {
  nivel: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colores: {
    debug: "white",
    http: "magenta",
    info: "green",
    warning: "blue",
    error: "yellow",
    fatal: "red"
  }
};

const developmentLogger = winston.createLogger({
  levels: niveles.nivel,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: niveles.colores }),
        winston.format.simple()
      )
    })
  ]
});

const productionLogger = winston.createLogger({
  levels: niveles.nivel,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: niveles.colores }),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warning",
      format: winston.format.simple()
    })
  ]
});

const addProductionLogger = (req, res, next) => {
  req.logger = productionLogger;
  req.logger.http(`${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
};

const addDevelopmentLogger = (req, res, next) => {
  req.logger = developmentLogger;
  req.logger.http(`${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
};

const addLogger = mode === "produccion" ? addProductionLogger : addDevelopmentLogger;

module.exports = addLogger;