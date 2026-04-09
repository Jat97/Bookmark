const db = require('../database/db');
const {validateToken} = require('../database/token');
const {createCommentTree} = require('../database/misc');

exports.view_post_comments = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const user_comments = await db.query(
                `SELECT comments.id AS id,
                users.id AS userid,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture,
                comments.post AS postid,
                comments.text AS text,
                comments.reply_to AS reply_to,
                comments.posted AS posted
                FROM comments
                INNER JOIN users ON users.id = comments.commenting_user
                WHERE post = $1 AND comments.commenting_group IS NULL`,
                [req.params.postid]
            );

            const blocks = await db.query(
                `SELECT *
                FROM blocked_users
                WHERE blocked_user = $1 OR blocked_by = $1`,
                [user_key.logged_user.id]
            );

            const visible_comments = user_comments.rows.filter(comment => 
                !blocks.rows.some((block) => 
                    block.blocked_user === comment.commenting_user || block.blocked_by === comment.commenting_group
                )
            );

            const group_comments = await db.query(
                `SELECT comments.id AS id,
                groups.id AS groupid,
                groups.title AS title,
                groups.group_image AS group_image,
                comments.post AS post,
                comments.text AS text,
                comments.reply_to AS reply_to,
                comments.posted AS posted
                FROM comments
                INNER JOIN groups ON groups.id = comments.commenting_group
                WHERE post = $1 AND comments.commenting_user IS NULL`,
                [req.params.postid]
            );

            const comments = visible_comments.concat(group_comments.rows);

            const comment_tree = await createCommentTree(comments);

            res.status(200).json({comments: comment_tree});
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.create_comment = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const group = await db.query(
                `SELECT * FROM groups WHERE id = $1`,
                [req.body.groupid]
            );

            const selected_post = await db.query(
                `SELECT * FROM posts WHERE id = $1`,
                [req.params.postid]
            );

            const selected_comment = await db.query(
                `SELECT * FROM comments WHERE id = $1`,
                [req.params.postid]
            );

            const comment = await db.query(
                `INSERT INTO comments (commenting_user, commenting_group, text, post, reply_to, posted) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [
                    group.rows.length === 0 ? user_key.logged_user.id : null, 
                    group.rows.length > 0 ? group.rows[0] : null, 
                    req.body.text,
                    selected_post.rows.length > 0 ? selected_post.rows[0]?.id : selected_comment.rows[0].post, 
                    selected_comment.rows.length > 0 ? selected_comment.rows[0]?.id : null,
                    new Date(Date.now())
                ]
            );

            if((selected_post.rows[0].original_poster?.toString() !== user_key.logged_user.id.toString()) 
                || (selected_comment.rows[0].commenting_user?.toString() !== user_key.logged_user.id.toString())) {
                console.log(selected_post.rows[0].original_poster);
                await db.query(
                    `INSERT INTO alerts (alerted_user, alerted_group, alerting_user, post, comment, text, sent, checked) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [
                        selected_post.rows[0].original_poster ? selected_post.rows[0].original_poster : 
                            selected_comment.rows[0].commenting_user ? selected_comment.rows[0].commenting_user : null,

                        selected_post.rows[0].original_group ? selected_post.rows[0].original_group :
                            selected_comment.rows[0]?.commenting_group ? selected_comment.rows[0]?.commenting_group : null,

                        user_key.logged_user.id,
                        selected_post.rows.length > 0 ? selected_post.rows[0].id : null,
                        selected_comment.rows.length > 0 ? selected_comment.rows[0].id : null,
                        `${comment.rows[0].reply_to ? 'replied to your comment:' : 'commented on your post:'} 
                            ${selected_comment.rows[0].text}`,
                        new Date(Date.now()),
                        false
                    ]
                );
            }

            res.status(201).json({comment: comment.rows[0]});
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

exports.edit_comment = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);
        
        if(user_key.logged_user) {
            const edited_comment = await db.query(
                `ALTER TABLE comments SET text = $1 WHERE id = $2 RETURNING *`,
                [req.body.text, req.params.commentid]
            );

            res.status(200).json({comment: edited_comment.rows[0]});
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

exports.like_comment = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const comment_like = await db.query(
                `INSERT INTO likes (liking_user, liking_group, liked_post, liked_comment) 
                VALUES ($1, $2, $3) 
                RETURNING liking_user, liked_comment`,
                [user_key.logged_user.id, null, null, req.params.commentid]
            );

            const comment = await db.query(
                `SELECT * 
                FROM comments 
                WHERE id = $1`,
                [req.params.commentid]
            )

            if(comment.rows[0].commenting_user.toString() === user_key.logged_user.id.toString() || 
                comment.rows[0].commenting_group?.toString() === user_key.logged_user.id.toString()) {
                   await db.query(
                        `INSERT INTO alerts (alerted_user, alerted_group, alerting_user, post, comment, text, sent checked)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [
                            comment.rows[0].commenting_user && comment.rows[0].commenting_user,
                            comment.rows[0].commenting_group && comment.rows[0].comment_group,
                            user_key.logged_user.id,
                            null,
                            comment.rows[0].id,
                            'liked your comment',
                            new Date(Date.now),
                            comment.rows[0].commenting_group,
                            false
                        ]
                    ); 
                }

            res.status(201).json({like: comment_like.rows[0]});
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

exports.unlike_comment = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            await db.query(
                `DELETE 
                FROM likes 
                WHERE liking_user = $1 AND liked_comment = $2`,
                [user_key.logged_user.id, req.params.commentid]
            );

            const comment = await db.query(
                `SELECT * 
                FROM comments 
                WHERE id = $1`,
                [req.params.commentid]
            );

            await db.query(
                `DELETE FROM alerts 
                WHERE comment = $1 AND (alerted_user = $2 OR alerted_group = $2) AND alerting_user = $3 AND text = $4`, 
                [
                    req.params.commentid,
                    comment.rows[0].commenting_user ? comment.rows[0].commenting_user : comment.rows[0].commenting_group,
                    user_key.logged_user.id,
                    'liked your comment'
                ]
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
        res.status(500).json({server_err: err});
    }
};

exports.delete_comment = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const replies = await db.query(
                `SELECT * 
                FROM comments
                WHERE reply_to = $1`,
                [req.params.commentid]
            );

            for(const reply of replies.rows) {
                await db.query(
                    `DELETE
                    FROM likes 
                    WHERE liked_comment = $1`,
                    [reply.id]
                );

                await db.query(
                    `DELETE
                    FROM comments
                    WHERE id = $1`,
                    [reply.id]
                );
            }

            await db.query(
                `DELETE
                FROM likes
                WHERE liked_comment = $1`,
                [req.params.commentid]
            );

            await db.query(
                `DELETE 
                FROM alerts
                WHERE comment = $1`,
                [req.params.commentid]
            );

            await db.query(
                `DELETE 
                FROM comments 
                WHERE id = $1`,
                [req.params.commentid]
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
        res.status(500).send({server_error: err});
    }
};