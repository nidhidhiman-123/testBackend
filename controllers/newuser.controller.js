const newuserModel = require("../models/newuser.model");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "MYSECRETKEY"

const moment = require("moment")

// const newuserController = {

exports.adduser = async (req, res) => {
  try {
    const { name, email, first_login, dob, phonenumber, designation, emp_id, date_of_joining } = req.body;
    const existingUser = await newuserModel.findOne({ email: email });
    if (existingUser)
      return res
        .status(400).json({ msg: "An account with this email already exists." });

    const adduser = new newuserModel({
      name,
      email,
      first_login,
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

  exports.all_add_employee = async (req, res) => {

    let added_employee;
    added_employee = await newuserModel.find();
    let arrays = []
    for (let x of added_employee) {

      let finaldate = moment(x.createdAt).format('DD/MM/YYYY')

      let currentdate = moment(new Date()).format('DD/MM/YYYY')
      if (finaldate == currentdate) {
        arrays.push({ name: x.name, emp_id: x.emp_id, email: x.email, password: x.password, _id: x.id, invite_status: x.invite_status })
      }
      else {
        console.log("no")
      }

    }
    return res.json(arrays);
  },

  exports.all_employee = async (req, res) => {

    let allemployee = await newuserModel.find();
    let birthday = [];
    for (let x of allemployee) {
      const todayMonth = new Date().getMonth() + 1;

      var DateObj = new Date(x.dob);
      const final = DateObj.getMonth() + 1
      if (final === todayMonth) {
        console.log("yes")
        birthday.push({ name: x.name, dob: x.dob, image: x.image })
      }
      else {
        console.log("no")
      }


    }
    res.status(201).json(birthday);

  }





