const { MongoClient } = require("mongodb");

class DB {
  constructor(config) {
    let client = new MongoClient(config.db);
    client.connect();
    this.client = client;
  }
}
module.exports = DB;
