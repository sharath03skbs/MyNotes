const express = require("express");
const User = require("../models/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator"); //For Client side validation of the Entered Data
const bcrypt = require("bcryptjs"); //To generate secure password out of user's password

var jwt = require("jsonwebtoken"); //For user authentication
const fetchuser = require("../middleware/fetchuser");
const JWT_SEC = "sharkysignedthis";

//Route 1 :Create User using : POST "/api/auth/createuser" . No Login required.

router.post(
  "/createuser",
  [
    //This array is for validation
    body("email", "Enter a valid name").isEmail(),
    body("name", "Enter a valid email").isLength({ min: 3 }),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //If there are errors return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check whether user with this email already exist
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exist." });
      }
      //Creating a Secure Password using Hash and Salt
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SEC); //Once the user is authenticated and receives this token , this token can be used to check the authenticity in future requests made by the user
      //res.json(user);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
    // .then((user) => res.json(user))
    // .catch((err) => {
    //   console.log(err);
    //   res.json({
    //     error: "Please enter a unique value for email",
    //     message: err.message,
    //   });
    // });
  }
);

//Route2 : Authenticate User using : POST "/api/auth/login" . No Login required.
router.post(
  "/login",
  [
    //This array is for validation
    body("email", "Enter a valid name").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
    //If there are errors return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SEC);
      res.send({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route 3 : Getting logged in user details : POST "/api/auth/getuser" . Login required.

router.post("/getuser",fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); //Fetching every field except password
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
