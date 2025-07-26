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

// Comment routes

// Chat routes