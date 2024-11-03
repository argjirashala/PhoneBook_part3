const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static(path.join(__dirname, "dist")));

const persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

app.get("/api/persons", (req, res) => res.json(persons));
app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});
app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: "person not found" });
  }
});
app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) return res.status(400).json({ error: "name is required" });
  if (!body.number)
    return res.status(400).json({ error: "number is required" });
  if (persons.some((person) => person.name === body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }
  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number,
  };
  persons.push(newPerson);
  res.json(newPerson);
});
app.delete("/api/persons/:id", (req, res) => {
  const index = persons.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    persons.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ error: "person not found" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
