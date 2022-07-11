module.exports = {
  name: "test",
  description: "Test command",
  usage: "{prefix}test",
  alias: [],
  async execute(command) {
    command.reply("test");
  },
};
