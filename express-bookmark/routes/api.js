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

router.get('/users', userController.get_all_users);

router.get('/blocked', userController.get_blocked_list);

router.post('/:userid/block', userController.block_user);

router.delete('/:userid/unblock', userController.unblock_user);

router.get('/friends', userController.get_friends_list);

router.delete('/:userid/unfriend', userController.remove_from_friendslist);

router.get('/notifications', userController.get_notifications);

router.post('/:userid/request', userController.send_friend_request);

router.post('/:userid/accept', userController.accept_friend_request);

router.delete('/:userid/reject', userController.reject_friend_request);

router.get('/user', userController.get_logged_information);

router.patch('/user/picture', upload.single('profilepic'), userController.edit_profile_picture);

router.put('/user', userController.edit_profile_information);

router.patch('/user/hidden', userController.update_hidden_status);

router.patch('/logout', userController.log_out);

router.delete('/user', userController.delete_account);

// Group routes

router.get('/groups', groupController.get_all_groups);

router.post('/group', groupController.create_group);

router.put('/:groupid', groupController.update_group_information);

router.patch('/:groupid/private', groupController.handle_group_privacy);

router.post('/:groupid/request', groupController.send_group_request);

router.delete('/:groupid/leave', groupController.leave_group);

router.post('/:groupid/:userid/accept', groupController.accept_group_request);

router.delete('/:groupid/:userid/reject', groupController.reject_group_request);

router.post('/:groupid/:userid/ban', groupController.ban_user);

router.delete('/:groupid/:userid/unban', groupController.unban_user);

router.delete('/:groupid', groupController.delete_group);

// Post routes

router.get('/posts', postController.get_post_feed);

router.post('/post', upload.array('postimage', 10), postController.create_post);

router.put('/:postid', upload.array('postimage', 10), postController.edit_post);

router.post('/:postid/like', postController.like_post);

router.delete('/:postid/unlike', postController.unlike_post);

router.post('/:postid/share', postController.share_post);

router.delete('/:postid', postController.delete_post);

// Comment routes

router.get('/:postid/comments', commentController.view_post_comments);

router.post('/:postid/comment', upload.single('commentimage'), commentController.create_comment);

router.put('/:commentid', commentController.edit_comment);

router.delete('/:commentid', commentController.delete_comment);

router.post('/:commentid/like', commentController.like_comment);

router.delete('/:commentid/unlike', commentController.unlike_comment);

// Chat routes

router.get('/chats', chatController.get_all_chats);

router.get('/message/:userid', upload.single('chatimage'), chatController.send_message);

router.delete('/:chatid', chatController.delete_chat);

module.exports = router;