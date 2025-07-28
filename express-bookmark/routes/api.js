const express = require('express');
const router = express.router();
const {upload} = require('../database/imageupload');

const userController = require('../controllers/userControler');
const groupController = require('../controllers/groupController');
const postController = require('../controller/postController');
const commentController = require('../controller/commentController');
const chatController = require('../controller/chatController');

// User routes //

router.get('/signup', userController.create_account);

router.get('/login', userController.log_in);

router.get('/users', userController.get_all_users);

router.post('/block/:userid', userController.block_user);

router.delete('/unblock/:userid', userController.unblock_user);

router.post('/friend/:userid', userController.add_to_friendslist);

router.delete('/unfriend/:userid', userController.remove_from_friendslist);

router.get('/notifications', userController.get_notifications);

router.get('/requests', userController.get_friend_requests);

router.post('/request/accept/:userid', userController.accept_friend_request);

router.delete('/request/reject/:userid', userController.reject_friend_request);

router.get('/user', userController.get_logged_information);

router.patch('/user/picture', upload.single('profilepic'), userController.edit_profile_picture);

router.patch('/user/hidden/update', userController.update_hidden_status);

router.patch('/logout', userController.log_out);

// Group routes

router.get('/groups', groupController.get_all_groups);

router.get('/group/:groupname', groupController.get_group_information);

router.get('/group/create', groupController.create_group);

router.put('/group/update/:groupname', groupController.update_group_information);

router.patch('/group/private/toggle', groupController.handle_group_privacy);

router.post('/group/request/:groupid', groupController.send_group_request);

router.post('/group/request/accept/:groupid', groupController.accept_group_request);

router.delete('/group/request/reject/:groupid', groupController.reject_group_request);

router.delete('/group/:groupid/membership/:userid', groupController.terminate_membership);

router.delete('/group/:groupid', groupController.delete_group);

// Post routes

router.get('/home', postController.get_home_feed);

router.get('/post/:postid', postController.get_post_information);

router.post('/post', upload.array('postimage', 10), postController.create_post);

router.put('/post/edit/:postid', upload.array('postimage', 10), postController.edit_post);

router.post('/post/like/:postid', postController.like_post);

router.delete('/post/unlike/:postid', postController.unlike_post);

router.delete('/post/:postid', postController.delete_post);

// Comment routes

router.get('/post/:postid/comments', commentController.view_post_comments);

router.get('/comment/:commentid', commentController.view_comment_thread);

router.post('/post/:postid/comment', upload.single(''), commentController.create_comment);

router.put('/comment/edit/:commentid', commentController.edit_comment);

router.delete('/comment/:commentid', commentController.delete_comment);

router.post('/comment/like/:commentid', commentController.like_comment);

router.delete('/comment/unlike/:commentid', commentController.unlike_comment);

router.post('/comment/reply/:commentid', commentController.reply_to_comment);

// Chat routes