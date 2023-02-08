const express = require('express');
const router = express.Router();

const applyleaveController = require('../controllers/applyleave.controller');
const loginController = require('../controllers/login.controller');
const newuserController = require('../controllers/newuser.controller');
const postController = require('../controllers/post.controller');
const profileController = require('../controllers/profile.controller');
const signUpController = require('../controllers/signup.controller');
const auth = require('../middleware/auth');


router.post('/signup', signUpController.signup);
router.post('/login', loginController.login);
router.get('/profile', auth, profileController.profile);
router.put('/editusername', auth, profileController.editusername);
router.put('/editemail', auth, profileController.editemail);
router.put('/editphone', auth, profileController.editphone);
router.put('/editpassword', auth, profileController.editpassword);
router.put('/editdob', auth, profileController.editdob);
router.post('/imageupload', auth, profileController.imageupload);
router.post('/add_post', postController.add_post);
router.get('/all_post', auth, postController.allpost);
router.delete('/delete_post/:id', postController.deletepost);
router.post('/add_user', newuserController.adduser);
router.post('/add_leave', postController.add_leaves);
router.post('/apply_leave', auth, applyleaveController.apply);
router.get('/all_leave', postController.allleave);
router.get('/get_apply_leaves', applyleaveController.getapply_leaves);
router.post('/update_leave/:id', applyleaveController.update_leave);
router.put('/cancel_leave/:id', applyleaveController.cancel_leave);
router.get('/single_user_apply_leave', auth, applyleaveController.single_user_apply_leave);
router.post('/like/:id', auth, postController.like);
router.get('/allcomment', postController.allcomment);
router.get('/all', auth, newuserController.all)
router.get('/all_employee', newuserController.all_employee)

module.exports = router;

