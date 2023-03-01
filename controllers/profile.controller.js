const registerModel = require("../models/register.model");
const multer = require("multer");
const newuserModel = require("../models/newuser.model");
const bcrypt = require("bcrypt");
const { Validator } = require("node-input-validator");





const storage = multer.diskStorage({

  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },

});

const handleMultipartData = multer({ storage, limit: { filesize: 1000000 * 5 } }).single('image');

// const profileController = {

exports.profile = async (req, res) => {
  let records;
  try {
    records = await newuserModel.findById(req.user.id);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
  return res.json(records);
}

exports.editusername = async (req, res) => {

  const { name } = req.body;

  let editname;
  try {
    editname = await newuserModel.updateOne({ _id: req.user.id }, { $set: { name: name } })
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }

  return res.json(editname);
}

exports.editemail = async (req, res) => {

  const { email } = req.body

  let editemail;
  try {
    editemail = await newuserModel.updateOne({ _id: req.user.id }, { $set: { email: email } })
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }

  return res.json(editemail);
}

exports.editphone = async (req, res) => {

  const { phonenumber } = req.body

  let editphone;
  try {
    editphone = await newuserModel.updateOne({ _id: req.user.id }, { $set: { phonenumber: phonenumber } })
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }

  return res.json(editphone);
}

exports.editpassword = async (req, res) => {

  const { password } = req.body
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  let editpassword;
  try {
    editpassword = await newuserModel.updateOne({ _id: req.user.id }, { $set: { password: passwordHash, first_login: '' } })
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }

  return res.json(editpassword);
}

exports.editdob = async (req, res) => {

  const { dob } = req.body

  let editdob;
  try {
    editdob = await newuserModel.updateOne({ _id: req.user.id }, { $set: { dob: dob } })
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }

  return res.json(editdob);
}
exports.imageupload = async (req, res) => {

  handleMultipartData(req, res, async (err) => {

    const filePath = req.file.path;
    let imageupload;
    try {
      imageupload = await newuserModel.findOneAndUpdate({ _id: req.user.id }, {

        image: filePath

      });
    }

    catch (err) {
      console.log(err)
    }
    res.status(201).json(imageupload);

  });

}
exports.edit_profile = async (req, res) => {

  const { name, email, password, phonenumber, dob } = req.body;
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  let updateFilter = {

  }
  if (name) {
    updateFilter.name = name
  }
  if (email) {
    updateFilter.email = email
  }
  if (password) {
    updateFilter.password = passwordHash,
      updateFilter.first_login = ''

  } if (phonenumber) {
    updateFilter.phonenumber = phonenumber
  } if (dob) {
    updateFilter.dob = dob
  }


  let edit_records;
  try {
    edit_records = await newuserModel.findOneAndUpdate({ _id: req.user.id }, updateFilter);
  }
  catch (err) {
    return next(err);
  }

  res.status(201).json(edit_records);
}

exports.change_password = async (req, res) => {

  try {
    const val = new Validator(req.body, {
      old_password: 'required',
      new_password: 'required',
      confirm_password: 'required|same:new_password'
    });

    const matched = await val.check();

    if (!matched) {
      return res.status(401).send({ message: "New Password and Confirm Password Should be Same" })
    }


    const find_current_password = await newuserModel.findById(req.user.id)
    if (find_current_password.first_login == '') {
      let current_password = find_current_password.password

      if (bcrypt.compareSync(req.body.old_password, current_password)) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(req.body.new_password, salt);
        await newuserModel.updateOne({
          _id: req.user.id
        }, {
          password: passwordHash,

        })

        return res.status(201).send({ message: "Password Change Successfully" });
      }
      else {
        return res.status(401).send({ message: "Password does not matched with Old Password" });

      }
    }
    else {
      const find_current_password = await newuserModel.findById(req.user.id)
      let current_password = find_current_password.first_login
      console.log(current_password, "current_password")

      if (req.body.old_password == current_password) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(req.body.new_password, salt);
        await newuserModel.updateOne({
          _id: req.user.id
        }, {
          password: passwordHash,
          first_login: ''
        })

        return res.status(201).send({ message: "Password Change Successfully" });
      }
      else {
        return res.status(401).send({ message: "Password does not matched with Old Password" });

      }
    }

  }
  catch (error) {
    console.log(error)
  }


}




// }
// export default profileController;
// module.exports = {
//   imageupload, editdob, editpassword, editphone, editemail, editusername, profile
// }