const db = require('../database/db');
const {uploadImage} = require('../database/imageupload');
const {findGroup} = require('../database/misc');
const {validateToken} = require('../database/token');

exports.get_all_groups = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const all_groups = await db.query(
                `SELECT groups.id AS id,
                groups.title AS title, 
                groups.description AS description, 
                groups.group_image AS group_image, 
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

            let group_requests;

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

                 const banned_users = await db.query(
                    `SELECT users.id AS id,
                    users.first_name AS first_name,
                    users.last_name AS last_name,
                    users.profile_picture AS profile_picture 
                    FROM banned_users
                    INNER JOIN users ON users.id = banned_users.banned_user
                    WHERE banning_group = $1`,
                    [group.id]
                );
                        
                if(group.userid.toString() === user_key.logged_user?.id.toString()) {
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

                const group_data = {
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
                    requests: group_requests?.rows.length > 0 && group_requests?.rows,
                    banned_users: banned_users?.rows
                }

                groups_members_requests.push(group_data); 
            }

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
        const user_key = await validateToken(req, res);

        if(user_key) {
            const found_group = await findGroup(req);

            if(found_group) {
                res.status(400).json({title_error: 'A group by this name already exists.'});
            }
            else {
                if(!req.body.description) {
                    res.status(400).json({description_error: 'Please include a description for this group.'});
                }
                
                const new_group = await db.query(
                    `INSERT INTO groups (title, description, moderator, group_image, private, created) 
                    VALUES ($1, $2, $3, $4, $5, $6) 
                    RETURNING *`, 
                    [
                        req.body.title, 
                        req.body.description ? req.body.description : '', 
                        user_key.logged_user.id, 
                        null,
                        false,
                        new Date(Date.now())
                    ]
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
        const user_key = await validateToken(req, res);

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
                    [
                        req.body.title, 
                        req.body.description, 
                        result ? result.secure_url : group_to_update.rows[0].group_image
                    ]
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
        const user_key = await validateToken(req);

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

exports.send_group_request = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const updated_group = await db.query(
                `INSERT INTO group_requests (requested_group, requesting_user) VALUES ($1, $2) RETURNING *`, 
                [req.params.groupid, user_key.logged_user.id]
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

exports.leave_group = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            await db.query(
                `DELETE * FROM group_membership WHERE member = $1 AND member_of = $2`,
                [user_key.logged_user.id, req.params.groupid]
            );
        }
        else {
            res.status(400).send();
        }
    }
    catch (err) {
        res.status(500).send({error: err});
    }   
};

exports.accept_group_request = async (req, res) => {
    try {
        const user_key = await validateToken(req);

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
        const user_key = await validateToken(req);

        if(user_key) {
            await db.query(
                `DELETE FROM group_requests WHERE requested_group = $1 AND requesting_user = $2`, 
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

exports.ban_user = async (req, res) => {
    try {
        const user_key = await validateToken(req);

        if(user_key) {
            await db.query(`INSERT INTO banned_users ($1, $2)`, 
                [req.params.userid, req.params.groupid]
            );

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

exports.unban_user = async (req, res) => {
    try {
        const user_key = await validateToken(req);

        if(user_key) {
            await db.query(
                `DELETE FROM banned_users WHERE banned_user = $1 AND banning_group = $2`,
                [req.params.userid, req.params.groupid]
            );
        }
        else {
            res.send(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.delete_group = async (req, res) => {
    try {
        const user_key = await validateToken(req);

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