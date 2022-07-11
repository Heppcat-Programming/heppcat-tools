const EventEmitter = require("events");
const Module = require("./Module");
const Command = require("./Command");
const fs = require("fs");
module.exports = class ModuleManager extends EventEmitter {
  constructor(client, modulePath, dbclient) {
    super({ captureRejections: true });
    this.client = client;
    this.modulePath = modulePath;
    this.dbclient = dbclient;
    this.loadModules();
  }
  loadModules() {
    this.modules = {};
    let folders = fs.readdirSync(this.modulePath);
    for (let folder in folders) {
      let files = fs.readdirSync(this.modulePath + "/" + folders[folder]);
      for (let f in files) {
        let file = files[f];
        if (file === "Module.js") {
          let f = require(this.modulePath + "/" + folders[folder] + "/" + file);
          let module = new Module(
            this.client,
            f.commandPath,
            f.guildID,
            f.prefix
          );
          this.modules[module.guildID] = module;
        }
      }
    }
  }
  /**
   * Parse a command
   @param {Message} message
   @param {Module} module
   */
  parseCommand(message, module, data) {
    return new Command(
      data.name,
      data.args,
      message,
      this.client,
      this.dbclient.db(module.guildID)
    );
  }
};
