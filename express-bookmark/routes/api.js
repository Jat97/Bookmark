const express = require('express');
const router = express.Router();
const {upload} = require('../database/imageupload');

const userController = require('../controllers/userController');
const groupController = require('../controllers/groupController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const chatController = require('../controllers/chatController');

// User routes //

router.post('/signup', userController.create_account);

router.post('/login', userController.log_in);

router.post('/login/guest', userController.log_as_guest);

router.get('/users', userController.get_all_users);

router.post('/user/:userid/block', userController.block_user);

router.delete('/user/:userid/unblock', userController.unblock_user);

router.delete('/user/:userid/unfriend', userController.remove_from_friendslist);

router.get('/notifications', userController.get_notifications);

router.patch('/notifications', userController.check_notifications);

router.post('/user/:userid/request', userController.send_friend_request);

router.post('/user/:userid/accept', userController.accept_friend_request);

router.delete('/user/:userid/reject', userController.reject_friend_request);

router.get('/user', userController.get_logged_information);

router.patch('/user/picture', upload.single('profilepic'), userController.edit_profile_picture);

router.put('/user', userController.edit_profile_information);

router.patch('/user/hidden', userController.update_hidden_status);

router.patch('/logout', userController.log_out);

router.delete('/user', userController.delete_account);

// Group routes

router.get('/groups', groupController.get_all_groups);

router.post('/group', groupController.create_group);

router.put('/group/:groupid', upload.single('groupimage'), groupController.update_group_information);

router.patch('/group/:groupid/private', groupController.handle_group_privacy);

router.post('/group/:groupid/request', groupController.send_group_request);

router.delete('/group/:groupid/leave', groupController.leave_group);

router.post('/group/:groupid/:userid/accept', groupController.accept_group_request);

router.delete('/group/:groupid/:userid/reject', groupController.reject_group_request);

router.post('/group/:groupid/:userid/ban', groupController.ban_user);

router.delete('/group/:groupid/:userid/unban', groupController.unban_user);

router.delete('/group/:groupid', groupController.delete_group);

// Post routes

router.get('/posts', postController.get_post_feed);

router.post('/post', upload.array('postimage', 10), postController.create_post);

router.put('/post/:postid', upload.array('postimage', 10), postController.edit_post);

router.post('/post/:postid/like', postController.like_post);

router.delete('/post/:postid/unlike', postController.unlike_post);

router.post('/post/:postid/share', postController.share_post);

router.delete('/post/:postid', postController.delete_post);

// Comment routes

router.get('/post/:postid/comments', commentController.view_post_comments);

router.post('/post/:postid/comment', upload.single('commentimage'), commentController.create_comment);

router.put('/comment/:commentid', commentController.edit_comment);

router.delete('/comment/:commentid', commentController.delete_comment);

router.post('/comment/:commentid/like', commentController.like_comment);

router.delete('/comment/:commentid/unlike', commentController.unlike_comment);

// Chat routes

router.get('/chats', chatController.get_all_chats);

router.post('/chat/:userid', chatController.create_chat);

router.patch('/chat/:userid', chatController.read_chat);

router.post('/chat/:userid/message', upload.single('chatimage'), chatController.send_message);

router.delete('/chat/:chatid', chatController.delete_chat);

module.exports = router;