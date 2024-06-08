const dotenv = require("dotenv");
const program = require("../utils/commander.js");

const mode = program.opts().mode;

dotenv.config({
    path: mode === "produccion" ? "./.env.produccion" : "./.env.dessarrollo"
});

const configObject = {
    puerto: process.env.PUERTO,
    mongo_url: process.env.MONGO_URL,
    mode: mode  // Add this line to export the mode
};

module.exports = configObject;
