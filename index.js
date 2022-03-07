import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect(
  "mongodb://localhost:27017/myLoginDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB connected");
  }
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  phoneNumber: String,
  completeAddress: String,
  zipCode: String,
});

const User = new mongoose.model("User", userSchema);
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfull", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});
app.post("/signup", (req, res) => {
  const { email, password, phoneNumber, completeAddress, zipCode } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "email is already registered with us" });
    } else {
      const user = new User({
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        completeAddress: completeAddress,
        zipCode: zipCode,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "signup successfull" });
        }
      });
    }
  });
});

app.listen(9002, () => {
  console.log("BE started at port 9002");
});
