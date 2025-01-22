import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "taskmdb",
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/tasks", (req, res) => {
  const q = "SELECT * FROM tasks";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/tasks", (req, res) => {
  const q =
    "INSERT INTO tasks(`title`, `description`,`status`,`date`) VALUES (?)";

  const values = [
    req.body.title,
    req.body.description,
    req.body.status,
    req.body.date,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const q = " DELETE FROM tasks WHERE id = ? ";
  db.query(q, [taskId], (err, data) => {
    if (err) return res.send(err);
    console.log(err);
    return res.json(data);
  });
  
});

app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const q = "UPDATE tasks SET `title`= ?, `description`= ?, `status`= ?, `date`= ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.description,
    req.body.status,
    req.body.date,
  ];

  db.query(q, [...values,taskId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("backend");
});
