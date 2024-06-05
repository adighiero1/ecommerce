// Importing the required modules using CommonJS

const { Command } = require("commander");

// Creating a new instance of Command
const program = new Command();

// Configuring the command-line options
program
  .option("-p <port>", "puerto donde se inicia el servidor", 8080)
  .option("--mode <mode>", "modo de trabajo", "produccion");

program.parse();

// console.log("Options:", program.options);

module.exports = program;
