import newuserModel from "../models/newuser.model";
const jwt = require("jsonwebtoken");
const SECRET_KEY = "MYSECRETKEY"

const newuserController = {

  async adduser(req, res) {
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
  }
}



export default newuserController;