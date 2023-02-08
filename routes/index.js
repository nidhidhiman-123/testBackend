const express = require('express');
const router = express.Router();
const app = router();
const applyleaveController = require('../controllers/applyleave.controller');
const loginController = require('../controllers/login.controller');
const newuserController = require('../controllers/newuser.controller');
const postController = require('../controllers/post.controller');
const profileController = require('../controllers/profile.controller');
const signUpController = require('../controllers/signup.controller');
const auth = require('../middleware/auth');


app.post('/signup', signUpController.signup);
app.post('/login', loginController.login);
app.get('/profile', auth, profileController.profile);
app.put('/editusername', auth, profileController.editusername);
app.put('/editemail', auth, profileController.editemail);
app.put('/editphone', auth, profileController.editphone);
app.put('/editpassword', auth, profileController.editpassword);
app.put('/editdob', auth, profileController.editdob);
app.post('/imageupload', auth, profileController.imageupload);
app.post('/add_post', postController.add_post);
app.get('/all_post', auth, postController.allpost);
app.delete('/delete_post/:id', postController.deletepost);
app.post('/add_user', newuserController.adduser);
app.post('/add_leave', postController.add_leaves);
app.post('/apply_leave', auth, applyleaveController.apply);
app.get('/all_leave', postController.allleave);
app.get('/get_apply_leaves', applyleaveController.getapply_leaves);
app.post('/update_leave/:id', applyleaveController.update_leave);
app.put('/cancel_leave/:id', applyleaveController.cancel_leave);
app.get('/single_user_apply_leave', auth, applyleaveController.single_user_apply_leave);
app.post('/like/:id', auth, postController.like);
app.get('/allcomment', postController.allcomment);

module.exports = { app };

