const db = require('../database/db');
const {validateToken} = require('../database/token');
const {getPostLikes} = require('../database/misc');


exports.get_post_feed = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const user_posts = await db.query(
                `SELECT posts.id AS id,
                poster.id AS userid,
                poster.first_name AS first_name,
                poster.last_name AS last_name,
                poster.profile_picture AS profile_picture,
                sharer.id AS sharer_id,
                sharer.first_name AS sharer_first,
                sharer.last_name AS sharer_last,
                sharer.profile_picture AS sharer_picture,
                posts.text AS text,
                posts.posted AS posted
                FROM posts
                INNER JOIN users AS poster ON poster.id = posts.original_poster
                LEFT JOIN users AS sharer ON sharer.id = posts.shared_by
                WHERE posts.original_group IS NULL`
            );

            const group_posts = await db.query(
                `SELECT posts.id as id,
                groups.id AS groupid,
                groups.title AS title,
                groups.group_image AS group_image,
                posts.text AS text,
                posts.posted AS posted
                FROM posts 
                INNER JOIN groups ON groups.id = posts.original_group
                LEFT JOIN users ON users.id = posts.shared_by
                WHERE posts.original_poster IS NULL`
            );

            const all_posts = user_posts.rows.concat(group_posts.rows);
            
            if(user_key.logged_user) {
                const blocked_users = await db.query(
                    `SELECT * from blocked WHERE blocked_by = $1`, 
                    [user_key.logged_user.id]
                );

                const friends = await db.query(
                    `SELECT * from friends WHERE friend_1 = $1`,
                    [user_key.logged_user.id]
                );

                const groups = await db.query(
                    `SELECT * FROM group_memberships WHERE member = $1`,
                    [user_key.logged_user.id]
                );

                const viewable_posts = all_posts.filter(post => 
                    (
                        !blocked_users.rows.some((block) => block.blocked_user === post.original_poster)) 
                        || (friends.rows.some((friend => friend.friend_2 === post.original_poster)))
                        || (groups.some((group) => group.member_of === post.original_poster)
                    )
                );

                const feed_posts = await getPostLikes(viewable_posts);

                res.status(200).json({posts: feed_posts.sort((a, b) => a.posted < b.posted ? 1 : -1)});
            }
            else {
                const feed_posts = await getPostLikes(all_posts);
                
                res.status(200).json({posts: feed_posts});
            }
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.create_post = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const post = await db.query(
                `INSERT INTO posts (text, original_poster, original_group, shared_by, posted, edited) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [
                    req.body.text, 
                    !req.body.groupid ? user_key.logged_user.id : null, 
                    req.body.groupid ? req.body.groupid : null,
                    null, 
                    new Date(Date.now()),
                    null
                ]
            );

            res.status(201).json({post: post.rows[0]});
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

exports.edit_post = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const edited_post = await db.query(
                `ALTER TABLE posts SET text = $1 WHERE id = $2 RETURNING *`,
                [req.body.text, req.params.postid]
            );

            res.status(200).json({post: edited_post.rows[0]});
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

exports.like_post = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const post_like = await db.query(
                `INSERT INTO likes (liking_user, liking_group, liked_post, liked_comment) 
                VALUES ($1, $2, $3, $4) 
                RETURNING liking_user, liked_post`,
                [user_key.logged_user.id, null, req.params.postid, null]
            );

            const post = await db.query(
                `SELECT id AS id,
                users.id AS userid,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture,
                groups.id AS groupid,
                groups.title AS title,
                groups.group_image AS group_image,
                posts.text AS text,
                posts.posted AS posted,
                posts.edited AS edited,
                posts.shared_by AS shared_by
                FROM posts
                WHERE id = $1`,
                [req.params.postid]
            )

            const updated_post = {
                id: post.rows[0].id,
                original_poster: post.rows[0].first_name ? {
                    id: post.rows[0].userid,
                    first_name: post.rows[0].first_name,
                    last_name: post.rows[0].last_name,
                    profile_picture: post.rows[0].profile_picture
                } : null,
                text: post.rows[0].text,
                posted: post.rows[0].posted,
                original_group: post.rows[0].title ? {
                    id: post.rows[0].groupid,
                    title: post.rows[0].title,
                    group_image: post.rows[0].group_image
                } : null,
                edited: post.rows[0].edited,
                shared_by: post.rows[0].shared_by,
                likes: post_like.rows[0]
            }

            if(updated_post.original_poster.id.toString() === user_key.logged_user.id.toString() ||
                updated_post.original_group.id.toString() === user_key.logged_user.id.toString()) {
                await db.query(
                    `INSERT INTO alerts (alerted_user, alerted_group, alerting_user, post, comment, text, sent, checked),
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [
                        updated_post.original_poster.id && updated_post.original_poster.id,
                        updated_post.original_group.id && updated_post.original_group.id,
                        user_key.logged_user.id,
                        req.params.postid,
                        null,
                        'liked your post',
                        new Date(Date.now()),
                        false
                    ]
                )
            }

            res.status(201).json({post_like: post_like.rows[0]});
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

exports.unlike_post = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            await db.query(
                `DELETE FROM likes WHERE liking_user = $1 AND liked_post = $2`, 
                [user_key.logged_user.id, req.params.postid]
            );

            const post = await db.query(
                `SELECT * FROM posts WHERE id = $1`,
                [req.params.postid]
            );

            await db.query(
                `DELETE FROM alerts 
                WHERE post = $1 AND (alerted_user = $2 OR alerted_group = $2) AND alerting_user = $3 AND text = $4`,
                [
                    req.params.postid, 
                    post.rows[0].original_poster ? post.rows[0].original_poster : post.rows[0].original_group,
                    user_key.logged_user.id,
                    'liked your post'
                ]
            )

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

exports.share_post = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const original_post = await db.query(
                `SELECT * 
                FROM posts
                WHERE id = $1`,
                [req.params.postid]
            );

            const shared_post = await db.query(`
                INSERT INTO posts (original_poster, text, posted, original_group, shared_by, edited)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [
                    original_post.rows[0].original_poster, 
                    original_post.rows[0].text, 
                    original_post.rows[0].posted,
                    original_post.rows[0].original_group,
                    user_key.logged_user.id,
                    original_post.rows[0].edited
                ]
            );

            res.status(201).json({post: shared_post.rows[0]});
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

exports.delete_post = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const comments = await db.query(
                `SELECT * FROM comments WHERE post = $1`,
                [req.params.postid]
            );

            for(const comment of comments.rows) {
                await db.query(
                    `DELETE 
                    FROM likes
                    WHERE liked_comment = $1`,
                    [comment.id]
                );

                await db.query(
                    `DELETE
                    FROM comments
                    WHERE id = $1`,
                    [comment.id]
                );
            };

            await db.query(
                `DELETE 
                FROM
                likes
                WHERE liked_post = $1`,
                [req.params.postid]
            );

            await db.query(
                `DELETE FROM posts WHERE id = $1`,
                [req.params.postid]
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