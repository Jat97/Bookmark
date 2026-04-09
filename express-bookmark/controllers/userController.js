const db = require('../database/db');
const {validateToken} = require('../database/token');
const {uploadImage} = require('../database/imageupload');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let day = date.getDate();
let minDate = new Date(year - 18, month, day).toISOString();

exports.create_account = [
    body('first_name', 'Please enter your first name.').isLength({min: 1}),
    body('last_name', 'Please enter your last name.').isLength({min: 1}),
    body('email', 'Please enter your email address.').isEmail().withMessage('Enter a valid email address.')
    .custom(async email => {
        const user = await db.query(
            `SELECT * 
            FROM users 
            WHERE email = $1`, 
            [email]
        );

        if(user.rows.length !== 0) {
            return Promise.reject('This email address is currently in use.');
        }
    }),
    body('dob', 'Please enter your date of birth.').notEmpty().custom(async (birth) => {
        if(birth > minDate) {
            return await Promise.reject('You must be at least 18 years of age.');
        }
    }),
    body('role', 'Please choose the role that best fits').notEmpty(),
    body('password', 'Please enter a password').isLength({min: 8}).notEmpty().custom(async password => {
        if(password.length < 8) {
            return await Promise.reject('Your password is too short.');
        }
    }),
    body('confirm', 'Please confirm your password').notEmpty().isLength({min: 8}).custom(async (confirm, {req}) => {
        if(confirm !== req.body.password) {
            return await Promise.reject('Your passwords do not match.');
        }
    }),

    (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors});
        }
        else {
            bcrypt.hash(req.body.password, 10, async (err, hashWord) => {
                if(err) {
                    res.status(500).json({server_error: err});
                }
                else {
                    const user = await db.query(`
                        INSERT INTO users (first_name, last_name, email, date_of_birth, password, 
                        profile_picture, alma_mater, degree, role, online, hidden) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, 
                        [
                            req.body.first_name, 
                            req.body.last_name, 
                            req.body.email, 
                            req.body.dob, 
                            hashWord, 
                            null,
                            null,
                            null, 
                            req.body.role,
                            true, 
                            false
                        ]
                    );

                    jwt.sign({user, expiresIn: new Date(Date.now() + 10000000)}, process.env.TOKEN_KEY, 
                        (err, key) => {
                        if(err) {
                            return res.status(500).json({server_error: err});
                        }
                        else {
                            res.cookie('usertoken', key, {
                                expires: new Date(Date.now() + 10000000),
                                secure: false,
                                httpOnly: true,
                                path: '/api'
                            }).sendStatus(201);
                        }
                    });
                }
            });
        }
    }
];

exports.log_in = async (req, res) => {
    const user = await db.query(
        `SELECT * 
        FROM users 
        WHERE email = $1`, 
        [req.body.user]
    );

    if(user.rows.length === 0) {
        return res.status(400).json({user_err: 'No users found with this email address.'});
    }
    else {
        if(req.body.password.length === 0) {
            return res.status(400).json({pass_err: 'Please enter a password.'});
        }
        else {
            bcrypt.compare(req.body.password, user.rows[0].password, (err, result) => {
                if(err) {
                    return res.status(500).json({server_error: err});
                }
                else if(result) {
                    const logged_user = user.rows[0];
                    
                    jwt.sign({logged_user, expiresIn: new Date(Date.now() + 10000000)}, process.env.TOKEN_KEY, 
                    (err, key) => {
                        if(err) {
                            return res.status(500).json({server_error: err});
                        }
                        else {
                            res.cookie('usertoken', key, {
                                expires: new Date(Date.now() + 10000000),
                                secure: false,
                                httpOnly: true,
                                path: '/api'
                            }).sendStatus(200)
                        }
                    });
                }
                else {
                    return res.status(400).json({pass_err: 'Your password is incorrect.'})
                }
            });
        }
    }
};

exports.log_as_guest = async (req, res) => {
    try {
        jwt.sign({guest: true, expiresIn: new Date(Date.now() + 10000000)}, process.env.TOKEN_KEY, (err, key) => {
            if(err) {
                res.status(500).json({server_error: err});
            }
            else {
                res.cookie('guesttoken', key, {
                    expires: new Date(Date.now() + 10000000),
                    secure: false,
                    httpOnly: true,
                    path: '/api'
                }).sendStatus(200); 
            }
        })
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.get_all_users = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const users = await db.query(
                `SELECT id,
                first_name,
                last_name,
                TO_CHAR(date_of_birth, 'MM/DD/YYYY') AS date_of_birth,
                profile_picture,
                alma_mater,
                degree,
                role,
                online,
                hidden
                FROM users 
                WHERE id <> $1`,
                [user_key.logged_user.id]
            );

            const blocked = await db.query(
                `SELECT * 
                FROM blocked 
                WHERE blocked_by = $1 
                OR blocked_user = $1`, 
                [user_key.logged_user.id]
            );

            for(var user of users.rows) {
                blocked.rows.forEach(block => {
                    users.rows.filter(user => user.id === block.blocked_user.id);
                });

                const friends = await db.query(
                    `SELECT users.id AS id,
                    users.first_name AS first_name,
                    users.last_name AS last_name,
                    users.profile_picture AS profile_picture,
                    users.hidden AS hidden,
                    users.online AS online
                    FROM friends
                    INNER JOIN users ON users.id = friends.friend_1
                    WHERE users.id = $1`,
                    [user.id]
                );

                user = {
                    ...user, 
                    friends: friends.rows
                }
            }

            res.status(200).json({users: users.rows});
        }
        else if(user_key.guest) {
            const users = await db.query(
                `SELECT id,
                first_name,
                last_name,
                TO_CHAR(date_of_birth, 'MM/DD/YYYY') AS date_of_birth,
                profile_picture,
                alma_mater,
                degree,
                role,
                online,
                hidden
                FROM users`
            );

            res.status(200).json({users: users.rows});
        }
        else {
            return res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.block_user = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const user = await db.query(
                `SELECT * FROM users WHERE id = $1`, 
                [req.params.userid]
            );

            const block = await db.query(
                `INSERT INTO blocked (blocked_user, blocked_by) VALUES ($1, $2) RETURNING id, blocked_user, blocked_by`, 
                [user.rows[0].id, user_key.logged_user.id]
            );

            await db.query(
                `DELETE FROM friends WHERE friend_1 = $1 AND friend_2 = $2`,
                [user_key.logged_user.id, user.rows[0].id]
            );

            await db.query(
                `DELETE FROM friends WHERE friend_1 = $1 AND friend_2 = $2`,
                [user.rows[0].id, user_key.logged_user.id]
            )

            res.status(201).json({blocked: block.rows[0]});
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.unblock_user = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const updated_block = await db.query(
                `DELETE FROM blocked WHERE blocked_user = $1 RETURNING *`, 
                [req.params.userid]
            );

            res.status(200).json({blocked: updated_block.rows});
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.remove_from_friendslist = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            await db.query(
                `DELETE FROM friends WHERE friend_1 = $1 AND friend_2 = $2`, 
                [user_key.logged_user.id, req.params.userid]
            );

            res.sendStatus(200);
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.get_notifications = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const alerts = await db.query(
                `SELECT alerts.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture,
                alerts.text AS text,
                alerts.sent AS sent,
                alerts.checked AS checked, 
                posts.id AS post_id,
                posts.text AS post_text,
                comments.id AS comment_id,
                comments.text AS comment_text
                FROM alerts
                INNER JOIN users ON users.id = alerts.alerting_user
                LEFT JOIN posts ON posts.id = alerts.post
                LEFT JOIN comments ON comments.id = alerts.comment
                WHERE alerted_user = $1`,
                [user_key.logged_user.id]
            );

            const friend_requests = await db.query(
                `SELECT users.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture
                FROM requests
                INNER JOIN users ON users.id = requests.requesting_user
                WHERE requested_user = $1`,
                [user_key.logged_user?.id]
            );

            const pending_requests = await db.query(
                `SELECT users.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture
                FROM requests
                INNER JOIN users ON users.id = requests.requested_user
                WHERE requesting_user = $1`,
                [user_key.logged_user?.id]
            );

            const notifications = [];
            const requests = [];
            const pending = [];

            if(alerts.rows.length > 0) {
                alerts.rows.forEach(alert => {
                    notifications.push({
                        id: alert.id,
                        alerting_user: {
                            first_name: alert.first_name,
                            last_name: alert.last_name,
                            profile_picture: alert.profile_picture,
                        },
                        post: {
                            id: alert.post_id ? alert.post_id : alert.comment_id,
                            text: alert.post_text ? alert.post_text : alert.comment_text
                        },
                        text: alert.text,
                        sent: alert.sent,
                        checked: alert.checked
                    });
                });
            };

            if(friend_requests.rows.length > 0) {
                friend_requests.rows.forEach(request => {
                    requests.push({
                        id: request.id,
                        first_name: request.first_name,
                        last_name: request.last_name,
                        profile_picture: request.profile_picture
                    });
                });
            };

            if(pending_requests.rows.length > 0) {
                pending_requests.rows.forEach(request => {
                    pending.push({
                        id: request.id,
                        first_name: request.first_name,
                        last_name: request.last_name,
                        profile_picture: request.profile_picture
                    });
                });
            };

            res.status(200).json({notifications: notifications, requests: requests, pending: pending});
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.check_notifications = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const alerts = await db.query(
                `SELECT * 
                FROM alerts 
                WHERE alerted_user = $1 
                AND checked = $2`,
                [user_key.logged_user.id, false]
            );

            if(alerts.rows.length > 0) {
                for(const alert of alerts.rows) {
                    if(!alert.checked) {
                        await db.query(
                            `UPDATE alerts
                            SET checked = $1
                            WHERE alerted_user = $2`,
                            [true, user_key.logged_user.id]
                        );
                    }
                }
            }

            res.sendStatus(200);
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.json({server_error: err});
    }
};

exports.send_friend_request = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const friend_request = await db.query(
                `INSERT INTO requests (requested_user, requested_group, requesting_user) 
                VALUES ($1, $2, $3) 
                RETURNING id, requested_user, requesting_user`,
                [req.params.userid, null, user_key.logged_user.id]
            );

            res.status(201).json({friend_request: friend_request.rows[0]});
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.accept_friend_request = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const logged_friend = await db.query(
                `INSERT INTO friends (friend_1, friend_2) VALUES ($1, $2) RETURNING *`, 
                [user_key.logged_user.id, req.params.userid]
            );

            await db.query(
                `INSERT INTO friends (friend_1, friend_2) VALUES ($1, $2)`,
                [req.params.userid, user_key.logged_user.id]
            );

            await db.query(
                `DELETE FROM requests WHERE requested_user = $1 AND requesting_user = $2`, 
                [user_key.logged_user.id, req.params.userid]
            );

            res.status(201).json({friend: logged_friend.rows[0]});
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.reject_friend_request = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            await db.query(
                `DELETE FROM requests WHERE requested_user = $1 AND requesting_user = $2`, 
                [user_key.logged_user.id, req.params.userid]
            );

            res.sendStatus(200);
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.get_logged_information = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const user = await db.query(
                `SELECT id,
                first_name,
                last_name,
                TO_CHAR(date_of_birth, 'MM/DD/YYYY') AS date_of_birth,
                profile_picture,
                alma_mater,
                degree,
                role,
                online,
                hidden
                FROM users
                WHERE id = $1`,
                [user_key.logged_user.id],
            );

            const blocked = await db.query(
                `SELECT users.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture
                FROM blocked
                INNER JOIN users ON users.id = blocked.blocked_user
                WHERE blocked.blocked_by = $1`,
                [user_key.logged_user.id]
            );

            const friends = await db.query(
                `SELECT users.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture
                FROM friends 
                INNER JOIN users ON users.id = friends.friend_2
                WHERE friends.friend_1 = $1`,
                [user_key.logged_user.id]
            );

            res.status(200).json({profile: user.rows[0], friends: friends.rows, blocked: blocked.rows});
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.edit_profile_picture = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            if(req.file) {
                let result = await uploadImage(req);
                
                const updated_user = await db.query(
                    `UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING id, profile_picture`,
                    [result.secure_url, user_key.logged_user.id]
                );

                res.status(200).json({updated_image: updated_user.rows[0]});
            }
            else {
                res.sendStatus(200);
            }
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.edit_profile_information = [
    body('first_name', 'Please enter your first name.').isLength({min: 1}),
    body('last_name', 'Please enter your last name.'),

    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(400).json({errors: errors});
        }
        else {
            try {
                const user_key = await validateToken(req, res);

                if(user_key.logged_user) {    
                    const updated_user_data = await db.query(
                        `UPDATE users SET 
                        first_name = $1,
                        last_name = $2,  
                        alma_mater = $3, 
                        degree = $4,
                        role = $5
                        WHERE id = $6 
                        RETURNING id, first_name, last_name, alma_mater, degree, role`,
                        [
                            req.body.first_name, 
                            req.body.last_name,
                            req.body.alma_mater, 
                            req.body.degree,
                            req.body.role, 
                            user_key.logged_user.id
                        ]
                    );

                    res.status(200).json({profile: updated_user_data.rows[0]});
                }
                else if(user_key.guest) {
                    res.sendStatus(403);
                }
                else {
                    res.status(400).send();
                }
            }
            catch (err) {
                res.status(500).json({server_error: err});
            }
        }
       
    }
];

exports.update_hidden_status = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const updated_user = await db.query(
                `UPDATE users SET hidden = $1 WHERE id = $2 RETURNING id, first_name, last_name, hidden`,
                [user_key.logged_user.hidden ? false : true, user_key.logged_user.id]
            );

            res.status(200).json({updated_user: updated_user.rows[0]});
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.log_out = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            if(user_key.logged_user) {
                await db.query(
                    `UPDATE users SET online = $1 WHERE id = $2`, 
                    [false, user_key.logged_user.id]
                );
            }
            
            res.clearCookie(`${user_key.guest ? 'guesttoken' : 'usertoken'}`, {path: '/api'});

            res.sendStatus(200);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.delete_account = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            await db.query(
                `DELETE FROM users WHERE id = $1`, 
                [user_key.logged_user.id]
            );

            const groups = await db.query(
                `SELECT * 
                FROM groups 
                WHERE moderator = $1`,
                [user_key.logged_user.id]
            );

            for(const group of groups.rows) {
                const group_posts = await db.query(
                    `SELECT * 
                    FROM posts
                    WHERE original_group = $1`,
                    [group.id]
                );

                for(const group_post of group_posts.rows) {
                    await db.query(`DELETE 
                        FROM comments 
                        WHERE post = $1`,
                        [group_post.id]
                    );
                }

                await db.query(
                    `DELETE
                    FROM posts
                    WHERE original_group = $1`,
                    [group.id]
                );
            }

            const posts = await db.query(
                `SELECT * 
                FROM posts 
                WHERE original_poster = $1`,
                [user_key.logged_user.id]
            );

            for(const post of posts.rows) {
                await db.query(
                    `DELETE
                    FROM comments
                    WHERE post = $1`,
                    [post.id]
                );

                await db.query(
                    `DELETE 
                    FROM posts
                    WHERE id = $1`,
                    [post.id]
                )
            }

            await db.query(
                `DELETE
                FROM comments
                WHERE commenting_user = $1`,
                [user_key.logged_user.id]
            );

            await db.query(
                `DELETE
                FROM chats
                WHERE user_1 = $1
                OR user_2 = $1`,
                [user_key.logged_user.id]
            );

            await db.query(
                `DELETE
                FROM messages
                WHERE sending_user = $1
                OR receiving_user = $1`,
                [user_key.logged_user.id]
            );

            res.clearCookie('usertoken', {path: '/api'});

            res.sendStatus(200);
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};
