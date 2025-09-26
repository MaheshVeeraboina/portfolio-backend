const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "portfolio.db");

const app = express();
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    await database.exec(`
      CREATE TABLE IF NOT EXISTS project (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT
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
app.get("/projects/", async (req, res) => {
  const getProjectsQuery = `SELECT * FROM project;`;
  const projects = await database.all(getProjectsQuery);
  res.send(projects);
});

app.post("/projects/", async (req, res) => {
  const { name, description } = req.body;
  const addProjectQuery = `
    INSERT INTO project (name, description)
    VALUES ('${name}', '${description}');
  `;
  await database.run(addProjectQuery);
  res.send('Project Successfully Added  ');
});

app.put("/projects/:id/", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const updateProjectQuery = `

    UPDATE project
    SET name = '${name}',
        description = '${description}'  
    WHERE id = ${id};
  `;
  await database.run(updateProjectQuery);
  res.send("Project Updated Successfully");
} );


app.delete("/projects/", async (req, res) => {  
        const deleteAllProjectsQuery = `DELETE FROM project;`;
        await database.run(deleteAllProjectsQuery);
        res.send("All Projects Deleted Successfully");
});

app.delete("/projects/:id/", async (req, res) => {
  const { id } = req.params;
  const deleteProjectQuery = `DELETE FROM project WHERE id = ${id};`;
  await database.run(deleteProjectQuery);
  res.send("Project Deleted Successfully");
});


app.get("/skills", async (req, res) => {
  const getSkillsQuery = `SELECT * FROM skill;`;
  const skills = await database.all(getSkillsQuery);
  res.send(skills);
});

app.post("/skills/", async (req, res) => {
  const { category,label,imageUrl } = req.body;
  const addSkillQuery = `
    INSERT INTO skill (category,label,imageUrl)
    VALUES ('${category}', '${label}', '${imageUrl}');
  `;
  await database.run(addSkillQuery);
  res.send('Skill Successfully Added  ');
});

app.delete("/skills/", async (req, res) => {
        const deleteAllSkillsQuery = `DELETE FROM skill;`;
        await database.run(deleteAllSkillsQuery);
        res.send("All Skills Deleted Successfully");
}
);

app.delete("/skills/:id/", async (req, res) => {
  const { id } = req.params;
  const deleteSkillQuery = `DELETE FROM skill WHERE id = ${id};`;
  await database.run(deleteSkillQuery);
  res.send("Skill Deleted Successfully");
} );

app.put("/skills/:id/", async (req, res) => {
  const { id } = req.params;
  const { category,label,imageUrl } = req.body; 
  const updateSkillQuery = `
    UPDATE skill
    SET category = '${category}',
        label = '${label}', 
        imageUrl = '${imageUrl}'
    WHERE id = ${id};
  `;
  await database.run(updateSkillQuery);
  res.send("Skill Updated Successfully");
} );

app.get("/contacts/", async (req, res) => {
  const getContactsQuery = `SELECT * FROM contact;`;
  const contacts = await database.all(getContactsQuery);
  res.send(contacts);
});

app.post("/contacts/", async (req, res) => {
  const { name, email, message } = req.body;
  const addContactQuery = `insert into contact (name,email,message) values ('${name}','${email}','${message}');`;
  await database.run(addContactQuery);
  res.send("Message Sent Successfully");
} );


module.exports = app;
