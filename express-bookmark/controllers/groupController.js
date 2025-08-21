const db = require('db');
const {uploadImage} = require('../database/imageupload');
const {findGroup} = require('../database/misc');
const {validateToken} = require('token');

exports.get_all_groups = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            const all_groups = await db.query(
                `SELECT id,
                title, 
                description, 
                group_image, 
                private 
                FROM groups`
            );
            
            const groups_members_requests = []

            let group_requests;

            all_groups.rows.map(async (group) => {
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
                        
                if(group.moderator === user_key.logged_user.id) {
                    group_requests = await db.query(
                        `SELECT users.id AS id, 
                        users.first_name AS first_name,
                        users.last_name AS last_name,
                        users.profile_picture AS profile_picture
                        FROM group_requests
                        INNER JOIN users ON users.id = group_requests.requesting_user
                        WHERE requested_group = $1`,
                        [group.id]
                    );
                }

                return groups_members_requests.push({
                    group: group, 
                    members: group_memberships.rows, 
                    requests: group_requests ? group_requests.rows : null
                });   
            });

            res.status(200).json({groups: groups_members_requests});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.create_group = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            const found_group = findGroup(req);

            if(found_group) {
                res.status(400).json({title_error: 'A group by this name already exists.'});
            }
            else {
                if(req.file) {
                    var result = uploadImage(req);
                }
                
                const new_group = await db.query(
                    `INSERT INTO groups (title, description, group_image) VALUES ($1, $2, $3) RETURNING *`, 
                    [req.body.title, req.body.description ? req.body.description : '', result ? result.secure_url : null]
                );

                res.status(200).json({group: new_group});
            }
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.update_group_information = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            const found_group = findGroup(req);

            if(found_group) {
                res.status(400).json({title_error: 'A group by this name already exists.'});
            }
            else {
                const group_to_update = await db.query(
                    `SELECT * FROM groups WHERE title = $1`,
                    [req.params.groupid]
                );

                if(req.file) {
                    var result = uploadImage(req);
                }

                await db.query(
                    `ALTER TABLE groups SET title = $1, description = $2, group_image = $3 RETURNING *`, 
                    [req.body.title, req.body.description, result ? result.secure_url : group_to_update.rows[0].group_image]
                );
            }
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.handle_group_privacy = async (req, res) => {
    try {
        const user_key = validateToken(req);

        if(user_key) {
            const group = await db.query(
                `SELECT * FROM groups WHERE title = $1`, 
                [req.params.title]
            );

            const updated_group = await db.query(
                `ALTER TABLE groups SET private = $1 WHERE title = $2 RETURNING *`, 
                [group.rows[0].private ? false : true, req.params.groupid]
            );

            res.status(200).json({group: updated_group});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.get_group_requests = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            const requests = await db.query(
                `SELECT users.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture
                FROM group_requests
                INNER JOIN users ON users.id = group_requests.requesting_user
                WHERE group_requests.id = $1`,
                [req.params.groupid]
            );

            const group_requests = [];

            requests.rows.forEach(request => {
                group_requests.push({
                    id: request.id,
                    first_name: request.first_name,
                    last_name: request.last_name,
                    profile_picture: request.profile_picture
                });
            });

            res.status(200).json({group_requests: group_requests});
        }
        else {
            res.status(401).send();
        }
    }  
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.send_group_request = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            await db.query(
                `INSERT INTO group_requests (requested_group, requesting_user) VALUES ($1, $2)`, 
                [req.params.groupid, user_key.logged_user.id]
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

exports.accept_group_request = async (req, res) => {
    try {
        const user_key = validateToken(req);

        if(user_key) {
            const new_member = await db.query(
                `INSERT INTO group_membership (member, member_of) VALUES ($1, $2) RETURNING *`,
                [user_key.logged_user.id, req.params.groupid]
            );

            await db.query(
                `DELETE FROM group_requests WHERE requested_group = $1 AND requesting_user = $2`, 
                [req.params.groupid, user_key.logged_user.id]
            );

            res.status(200).json({member: new_member});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).send();
    }
};

exports.reject_group_request = async (req, res) => {
    try {
        const user_key = validateToken(req);

        if(user_key) {
            await db.query(
                `DELETE FROM group_requests WHERE requested_group = $1 AND requesting_uer = $2`, 
                [req.params.groupid, user_key.logged_user.id]
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

exports.terminate_membership = async (req, res) => {
    try {
        const user_key = validateToken(req);

        if(user_key) {
            await db.query(
                `DELETE FROM group_membership WHERE member = $1 AND member_of = $2`, 
                [req.params.userid, req.params.groupid]
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

exports.delete_group = async (req, res) => {
    try {
        const user_key = validateToken(req);

        if(user_key) {
            await db.query(
                `DELETE FROM groups WHERE id = $1`, 
                [req.params.groupid]
            )

            res.status(200).send();
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
}