const { MessageEmbed } = require("discord.js");

function capitalizeFirstLetter(string) {
  return string.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
}

module.exports = function helpEmbed(m) {
  let embed = new MessageEmbed();
  embed.setTitle("Help");
  Object.values(m.commandsWithoutAlias).map((c) => {
    embed.addField(
      capitalizeFirstLetter(c.name),
      `Description: ${c.description}\nUsage: \`${c.usage.replace(
        /{prefix}/g,
        m.prefix
      )}\`${
        c.alias.length > 0 ? "\nAliases: `" + c.alias.join(", ") + "`" : ""
      }`
    );
  });
  return embed;
};
