const connectToMongo = require("./db");
const express = require("express");

connectToMongo();

const app = express();
const port = 5000;

//Middleware to make use of Json in request and response
app.use(express.json());

//Available Routes (With the help of use , we can link the routes with a file)

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
