const db = require('../database/db');
const {uploadImage} = require('../database/imageupload');
const {validateToken} = require('../database/token');
const {body, validationResult} = require('express-validator');

exports.get_all_groups = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const all_groups = await db.query(
                `SELECT groups.id AS id,
                groups.title AS title, 
                groups.description AS description, 
                groups.group_image AS group_image, 
                groups.moderator AS moderator,
                groups.private AS private,
                users.id AS userid,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture,
                TO_CHAR(created, 'MM/DD/YYYY') AS created
                FROM groups
                INNER JOIN users ON users.id = groups.moderator`
            );
            
            const groups_members_requests = []

            for(const group of all_groups.rows) {
                const group_memberships = await db.query(
                    `SELECT users.id AS id,
                    users.first_name AS first_name,
                    users.last_name AS last_name,
                    users.profile_picture AS profile_picture
                    FROM group_memberships
                    INNER JOIN users ON users.id = group_memberships.member
                    WHERE group_memberships.member_of = $1`, 
                    [group.id]
                ); 
                
                if(user_key?.logged_user.id.toString() === group.moderator.toString()) {
                    var banned_users = await db.query(
                        `SELECT users.id AS id,
                        users.first_name AS first_name,
                        users.last_name AS last_name,
                        users.profile_picture AS profile_picture 
                        FROM banned_users
                        INNER JOIN users ON users.id = banned_users.banned_user
                        WHERE banning_group = $1`,
                        [group.id]
                    );
                            
                    var group_requests = await db.query(
                        `SELECT users.id AS id, 
                        users.first_name AS first_name,
                        users.last_name AS last_name,
                        users.profile_picture AS profile_picture
                        FROM requests
                        INNER JOIN users ON users.id = requests.requesting_user
                        WHERE requested_group = $1`,
                        [group.id]
                    );  
                }
                
                const group_data = {
                    id: group.id,
                    title: group.title,
                    description: group.description,
                    group_image: group.group_image,
                    moderator: {
                        id: group.userid,
                        first_name: group.first_name,
                        last_name: group.last_name,
                        profile_picture: group.profile_picture
                    },
                    private: group.private,
                    created: group.created,
                    members: group_memberships?.rows,
                    requests: group_requests && group_requests?.rows,
                    banned_users: banned_users && banned_users?.rows
                }

                groups_members_requests.push(group_data); 
            }
            
            res.status(200).json({groups: groups_members_requests});
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.create_group = [
    body('title', 'Please enter a title.').isLength({min: 3}).custom(async (title) => {
        const found_group = await db.query(
            `SELECT * 
            FROM groups 
            WHERE title = $1`, 
            [title]
        );

        if(found_group.rows[0]) {
            return Promise.reject('A group by this name already exists.');
        }
    }),
    body('description', 'Please add a description for this group.').isLength({min: 1}),
    body('private', 'Please decide if this group is private or public.'),

    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty) {
            return res.status(400).json({errors: errors});
        }
        else {
            try { 
                const user_key = await validateToken(req, res);

                if(user_key.logged_user) {
                    const new_group = await db.query(
                        `INSERT INTO groups (title, description, moderator, group_image, private, created) 
                        VALUES ($1, $2, $3, $4, $5, $6) 
                        RETURNING title, description, private, created`, 
                        [
                            req.body.title, 
                            req.body.description ? req.body.description : '', 
                            user_key.logged_user.id, 
                            null,
                            req.body.private,
                            new Date(Date.now())
                        ]
                    );

                    res.status(201).json({group: new_group.rows[0]});   
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
        }
    }
];

exports.update_group_information = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const found_group = await db.query(`
                SELECT * 
                FROM groups 
                WHERE title = $1 AND id <> $2`, 
                [req.body.title, req.params.groupid]
            );

            if(found_group.rows[0]) {
                res.status(400).json({title_error: 'A group by this name already exists.'});
            }
            else {
                if(req.file) {
                    var result = await uploadImage(req);
                }

                const updated_group = await db.query(
                    `UPDATE groups SET title = $1, description = $2, group_image = $3 
                    WHERE id = $4 
                    RETURNING id, title, description, group_image, private`, 
                    [
                        req.body.title, 
                        req.body.description,
                        result ? result.secure_url : null, 
                        req.params.groupid
                    ]
                );

                res.status(200).json({group: updated_group.rows[0]});
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

exports.handle_group_privacy = async (req, res) => {
    try {
        const user_key = await validateToken(req);

        if(user_key.logged_user) {
            const updated_group = await db.query(
                `UPDATE groups SET private = $1 WHERE id = $2 RETURNING *`, 
                [req.body.private ? false : true, req.params.groupid]
            );

            res.status(200).json({group: updated_group});
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

exports.send_group_request = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const new_request = await db.query(
                `INSERT INTO requests (requested_group, requested_user, requesting_user) 
                VALUES ($1, $2) 
                RETURNING id, requested_group, requesting_user`, 
                [req.params.groupid, null, user_key.logged_user.id]
            );
            
            res.status(201).json({request: new_request.rows[0]});
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

exports.leave_group = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            await db.query(
                `DELETE * FROM group_membership WHERE member = $1 AND member_of = $2`,
                [user_key.logged_user.id, req.params.groupid]
            );

            res.sendStatus(200);
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.status(400).send();
        }
    }
    catch (err) {
        res.status(500).send({server_error: err});
    }   
};

exports.accept_group_request = async (req, res) => {
    try {
        const user_key = await validateToken(req);

        if(user_key.logged_user) {
            const new_member = await db.query(
                `INSERT INTO group_memberships (member, member_of) VALUES ($1, $2) RETURNING *`,
                [req.params.userid, req.params.groupid]
            );

            await db.query(
                `DELETE FROM requests WHERE requested_group = $1 AND requesting_user = $2`, 
                [req.params.groupid, req.params.userid]
            );

            res.status(201).json({member: new_member});
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

exports.reject_group_request = async (req, res) => {
    try {
        const user_key = await validateToken(req);

        if(user_key.logged_user) {
            await db.query(
                `DELETE FROM requests WHERE requested_group = $1 AND requesting_user = $2`, 
                [req.params.groupid, req.params.userid]
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

exports.ban_user = async (req, res) => {
    try {
        const user_key = await validateToken(req);

        if(user_key.logged_user) {
            const new_ban = await db.query(
                `INSERT INTO banned_users 
                (banned_user, banning_group) 
                VALUES ($1, $2) 
                RETURNING *`, 
                [req.params.userid, req.params.groupid]
            );

            await db.query(
                `DELETE FROM group_memberships WHERE member = $1 AND member_of = $2`, 
                [req.params.userid, req.params.groupid]
            );

            res.status(201).json({ban: new_ban.rows[0]});
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

exports.unban_user = async (req, res) => {
    try {
        const user_key = await validateToken(req);

        if(user_key.logged_user) {
            await db.query(
                `DELETE FROM banned_users WHERE banned_user = $1 AND banning_group = $2`,
                [req.params.userid, req.params.groupid]
            );

            res.sendStatus(200);
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.send(401).send();
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.delete_group = async (req, res) => {
    try {
        const user_key = await validateToken(req);

        if(user_key.logged_user) {
            await db.query(
                `DELETE FROM groups 
                WHERE id = $1`, 
                [req.params.groupid]
            );

            await db.query(
                `DELETE FROM posts 
                WHERE original_group = $1`,
                [req.params.groupid]
            );

            await db.query(
                `DELETE FROM comments
                WHERE commenting_group = $1 OR reply_to = $1`,
                [req.params.groupid]
            );

            await db.query(
                `DELETE FROM group_memberships
                WHERE member_of = $1`,
                [req.params.groupid]
            );

            await db.query(
                `DELETE FROM group_requests
                WHERE requested_group = $1`,
                [req.params.groupid]
            );

            await db.query(
                `DELETE FROM alerts
                WHERE alerting_group =  $1`,
                [req.params.groupid]
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
}