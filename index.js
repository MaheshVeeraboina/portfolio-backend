const express = require("express");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "portfolio.db");

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    // Create tables if not exist
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

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

/* -------------------- PROJECTS -------------------- */

// Get all projects
app.get("/projects", async (req, res) => {
  const projects = await database.all(`SELECT * FROM project;`);
  res.send(projects);
});

// Add a project
app.post("/projects", async (req, res) => {
  const { name, description } = req.body;
  const query = `INSERT INTO project (name, description) VALUES (?, ?);`;
  await database.run(query, [name, description]);
  res.send("Project Successfully Added");
});

// Update a project
app.put("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const query = `
    UPDATE project
    SET name = ?, description = ?
    WHERE id = ?;
  `;
  await database.run(query, [name, description, id]);
  res.send("Project Updated Successfully");
});

// Delete a project
app.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  await database.run(`DELETE FROM project WHERE id = ?;`, [id]);
  res.send("Project Deleted Successfully");
});

// Delete all projects
app.delete("/projects", async (req, res) => {
  await database.run(`DELETE FROM project;`);
  res.send("All Projects Deleted Successfully");
});

/* -------------------- SKILLS -------------------- */

app.get("/skills", async (req, res) => {
  const skills = await database.all(`SELECT * FROM skill;`);
  res.send(skills);
});

app.post("/skills", async (req, res) => {
  const { category, label, imageUrl } = req.body;
  const query = `INSERT INTO skill (category, label, imageUrl) VALUES (?, ?, ?);`;
  await database.run(query, [category, label, imageUrl]);
  res.send("Skill Successfully Added");
});

app.put("/skills/:id", async (req, res) => {
  const { id } = req.params;
  const { category, label, imageUrl } = req.body;
  const query = `
    UPDATE skill
    SET category = ?, label = ?, imageUrl = ?
    WHERE id = ?;
  `;
  await database.run(query, [category, label, imageUrl, id]);
  res.send("Skill Updated Successfully");
});

app.delete("/skills/:id", async (req, res) => {
  const { id } = req.params;
  await database.run(`DELETE FROM skill WHERE id = ?;`, [id]);
  res.send("Skill Deleted Successfully");
});

app.delete("/skills", async (req, res) => {
  await database.run(`DELETE FROM skill;`);
  res.send("All Skills Deleted Successfully");
});

/* -------------------- CONTACT -------------------- */

// Get all contacts
app.get("/contacts", async (req, res) => {
  const contacts = await database.all(`SELECT * FROM contact;`);
  res.send(contacts);
});

// Add a contact message
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  const query = `INSERT INTO contact (name, email, message) VALUES (?, ?, ?);`;
  await database.run(query, [name, email, message]);
  res.send("Message Sent Successfully");
});

module.exports = app;
