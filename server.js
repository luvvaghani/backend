const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
multer = require("multer");
require("dotenv").config();
const controller = require("./serverController");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bookSchema = require("./Model/bookSchema");
const { count } = require("console");

//app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);
//connect mongoDB:mongodb+srv://RedBack:<password>@cluster-redback.pa0yu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const URI =
  process.env.DB_PROTOCOL +
  "://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASS +
  "@" +
  process.env.DB_HOST +
  process.env.DB_CONNECTIONOPTIONS;
mongoose.connect(URI, { useNewUrlParser: true });

//send user value to MongoDB
app.post("/signup", (req, res) => {
  if (req) {
    controller.PostNewUser(req, res);
  } else {
    throw new Error("request cannot be empty");
  }
});

//find all user
app.get("/user", (req, res) => {
  if (req) {
    controller.FindAllUser(req, res);
  } else {
    throw new Error("request cannot be empty");
  }
});

//find a user with username: return password
app.post("/login", (req, res) => {
  if (req) {
    controller.PostLogin(req, res);
  } else {
    throw new Error("request cannot be empty");
  }
});

//find specific user with user ID or username
app.get("/user/:id", validateToken, (req, res) => {
  if (req) {
    controller.FindUser(req, res);
  } else {
    throw new Error("request cannot be empty");
  }
});

//delete with user ID or username
app.delete("/user/:id", (req, res) => {
  if (req) {
    controller.DeleteUserID(req, res);
  }
  {
    throw new Error("request cannot be empty");
  }
});

//change with user id or username
app.patch("/user/:id", (req, res) => {
  if (req) {
    controller.UpdateUser(req, res);
  }
  {
    throw new Error("request cannot be empty");
  }
});

app.post("/refreshToken", (req, res) => {
  try {
    if (req) {
      controller.RefreshToken(req, res);
    }
  } catch {
    throw new Error("request cannot be empty");
  }
});

app.delete("/logout", (req, res) => {
  if (req) {
    controller.Logout(req, res);
  } else {
    throw new Error("request cannot be empty");
  }
});
// Set storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

//Upload picture for certain user
app.patch("/user/:id/uploadphoto", upload.single("myImage"), (req, res) => {
  if (req) {
    controller.UploadUserPicture(req, res);
  } else {
    throw new Error("request cannot be empty");
  }
});

// Get profile picture
app.get("/user/:id/picture", (req, res, next) => {
  if (req) {
    controller.GetUserPicture(req, res);
  } else {
    throw new Error("request cannot be empty");
  }
});

// books api

app.put("/api/book/content/:id", (req, res) => {
  const { title, content } = req.body;

  if (!title & !content) {
    res.status(418).send({ message: "WE NEED TITLE OF THE BOOK" });
  }
  controller.UpdateBookDetail(req, res);
  res.send("Sucess");
});

app.post("/api/book/content", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(418).send({ message: "WE NEED TITLE AND CONTENT OF THE BOOK" });
  }
  controller.PostNewBok(req, res);
  res.send("Sucess");
});

app.get("/api/book/content", (req, res) => {
  if (req) {
    controller.FindAllBook(req, res);
  } else {
    throw new Error("request cannot be empty");
  }
});

//For kane to work
app.get("/api/book/content/:id", (req, res) => {
  // if (req) {
  //   controller.FindAllBook(req, res);
  // } else {
  //   throw new Error("request cannot be empty");
  // }
});

//For Emad to work
app.get("/api/book/content/count/:id", (req, res) => {
  if (req) {
    controller.GetTotalCountOfTheBook(req, res);
  } else {
    throw new Error("request cannot be empty");
  }
});

// Hemantsingh to worker
app.get("/api/book/content/:title", (req, res) => {
  // if (req) {
  //   controller.FindAllBook(req, res);
  // } else {
  //   throw new Error("request cannot be empty");
  // }
});

//Luv's  to worker
app.get("/api/book/content/title", (req, res) => {
  // if (req) {
  //   controller.FindAllBook(req, res);
  // } else {
  //   throw new Error("request cannot be empty");
  // }
});
app.delete("/api/book/content/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(418).send({ message: "WE NEED ID OF THE BOOK" });
  }
  controller.DeleteBook(req, res);
});

// book detail api

app.put("/api/book/content/:id/detail", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    res.status(418).send({ message: "WE NEED TITLE OF THE BOOK" });
  }
  res.send("Sucess");
});

app.post("/api/book/content/:id/detail", (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(418).send({ message: "WE NEED TITLE OF THE BOOK" });
  }
  res.send("Sucess");
});
app.get("/api/book/content/detail", (req, res) => {
  res.status(200).send([
    {
      id: 1,
      content: "PART I  The Psycohistorians",
    },
  ]);
});

app.get("/api/book/content/detail/:id", (req, res) => {
  res.status(200).send([
    {
      id: 1,
      content: "PART I  The Psycohistorians",
    },
  ]);
});

app.delete("/api/book/content/:id/detail/:detailId", (req, res) => {
  const { id } = req.params;

  res.send("Sucess");
});

function validateToken(req, res, next) {
  //get token from request header
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
  if (token == null) res.sendStatus(400).send("Token not present");
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403).send("Token invalid");
    } else {
      req.username = user;
      next(); //proceed to the next action in the calling function
    }
  }); //end of jwt.verify()
}

//listen to 8080 port
app.listen(process.env.SERVER_PORT, function (req, res) {
  console.log("Web server is running in " + process.env.SERVER_PORT + "...");
});
