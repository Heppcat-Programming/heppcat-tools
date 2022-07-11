module.exports = {
  name: "channelcount",
  description: "Get amount of channels",
  usage: "{prefix}channelcount",
  alias: [],
  async execute(command) {
    command.reply(`${command.message.guild.channels.channelCountWithoutThreads}`);
  },
};
