module.exports = class Command {
  /**
   * Command Class
   * @param {Message} message
   * @param {Client} client
   * @param {DB} db
   */
  constructor(name, args, message, client, db) {
    this.name = name;
    this.args = args;
    this.message = message;
    this.client = client;
    this.db = db;
  }
  /**
   * Reply Function
   * @param {String/Object} reply What to reply with
   */
  async reply(reply) {
    this.message.reply(reply);
  }
};
