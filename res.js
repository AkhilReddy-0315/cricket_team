const express = require("express");
const app = express();

app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("the server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`error is: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
const convertSnakeToCamelCase = (object) => {
  return {
    playerId: object.player_id,
    playerName: object.player_name,
    jerseyNumber: object.jersey_number,
    role: object.role,
  };
};
app.get("/players/", async (req, res) => {
  const getPlayersQuery = `SELECT * FROM cricket_team;`;
  const resultIs = await db.all(getPlayersQuery);
  res.send(
    resultIs.map((eachPlayer) => {
      convertSnakeToCamelCase(eachPlayer);
    })
  );
});

// Add API
app.post("/players/", async (request, res) => {
  const { player_name, jersey_number, role } = request.body;
  const getPlayersQuery = `INSERT INTO cricket_team
  (player_name, jersey_number, role) VALUES('${player_name}',${jersey_number},'${role}');`;
  const resDb = await db.run(getPlayersQuery);
  res.send("Player Added to Team");
});

//GET API

app.get("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const getPlayersQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  const resultIs = await db.get(getPlayersQuery);
  res.send(
    resultIs.map((eachPlayer) => {
      convertSnakeToCamelCase(eachPlayer);
    })
  );
});

//PUT API
app.put("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const { player_name, jersey_number, role } = req.body;

  const updateQuery = `UPDATE cricket_team SET 
    player_name = '${player_name}',
    jersey_number = ${jersey_number},
    role = '${role}' WHERE player_id = ${playerId};`;

  await db.run(updateQuery);
  res.send("Player Details Updated");
});

//DELETE API
app.delete("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const getPlayersQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  await db.get(getPlayersQuery);
  res.send("Player Removed");
});
