const express = require("express");

const app = express();

const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const intializedbServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("server running at localhost:3001");
    });
  } catch (e) {
    console.log(`db error:${e.message}`);
    process.exit(1);
  }
};

intializedbServer();

app.get("/players/", async (request, response) => {
  const dbQuery = `SELECT *
    FROM cricket_team;`;
  const result = await db.all(dbQuery);
  response.send(result);
});

app.post("/players/", async (request, response) => {
  const dbQuery = `INSERT INTO cricket_team(player_name,jersey_number,role)
    values("Vishal","17","Bowler");`;

  const dbResponse = await db.run(dbQuery);

  const player_id = dbResponse.lastID;

  response.send("Player Added to Team");
});

app.get("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;

  const dbQuery = `select *
    from cricket_team
    where player_id = ${player_id}`;

  const dbResponse = await db.get(dbQuery);

  response.send(dbResponse);
});

app.put("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;

  const dbQuery = `UPDATE cricket_team
  SET
  "player_name" = "Maneesh",
  "jersey_number" = 54,
  "role" = "All-rounder"
  WHERE player_id = ${player_id};`;

  await db.run(dbQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const dbQuery = `DELETE FROM cricket_team
    WHERE player_id = ${player_id};`;

  await db.run(dbQuery);

  response.send("Player Removed");
});

module.exports = app;
