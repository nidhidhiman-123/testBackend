import registerModel from "../models/register.model";
import multer from "multer";
import newuserModel from "../models/newuser.model";



const storage = multer.diskStorage({

  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },

});

const handleMultipartData = multer({ storage, limit: { filesize: 1000000 * 5 } }).single('image');

const profileController = {

  async profile(req, res) {
    let records;
    try {
      records = await newuserModel.findById(req.user.id);
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }
    return res.json(records);
  },

  async editusername(req, res) {

    const { username } = req.body;

    let editname;
    try {
      editname = await registerModel.updateOne({ _id: req.user.id }, { $set: { username: username } })
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }

    return res.json(editname);
  },

  async editemail(req, res) {

    const { email } = req.body

    let editemail;
    try {
      editemail = await registerModel.updateOne({ _id: req.user.id }, { $set: { email: email } })
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }

    return res.json(editemail);
  },

  async editphone(req, res) {

    const { phonenumber } = req.body

    let editphone;
    try {
      editphone = await registerModel.updateOne({ _id: req.user.id }, { $set: { phonenumber: phonenumber } })
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }

    return res.json(editphone);
  },

  async editpassword(req, res) {

    const { password } = req.body

    let editpassword;
    try {
      editpassword = await registerModel.updateOne({ _id: req.user.id }, { $set: { password: password } })
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }

    return res.json(editpassword);
  },

  async editdob(req, res) {

    const { dob } = req.body

    let editdob;
    try {
      editdob = await registerModel.updateOne({ _id: req.user.id }, { $set: { dob: dob } })
    }
    catch (err) {
      res.status(500).json({ error: err.message });
    }

    return res.json(editdob);
  },
  async imageupload(req, res) {

    handleMultipartData(req, res, async (err) => {
      const filePath = req.file.path;
      console.log(filePath)
      let imageupload;
      try {
        imageupload = await registerModel.findOneAndUpdate({ _id: req.user.id }, {

          image: filePath

        });
      }

      catch (err) {
        console.log(err)
      }
      res.status(201).json(imageupload);

    });

  },

}
export default profileController;