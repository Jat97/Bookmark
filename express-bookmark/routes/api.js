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

router.get('/blocked', userController.get_block_list);

router.post('/block/:userid', userController.block_user);

router.delete('/unblock/:userid', userController.unblock_user);

router.get('/friends', userController.get_friends_list);

router.delete('/unfriend/:userid', userController.remove_from_friendslist);

router.get('/notifications', userController.get_alerts_and_requests);

router.post('/request/send/:userid', userController.send_friend_request);

router.post('/request/accept/:userid', userController.accept_friend_request);

router.delete('/request/reject/:userid', userController.reject_friend_request);

router.get('/user', userController.get_logged_information);

router.patch('/user/picture', upload.single('profilepic'), userController.edit_profile_picture);

router.patch('/user/hidden', userController.update_hidden_status);

router.patch('/logout', userController.log_out);

router.delete('/user', userController.delete_account);

// Group routes

router.get('/groups', groupController.get_all_groups);

router.post('/group/create', groupController.create_group);

router.put('/group/update/:groupid', groupController.update_group_information);

router.patch('/group/private/:groupid', groupController.handle_group_privacy);

router.post('/group/request/:groupid', groupController.send_group_request);

router.post('/group/:groupid/request/accept/:userid', groupController.accept_group_request);

router.delete('/group/:groupid/request/reject/:userid', groupController.reject_group_request);

router.delete('/group/:groupid/membership/:userid', groupController.terminate_membership);

router.delete('/group/:groupid', groupController.delete_group);

// Post routes

router.get('/posts', postController.get_post_feed);

router.get('/post/:postid', postController.get_post_information);

router.post('/post', upload.array('postimage', 10), postController.create_post);

router.put('/post/edit/:postid', upload.array('postimage', 10), postController.edit_post);

router.post('/post/like/:postid', postController.like_post);

router.delete('/post/unlike/:postid', postController.unlike_post);

router.delete('/post/:postid', postController.delete_post);

// Comment routes

router.get('/post/:postid/comments', commentController.view_post_comments);

router.post('/post/comment/:postid', upload.single('commentimage'), commentController.create_parent_comment);

router.post('/comment/reply/:commentid', upload.single('commentimage'), commentController.reply_to_comment);

router.put('/comment/edit/:commentid', commentController.edit_comment);

router.delete('/comment/:commentid', commentController.delete_comment);

router.post('/comment/like/:commentid', commentController.like_comment);

router.delete('/comment/unlike/:commentid', commentController.unlike_comment);

// Chat routes

router.get('/chats', chatController.get_all_chats);

// router.get('/chat/:userid', chatController.get_chat_messages);

router.get('/message/:userid', upload.single('chatimage'), chatController.send_message);

router.delete('/chat/:chatid', chatController.delete_chat);