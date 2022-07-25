const app = require("express")();

app.get("/bot", async function (req, res) {
  let ModuleManager = require("../index");
  let guilds = await ModuleManager.client.guilds.fetch(true);
  res.json(
    JSON.parse(
      JSON.stringify(
        {
          guilds: guilds,
        },
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
      )
    )
  );
});

app.get("/module/:module", (req, res) => {
  let ModuleManager = require("../index");
  if (!ModuleManager.modulesByName[req.params.module.toLowerCase()])
    return res.status(404).send("Not Found");
  res.json(
    ModuleManager.modulesByName[req.params.module.toLowerCase()].toJson()
  );
});

app.get("/modules", (req, res) => {
  let ModuleManager = require("../index");
  if (req.query.m) {
    if (!ModuleManager.modulesByName[req.query.m.toLowerCase()])
      return res.status(404).send("Not Found");
    res.json(ModuleManager.modulesByName[req.query.m.toLowerCase()].toJson());
  } else {
    res.json(Object.values(ModuleManager.modules).map((i) => i.toJson()));
  }
});

app.get("/heartbeat", (req, res) => {
  res.status(200).send("OK");
});

module.exports = function listen(port) {
  app.listen(port);
};
