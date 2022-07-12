let perms = require("../perms.json");
module.exports = {
  name: "removetype",
  description: "Remove a message type - Owner Only",
  usage: "{prefix}removetype [type]",
  alias: ["deletetype"],
  async execute(command) {
    if (!perms.includes(command.message.author.id))
      return command.reply("Sorry you can not use this command");
    let currentTypes = await command.db
      .collection("types")
      .findOne({ id: "types" });
    if (!command.args[0])
      return command.reply("Please read the documentation for this command");
    if (!currentTypes.array.includes(command.args[0]))
      return command.reply("That type does not exist please create it first.");
    currentTypes.array.splice(currentTypes.array.indexOf(command.args[0]), 1);
    delete currentTypes.object[command.args[0]];
    command.db.collection("types").updateOne(
      {
        id: "types",
      },
      {
        $set: currentTypes,
      }
    );
    command.reply("Removed the type **" + command.args[0] + "**");
  },
};
