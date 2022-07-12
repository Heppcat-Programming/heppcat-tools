let perms = require("../perms.json");
module.exports = {
  name: "addtype",
  description: "Add a message type - Owner Only",
  usage: "{prefix}addtype [type] [channelMention]",
  alias: ["createtype"],
  async execute(command) {
    if (!perms.includes(command.message.author.id))
      return command.reply("Sorry you can not use this command");
    let currentTypes = await command.db
      .collection("types")
      .findOne({ id: "types" });
    if (!command.args[0] || !command.message.mentions.channels.first())
      return command.reply("Please read the documentation for this command");
    if (currentTypes.array.includes(command.args[0]))
      return command.reply(
        "That already exists. To update it please remove then add the type."
      );
    currentTypes.array.push(command.args[0]);
    currentTypes.object[command.args[0]] = {
      type: command.args[0],
      cid: command.message.mentions.channels.first().id,
    };
    command.db.collection("types").updateOne(
      {
        id: "types",
      },
      {
        $set: currentTypes,
      }
    );
    command.reply(
      "Created the type **" +
        command.args[0] +
        "** that sends messages in the channel <#" +
        command.message.mentions.channels.first().id +
        ">"
    );
  },
};
