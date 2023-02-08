const newuserModel = require("../models/newuser.model");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "MYSECRETKEY"

// const newuserController = {

exports.adduser = async (req, res) => {
  try {
    const { name, email, password, dob, phonenumber, designation, emp_id, date_of_joining } = req.body;
    const existingUser = await newuserModel.findOne({ email: email });
    if (existingUser)
      return res
        .status(400).json({ msg: "An account with this email already exists." });
    const adduser = new newuserModel({
      name,
      email,
      password,
      phonenumber,
      dob,
      emp_id,
      designation,
      date_of_joining

    });
    const savedUser = await adduser.save();

    const token = jwt.sign({ email: savedUser.email, id: savedUser._id, role: savedUser.role }, SECRET_KEY)
    res.status(201).json({ data: savedUser, authtoken: token })

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

},
  exports.all = async (req, res) => {

    let findrecords;

    try {
      findrecords = await newuserModel.findById(req.user.id);
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }
    return res.json(findrecords);
  },

  exports.all_employee = async (req, res) => {

    let allemployee = await newuserModel.find();
    let birthday = [];
    for (let x of allemployee) {
      const todayMonth = new Date().getMonth() + 1;

      var DateObj = new Date(x.dob);
      console.log(DateObj.getMonth() + 1, todayMonth, "sddddddddddddd");
      const final = DateObj.getMonth() + 1
      if (final === todayMonth) {
        console.log("yes")
        birthday.push({ name: x.name, dob: x.dob, image: x.image })
      }
      else {
        console.log("no")
      }

      console.log(birthday, "birthday")

    }
    res.status(201).json(birthday);

  }





