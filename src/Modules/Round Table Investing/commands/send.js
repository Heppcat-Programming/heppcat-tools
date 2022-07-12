const { MessageActionRow, MessageButton } = require("discord.js");
module.exports = {
  name: "send",
  description: "Send a message in one of the trade channels",
  usage: "{prefix}send [type] [message]",
  alias: ["s", "announce", "message", "alert"],
  async execute(command) {
    let types = await command.db.collection("types").findOne({ id: "types" });
    let type = command.args.shift();
    if (types.array.includes(type)) {
      let row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("yes")
          .setLabel("Yes")
          .setStyle("SUCCESS"),
        new MessageButton().setCustomId("no").setLabel("No").setStyle("DANGER")
      );
      command.message
        .reply({
          content: `Are you sure you want to send the message \`${command.args.join(
            " "
          )}\` in the channel <#${types.object[type].cid}>?`,
          components: [row],
        })
        .then((m) => {
          let edit = false;
          let filter = (i) => m.id === i.message.id;

          let collector = m.channel.createMessageComponentCollector({
            filter,
            time: 15000,
          });

          collector.on("collect", async (i) => {
            if (i.user.id != command.message.author.id)
              return i.reply({
                ephermal: true,
                content: "This is not your button",
              });
            if (i.customId === "no") {
              let disabledrow = new MessageActionRow().addComponents(
                new MessageButton()
                  .setCustomId("yes")
                  .setLabel("Yes")
                  .setStyle("SUCCESS")
                  .setDisabled(true),
                new MessageButton()
                  .setCustomId("no")
                  .setLabel("No")
                  .setStyle("DANGER")
                  .setDisabled(true)
              );
              m.edit({
                content: "Canceled",
                components: [disabledrow],
              });
              i.deferUpdate();
              edit = true;
            } else if (i.customId === "yes") {
              command.message.guild.channels
                .fetch(types.object[type].cid)
                .then((channel) => {
                  channel.send(
                    command.args.join(" ") +
                      "\n\n" +
                      `*- ${command.message.author.tag}*`
                  );
                });
              i.deferUpdate();
              let disabledrow = new MessageActionRow().addComponents(
                new MessageButton()
                  .setCustomId("yes")
                  .setLabel("Yes")
                  .setStyle("SUCCESS")
                  .setDisabled(true),
                new MessageButton()
                  .setCustomId("no")
                  .setLabel("No")
                  .setStyle("DANGER")
                  .setDisabled(true)
              );
              m.edit({
                content: "Sent",
                components: [disabledrow],
              });
              edit = true;
            }
          });
          collector.on("end", () => {
            if (edit) return;
            let disabledrow = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("yes")
                .setLabel("Yes")
                .setStyle("SUCCESS")
                .setDisabled(true),
              new MessageButton()
                .setCustomId("no")
                .setLabel("No")
                .setStyle("DANGER")
                .setDisabled(true)
            );
            m.edit({
              content: "Canceled",
              components: [disabledrow],
            });
          });
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
