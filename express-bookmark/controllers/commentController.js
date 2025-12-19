const db = require('../database/db');
const {validateToken} = require('../database/token');
const {createCommentTree} = require('../database/misc');

exports.view_post_comments = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const user_comments = await db.query(
                `SELECT comments.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture,
                comments.post as postid,
                comments.text as text,
                comments.reply_to as reply_to
                comments.posted as posted
                FROM comments
                INNER JOIN users ON users.id = comments.commenting_user
                WHERE post = $1 AND comments.commenting_group IS NULL`,
                [req.params.postid]
            );

            const group_comments = await db.query(
                `comments.id AS id,
                groups.title AS title,
                groups.group_image AS group_image,
                comments.post AS post AS postid,
                comment.text AS text,
                comments.reply_to AS reply_to,
                comment.posted AS posted
                FROM comments
                INNER JOIN groups ON groups.id = comments.commenting_group
                WHERE post = $1 AND comments.commenting_user IS NULL`,
                [req.params.postid]
            );

            const comments = user_comments.rows.concat(group_comments.rows);

            const comment_tree = createCommentTree(comments)

            res.status(200).json({comments: comment_tree});
        }
        else {
            res.status(500).send();
        }
    }
    catch (err) {
        res.send(500).json({error: err});
    }
};

exports.create_parent_comment = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const group = await db.query(
                `SELECT * FROM groups WHERE id = $1`,
                [req.body.groupid]
            );

            const comment = await db.query(
                `INSERT INTO comments (commenting_user, commenting_group, text, post, reply_to, posted) 
                VALUES ($1, $2, $3, $4) RETURNING *`,
                [
                    group.rows.length > 0 ? null : user_key.logged_user.id, 
                    group.rows.length > 0 ? group.rows[0] : null, 
                    req.body.text, 
                    req.params.postid, 
                    null, 
                    new Date(Date.now())
                ]
            );

            res.status(200).json({comment: comment.rows[0]});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.send(500).json({error: err});
    }
};

exports.reply_to_comment = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const group = await db.query(
                `SELECT * FROM groups WHERE id = $1`,
                [req.body.groupid]
            );

            const comment = await db.query(
                `SELECT * FROM comments WHERE id = $1`, 
                [req.params.commentid]
            );

            const reply = await db.query(
                `INSERT INTO comments (commenting_user, commenting_group, text, post, reply_to, posted) 
                VALUE ($1, $2, $3, $4, $5) RETURNING *`,
                [
                    group.rows.length > 0 ? null : user_key.logged_user.id, 
                    group.rows.length > 0 ? group.rows[0] : null,
                    req.body.text, 
                    comment.rows[0].post, 
                    comment.rows[0].id, 
                    Date.now()
                ]
            );

            res.status(200).json({reply: reply.rows[0]});
        }
        else {
            res.send(401).json({error: err});
        }
    }
    catch (err) {
        res.send(500).json({error: err});
    }
};

exports.edit_comment = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);
        
        if(user_key) {
            const edited_comment = await db.query(
                `ALTER TABLE comments SET text = $1 WHERE id = $2 RETURNING *`,
                [req.body.text, req.params.commentid]
            );

            res.status(200).json({comment: edited_comment.rows[0]});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.like_comment = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const comment_like = await db.query(
                `INSERT INTO likes (liking_user, liked_post, liked_comment) VALUES ($1, $2, $3) RETURNING *`,
                [user_key.logged_user.id, null, req.params.commentid]
            );

            res.send(200).status({like: comment_like.rows[0]})
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.unlike_comment = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            await db.query(
                `DELETE FROM likes WHERE liking_user = $1 AND liked_comment = $2`,
                [user_key.logged_user.id, req.params.commentid]
            );

            res.status(200).send();
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).send({err: err});
    }
};

exports.delete_comment = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            await db.query(`
                DELETE * 
                FROM comments 
                WHERE id = $1`,
                [req.params.commentid]
            );

            res.status(200).send();
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).send({err: err});
    }
};