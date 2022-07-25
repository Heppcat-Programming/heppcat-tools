const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const config = require("../config.json");
const DB = require("./constructors/DB.js");
const db = new DB(config).client;
let ModuleManager = require("./constructors/ModuleManager");
const helpEmbed = require("./functions/helpEmbed");
const api = require("./api/express");
ModuleManager = new ModuleManager(client, __dirname + "/./Modules", db);

client.on("ready", () => {
  api(3000);
});

client.on("messageCreate", (msg) => {
  let module = ModuleManager.modules["global"];
  let _moduleForGuild = ModuleManager.modules[msg.guild.id];
  let _guildModuleCommand = _moduleForGuild
    ? _moduleForGuild.isCommand(msg)
    : { command: false };
  let command = module.isCommand(msg);
  if (_guildModuleCommand.command) {
    module = _moduleForGuild;
    command = _guildModuleCommand;
  }
  if (command.command)
    module.execute(ModuleManager.parseCommand(msg, module, command.data));
  else if (_guildModuleCommand.modulePrefix) {
    if (_guildModuleCommand.attemptedCommand === "help") {
      msg.reply({ embeds: [helpEmbed(_moduleForGuild)] });
    }
  } else if (command.modulePrefix) {
    if (command.attemptedCommand === "help") {
      msg.reply({ embeds: [helpEmbed(module)] });
    }
  }
});

module.exports = ModuleManager;

client.login(config.token);
