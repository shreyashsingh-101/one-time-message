const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");

//Setting View Engine

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "public"));

// Body Parser Middleware

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Setting Static Folder

app.use(express.static(path.join(__dirname, "public")));

//Connecting to MongoDB

mongoose.connect(
  "mongodb+srv://rohit:rohit123@cluster0.ceea0.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.on("connected", () => {
  console.log("Connected to database");
});

const Page = mongoose.model("Page", {
  key: String,
  value: String,
});

// Routes

// Home Route

app.get("/*", (req, res) => {
  let key = req.url.slice(1);
  if (req.url === "/") res.render("index");
  else {
    Page.findOneAndDelete({ key: key }, (err, page) => {
      if (err) throw err;
      if (page) {
        res.render("message", { message: page.value });
      } else {
        res.render("error");
      }
    });
  }
});

// Post Route

app.post("/", urlencodedParser, (req, res) => {
  let data = req.body.form_data;
  let key = uuidv4();
  Page.create({ key: key, value: data }, (err, page) => {
    if (err) throw err;
  });

  res.render("index", {
    key: key,
  });
});

// Server

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
