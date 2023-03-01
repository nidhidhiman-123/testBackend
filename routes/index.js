const express = require('express');
const router = express.Router();

const applyleaveController = require('../controllers/applyleave.controller');
const loginController = require('../controllers/login.controller');
const newuserController = require('../controllers/newuser.controller');
const postController = require('../controllers/post.controller');
const profileController = require('../controllers/profile.controller');
const signUpController = require('../controllers/signup.controller');
const inviteController = require('../controllers/invite.controller')
const projectController = require('../controllers/project.controller')
const eventController = require('../controllers/event.controller')
const commentController = require('../controllers/comment.controller')
const auth = require('../middleware/auth');


// router.post('/signup', signUpController.signup);
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
// router.post('/updateimageupload/:id', postController.updateimageupload);
router.put('/edit_post/:id', postController.editpost);

router.post('/add_user', newuserController.adduser);
router.post('/add_leave', postController.add_leaves);
router.post('/apply_leave', auth, applyleaveController.apply);
router.get('/all_leave', postController.allleave);
router.get('/get_apply_leaves', auth, applyleaveController.getapply_leaves);
router.post('/update_leave/:id', applyleaveController.update_leave);
router.put('/cancel_leave/:id', applyleaveController.cancel_leave);
router.get('/single_user_apply_leave', auth, applyleaveController.single_user_apply_leave);
router.post('/like/:id', auth, postController.like);

router.get('/all', auth, newuserController.all)
router.get('/all_employee', newuserController.all_employee)
router.post('/add_event', eventController.add_event);
router.delete('/delete_event/:id', eventController.delete_event);
router.put('/edit_event/:id', eventController.edit_event);
router.get('/event', eventController.events);
router.post('/invite', inviteController.invite);
router.get('/all_add_employee', newuserController.all_add_employee);
router.post('/add_project', projectController.add_project);
router.get('/project/:code', projectController.project);
router.post('/add_team', projectController.add_team);
router.get('/admin_get_apply_leave', applyleaveController.admin_get_apply_leave);
router.post('/comment/:id', auth, commentController.comment);
router.post('/delete_comment', commentController.delete_comment);
router.put('/edit_comment', commentController.edit_comment);

module.exports = router;

