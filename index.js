const express = require("express");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const databasePath = path.join(__dirname, "portfolio.db");
let database = null;

// Initialize DB and server
const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database
    });

    // Create tables if they don't exist
    await database.exec(`
      CREATE TABLE IF NOT EXISTS project (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT
      );
    `);

    await database.exec(`
      CREATE TABLE IF NOT EXISTS skill (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT,
        label TEXT,
        imageUrl TEXT
      );
    `);

    await database.exec(`
      CREATE TABLE IF NOT EXISTS contact (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT
      );
    `);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

/* -------------------- PROJECTS -------------------- */
app.get("/projects", async (req, res) => {
  const projects = await database.all(`SELECT * FROM project`);
  res.send(projects);
});

app.post("/projects", async (req, res) => {
  const { name, description } = req.body;
  await database.run(`INSERT INTO project (name, description) VALUES (?, ?)`, [name, description]);
  res.send("Project added successfully");
});

app.put("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  await database.run(`UPDATE project SET name = ?, description = ? WHERE id = ?`, [name, description, id]);
  res.send("Project updated successfully");
});

app.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  await database.run(`DELETE FROM project WHERE id = ?`, [id]);
  res.send("Project deleted successfully");
});

/* -------------------- SKILLS -------------------- */
app.get("/skills", async (req, res) => {
  const skills = await database.all(`SELECT * FROM skill`);
  res.send(skills);
});

app.post("/skills", async (req, res) => {
  const { category, label, imageUrl } = req.body;
  await database.run(`INSERT INTO skill (category, label, imageUrl) VALUES (?, ?, ?)`, [category, label, imageUrl]);
  res.send("Skill added successfully");
});

app.put("/skills/:id", async (req, res) => {
  const { id } = req.params;
  const { category, label, imageUrl } = req.body;
  await database.run(`UPDATE skill SET category = ?, label = ?, imageUrl = ? WHERE id = ?`, [category, label, imageUrl, id]);
  res.send("Skill updated successfully");
});

app.delete("/skills/:id", async (req, res) => {
  const { id } = req.params;
  await database.run(`DELETE FROM skill WHERE id = ?`, [id]);
  res.send("Skill deleted successfully");
});

/* -------------------- CONTACT -------------------- */
app.get("/contacts", async (req, res) => {
  const contacts = await database.all(`SELECT * FROM contact`);
  res.send(contacts);
});

app.post("/contacts", async (req, res) => {
  const { name, email, message } = req.body;
  await database.run(`INSERT INTO contact (name, email, message) VALUES (?, ?, ?)`, [name, email, message]);
  res.send("Message sent successfully");
});

module.exports = app;
