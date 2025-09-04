const db = require('db');
const {validateToken} = require('token');

exports.get_post_feed = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            const all_posts = await db.query(`
                SELECT id ,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture,
                groups.title AS group_title,
                groups.group_image AS group_image,
                posts.text AS text,
                posts.posted AS posted
                FROM posts
                INNER JOIN users ON users.id === posts.original_poster`
            );

            const blocked_users = await db.query(
                `SELECT * from blocked_users WHERE blocked_by = $1`, 
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
            
            const feed_posts = []; 
            
            for(let i = 0; i < all_posts.rows.length; i++) {
                if(blocked_users.rows.some(((block) => block.blocked_user === post.original_poster) === false) 
                    || friends.rows.some((friend) => friend.friend_2 === post.original_poster) ||
                    groups.some((group) => group.member_of === post.original_poster)) {
                        const post_likes = await db.query(`
                            SELECT users.id AS id,
                            users.first_name AS first_name,
                            users.last_name AS last_name,
                            FROM likes 
                            LEFT JOIN users ON users.id === likes.liking_user
                            WHERE likes.liked_post = $1`, 
                            [all_posts.rows[i].id]
                        );

                        feed_posts.push({post: all_posts.rows[i], likes: post_likes.rows});
                }
            }

            res.status(200).json({posts: feed_posts});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.create_post = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            const post = await db.query(
                `INSERT INTO posts (text, original_poster) VALUES ($1, $2) RETURNING *`,
                [req.body.text, user_key.logged_user.id]
            );

            res.status(200).json({post: post.rows[0]});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.edit_post = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            const edited_post = await db.query(
                `ALTER TABLE posts SET text = $1 WHERE id = $2 RETURNING *`,
                [req.body.text, req.params.postid]
            );

            res.status(200).json({post: edited_post.rows[0]});
        }
        else {
            res.send(401).send();
        }
    }
    catch (err) {
        res.send(500).json({error: err});
    }
};

exports.like_post = async (req, res) => {
    try {
        const user_key = validateToken();

        if(user_key) {
            const post_like = await db.query(
                `INSERT INTO likes (liking_user, liked_post, liked_comment) VALUES ($1, $2, $3) RETURNING *`,
                [user_key.logged_user.id, req.params.postid, null]
            );

            res.send(200).json({like: post_like.rows[0]});
        }
        else {
            res.send(401).send();
        }
    }
    catch (err) {
        res.send(500).json({error: err});
    }
};

exports.unlike_post = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            await db.query(
                `DELETE FROM likes WHERE liking_user = $1 AND liked_post = $2`, 
                [user_key.logged_user.id, req.params.postid]
            );

            res.status(200).send();
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.send(500).json({error: err});
    }
}

exports.delete_post = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            await db.query(
                `DELETE FROM posts WHERE id = $1`,
                [req.params.postid]
            );

            res.status(200).send();
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.send(500).json({error: err});
    }
}