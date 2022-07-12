const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "types",
  description: "Get a list of the types of messages you can send",
  usage: "{prefix}types",
  alias: ["identifiers"],
  async execute(command) {
    let types = await command.db.collection("types").findOne({ id: "types" });
    let embed = new MessageEmbed();
    embed.setTitle("Types");
    let str = "";
    Object.values(types.object).map(
      (i) => (str += `**Type:** \`${i.type}\`, **Channel:** <#${i.cid}>\n\n`)
    );
    embed.setDescription(str);
    command.reply({ embeds: [embed] });
  },
};
