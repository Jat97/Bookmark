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
        const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if(user.rows.length !== 0) {
            return Promise.reject('This email address is currently in use.');
        }
    }),
    body('dob', 'Please enter your date of birth.').custom(async (birth) => {
        if(birth > minDate) {
            return await Promise.reject('You must be at least 18 years of age to register.');
        }
    }),
    body('password', 'Please enter a password').trim().isLength({min: 8}).custom(async password => {
        if(password.length < 8) {
            return await Promise.reject('Your password is too short.');
        }
    }),
    body('confirm', 'Please confirm your password').trim().isLength({min: 8}).custom(async (confirm, {req}) => {
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
                    res.status(500).json({error: err});
                }
                else {
                    const user = await db.query(`
                        INSERT INTO users (first_name, last_name, email, dob, description, password, 
                        profile_picture, alma_mater, degree, status, country, online, hidden) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, 
                        [
                            req.body.first_name, 
                            req.body.last_name, 
                            req.body.email, 
                            req.body.dob, 
                            '', 
                            hashWord, 
                            null,
                            null,
                            null, 
                            req.body.status,
                            true, 
                            false
                        ]
                    );

                    jwt.sign({user, expiresIn: new Date(Date.now() + 1000000)}, process.env.TOKEN_KEY, 
                        (err, key) => {
                        if(err) {
                            return res.status(500).json({error: err});
                        }
                        else {
                            res.cookie('signtoken', key, {
                                expires: new Date(Date.now() + 1000000),
                                secure: false,
                                httpOnly: true,
                                path: '/api'
                            }).sendStatus(200);
                        }
                    });
                }
            });
        }
    }
];

exports.log_in = async (req, res) => {
    const user = await db.query(`SELECT * FROM users WHERE email = $1`, [req.body.user]);

    if(user.rows.length === 0) {
        return res.status(400).json({email_err: 'This email is not currently in use.'});
    }
    else {
        if(req.body.password.length === 0) {
            return res.json({pass_err: 'Please enter a password.'});
        }
        else {
            bcrypt.compare(req.body.password, user.rows[0].password, (err, result) => {
                if(err) {
                    return res.status(500).json({error: err});
                }
                else if(result) {
                    const logged_user = user.rows[0];
                    
                    jwt.sign({logged_user, expiresIn: new Date(Date.now() + 1000000)}, process.env.TOKEN_KEY, 
                    (err, key) => {
                        if(err) {
                            return res.status(500).json({error: err});
                        }
                        else {
                            res.cookie('usertoken', key, {
                                expires: new Date(Date.now() + 1000000),
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

exports.get_all_users = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const users = await db.query(
                `SELECT id,
                first_name,
                last_name,
                TO_CHAR(date_of_birth, 'MM/DD/YYYY') AS date_of_birth,
                profile_picture,
                alma_mater,
                degree,
                description,
                status,
                online,
                hidden
                FROM users 
                WHERE id <> $1`,
                [user_key.logged_user.id]
            );

            const blocked = await db.query(
                `SELECT * FROM blocked WHERE blocked_by = $1`, 
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
                    WHERE users.id = $1
                    `,
                    [user.id]
                );

                user = {
                    ...user, 
                    friends: friends.rows
                }
            }

            res.status(200).json({users: users.rows});
        }
        else {
            return res.status(401).send();
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({error: err});
    }
};

exports.get_blocked_list = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const blocked_users = await db.query(
                `SELECT users.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture,
                users.online AS online,
                users.hidden AS hidden
                FROM blocked
                INNER JOIN users ON users.id = blocked.blocked_user
                WHERE blocked_by = $1`,
                [user_key.logged_user.id]
            );

            const blocked = [];

            blocked_users.rows.forEach(user => {
                blocked.push({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    online: user.online,
                    hidden: user.hidden
                });
            });

            res.status(200).json({blocked_users: blocked});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.block_user = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const user = await db.query(
                `SELECT * FROM users WHERE id = $1`, 
                [req.params.userid]
            );

            const block = await db.query(
                `INSERT INTO blocked (blocked_user, blocked_by) VALUES ($1, $2) RETURNING id, blocked_user, blocked_by`, 
                [user.rows[0].id, user_key.logged_user.id]
            );

            res.status(200).json({blocked: block});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.unblock_user = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const updated_block = await db.query(
                `DELETE FROM blocked WHERE blocked_user = $1 RETURNING *`, 
                [req.params.userid]
            );

            res.status(200).json({blocked: updated_block});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.get_friends_list = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const friendslist = await db.query(
                `SELECT users.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture,
                users.online AS online,
                users.hidden AS hidden
                FROM friends
                INNER JOIN users ON users.id = friends.friend_2
                WHERE friend_1 = $1`,
                [user_key.logged_user.id]
            );

            const friends = [];

            friendslist.rows.forEach(friend => {
                friends.push({
                    id: friend.id,
                    first_name: friend.first_name,
                    last_name: friend.last_name,
                    profile_picture: friend.profile_picture,
                    online: friend.online,
                    hidden: friend.hidden
                });
            });

            res.status(200).json({friendslist: friends});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.remove_from_friendslist = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            await db.query(
                `DELETE FROM friends WHERE friend_1 = $1 AND friend_2 = $2`, 
                [user_key.logged_user.id, req.params.userid]
            );

            res.status(200).send();
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.get_notifications = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const notifications = await db.query(
                `SELECT alerts.id as id,
                users.first_name as first_name,
                users.last_name as last_name,
                users.profile_picture as profile_picture,
                alerts.text as text,
                alerts.sent as sent
                FROM alerts
                INNER JOIN users ON users.id = alerts.alerting_user
                WHERE alerted_user = $1`,
                [user_key.logged_user.id]
            );

            const friend_requests = await db.query(
                `SELECT users.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture
                FROM friend_requests
                INNER JOIN users ON users.id = friend_requests.requesting_user
                WHERE requested_user = $1`,
                [user_key.logged_user?.id]
            );

            const pending_requests = await db.query(
                `SELECT users.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture
                FROM friend_requests
                INNER JOIN users ON users.id = friend_requests.requested_user
                WHERE requesting_user = $1`,
                [user_key.logged_user?.id]
            );

            const alerts = {
                notifications: [],
                requests: [],
                pending: []
            };

            if(notifications.rows.length > 0) {
                notifications.rows.forEach(notification => {
                    alerts.notifications.push({
                        id: notification.id,
                        alerting_user: {
                            first_name: notification.first_name,
                            last_name: notification.last_name,
                            profile_picture: notification.profile_picture,
                        },
                        text: notification.text,
                        sent: notification.sent
                    });
                });
            };

            if(friend_requests.rows.length > 0) {
                friend_requests.rows.forEach(request => {
                    alerts.requests.push({
                        id: request.id,
                        first_name: request.first_name,
                        last_name: request.last_name,
                        profile_picture: request.profile_picture
                    });
                });
            };

            if(pending_requests.rows.length > 0) {
                pending_requests.rows.forEach(pending => {
                    alerts.pending.push({
                        id: pending.id,
                        first_name: pending.first_name,
                        last_name: pending.last_name,
                        profile_picture: pending.profile_picture
                    });
                });
            };

            res.status(200).json({alerts: alerts});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.send_friend_request = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const friend_request = await db.query(
                `INSERT INTO friend_requests (requested_user, requesting_user) VALUES ($1, $2) RETURNING *`,
                [req.params.userid, user_key.logged_user.id]
            );

            res.status(200).json({friend_request: friend_request.rows[0]});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.accept_friend_request = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const logged_friend = await db.query(
                `INSERT INTO friends (friend_1, friend_2) VALUES ($1, $2) RETURNING *`, 
                [user_key.logged_user.id, req.params.userid]
            );

            await db.query(
                `INSERT INTO friends (friend_1, friend_2) VALUES ($1, $2)`,
                [req.params.userid, user_key.logged_user.id]
            );

            await db.query(`
                DELETE * FROM friend_requests WHERE requested_user = $1 AND requesting_user = $2`, 
                [req.params.userid, user_key.logged_user.id]
            );

            res.status(200).json({friend: logged_friend});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.reject_friend_request = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            await db.query(
                `DELETE * FROM friend_requests WHERE requested_user = $1 AND requesting_user = $2`, 
                [req.params.userid, user_key.logged_user.id]
            );

            res.status(200).send();
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.get_logged_information = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const user = await db.query(
                `SELECT id,
                first_name,
                last_name,
                TO_CHAR(date_of_birth, 'MM/DD/YYYY') AS date_of_birth,
                profile_picture,
                alma_mater,
                degree
                description,
                status,
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

            const alerts = await db.query(
                `SELECT `
            )

            const logged = {
                profile: user.rows[0],
                friends: friends.rows,
                blocked: blocked.rows
            }

            res.status(200).json({logged_user: logged});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({error: err});
    }
};

exports.edit_profile_picture = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            if(req.file) {
                let result = await uploadImage(req);
                
                const new_picture = await db.query(
                    `UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING *`,
                    [result.secure_url, user_key.logged_user.id]
                );

                res.status(200).json({profile_picture: new_picture});
            }
            else {
                res.status(200).send();
            }
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
};

exports.edit_profile_information = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            console.log(req.body);
            
            const updated_user_data = await db.query(
                `UPDATE users SET 
                first_name = $1,
                last_name = $2, 
                description = $3, 
                alma_mater = $4, 
                degree = $5,
                status = $6,
                WHERE id = $7 
                RETURNING *`,
                [
                    req.body.first_name, 
                    req.body.last_name,
                    req.body.description, 
                    req.body.alma_mater, 
                    req.body.degree, 
                    user_key.logged_user.id
                ]
            );

            res.status(200).json({logged_user: updated_user_data});
        }
        else {
            res.status(400).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
}

exports.update_hidden_status = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const updated_user = await db.query(
                `ALTER TABLE users SET hidden = $1 WHERE id = $2 RETURNING *`,
                [req.body.hidden === 'true' ? true : false, user_key.logged_user.id]
            );

            res.status(200).json({user: updated_user});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.log_out = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            await db.query(
                `ALTER TABLE users SET online = $1 WHERE id = $2`, 
                [false, user_key.logged_user.id]
            );

            res.clearCookie(req.cookies.usertoken ? 'usertoken' : 'signtoken', {path: '/api'});

            res.status(200).redirect('/');
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
}

exports.delete_account = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            await db.query(
                `DELETE * FROM users WHERE id = $1`, 
                [user_key.logged_user.id]
            );

            res.status(200).redirect('/');
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};
