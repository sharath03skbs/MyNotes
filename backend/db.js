const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/mynotes";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("connected to MongoDB"))
    .catch((e) => console.log(e));
};

module.exports = connectToMongo;
