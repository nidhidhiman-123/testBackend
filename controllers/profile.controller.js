const registerModel = require("../models/register.model");
const multer = require("multer");
const newuserModel = require("../models/newuser.model");



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

  const { username } = req.body;

  let editname;
  try {
    editname = await registerModel.updateOne({ _id: req.user.id }, { $set: { username: username } })
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
    editemail = await registerModel.updateOne({ _id: req.user.id }, { $set: { email: email } })
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
    editphone = await registerModel.updateOne({ _id: req.user.id }, { $set: { phonenumber: phonenumber } })
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }

  return res.json(editphone);
}

exports.editpassword = async (req, res) => {

  const { password } = req.body

  let editpassword;
  try {
    editpassword = await registerModel.updateOne({ _id: req.user.id }, { $set: { password: password } })
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
    editdob = await registerModel.updateOne({ _id: req.user.id }, { $set: { dob: dob } })
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }

  return res.json(editdob);
}
exports.imageupload = async (req, res) => {

  handleMultipartData(req, res, async (err) => {
    const filePath = req.file.path;
    console.log(filePath)
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

// }
// export default profileController;
// module.exports = {
//   imageupload, editdob, editpassword, editphone, editemail, editusername, profile
// }