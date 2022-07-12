const EventEmitter = require("events");
const fs = require("fs");
module.exports = class Module extends EventEmitter {
  /**
   * Module Class
   * @param {Client} client Bot Client
   * @param {String} commandPath Full path of module commands
   * @param {String} guildID Guild Id that the module works in
   * @param {String} prefix Guild Prefix
   */
  constructor(client, commandPath, guildID = "global", prefix = "?") {
    super({ captureRejections: true });
    this.commandPath = commandPath;
    this.guildID = guildID;
    this.client = client;
    this.prefix = prefix;
    this.loadCommands();
  }
  execute(Command) {
    try {
      this.commands[Command.name].execute(Command);
    } catch (error) {
      Command.reply("Error `" + error + "`");
    }
  }
  isCommand(message) {
    let msg = message.content;
    if (msg.toLowerCase().startsWith(this.prefix)) {
      const args = msg.slice(this.prefix.length).trim().split(/ +/);
      let command = args.shift().toLowerCase();
      if (this.prefixes.includes(command))
        if (args.length < 1) {
          message.reply(
            "This is a command prefix not a command, `" + this.prefix + "help`"
          );
          return { command: false };
        } else command += " " + args.shift().toLowerCase();
      if (!this.commands[command])
        return {
          command: false,
          modulePrefix: true,
          attemptedCommand: command,
        };
      return { command: true, data: { name: command, args: args } };
    } else {
      return { command: false };
    }
  }
  async loadCommands() {
    this.commands = {};
    this.commandsWithoutAlias = {};
    this.prefixes = [];
    let files = fs.readdirSync(this.commandPath);
    for (let f in files) {
      let file = files[f];
      if (file.endsWith(".js")) {
        let f = require(this.commandPath + "/" + file);
        let name = f.name;
        if (f.prefix) this.prefixes.push(name);
        else {
          await Promise.all(
            f.alias.map((i) => {
              this.commands[i] = f;
            })
          );
          this.commands[name] = f;
          this.commandsWithoutAlias[name] = f;
        }
      }
    }
  }
};
