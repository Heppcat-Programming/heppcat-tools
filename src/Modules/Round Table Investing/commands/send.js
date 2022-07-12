module.exports = {
  name: "send",
  description: "Send a message in one of the trade channels",
  usage: "{prefix}send [type] [message]",
  alias: ["s", "announce", "message", "alert"],
  async execute(command) {
    let types = await command.db.collection("types").findOne({ id: "types" });
    let type = command.args.shift();
    if (types.array.includes(type)) {
      command.message.guild.channels
        .fetch(types.object[type].cid)
        .then((channel) => {
          channel.send(
            command.args.join(" ") +
              "\n\n" +
              `*- ${command.message.author.tag}*`
          );
        });
    } else {
      let stringOfTypes = "";
      Object.values(types.object).map(
        (i) =>
          (stringOfTypes += `**Type:** \`${i.type}\`, **Channel:** <#${i.cid}>\n`)
      );
      command.reply(
        `Hm looks like we don't have that type please pick from this list:\n\n${stringOfTypes}`
      );
    }
  },
};
