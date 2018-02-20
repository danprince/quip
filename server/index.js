let dotenv = require("dotenv");
let chalk = require("chalk");
let log = require("winston");
let server = require("./lib/server");

dotenv.config();

server.listen(process.env.PORT);

log.info(`Quip server running on ${chalk.green(process.env.PORT)}`);

