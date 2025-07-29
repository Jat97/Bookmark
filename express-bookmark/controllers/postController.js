const db = require('db');
const {validateToken} = require('token');

exports.get_home_feed = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            const all_posts = await db.query(`
                SELECT id as id,
                users.original_poster as original_poster,
                text as text,
                posted as posted
                FROM posts`
            );

            const blocked_users = await db.query(
                `SELECT * from blocked_users WHERE blocked_by = $1`, 
                [user_key.logged_user.id]
            );

            all_posts.forEach((user, index) => {
                if(blocked_users.rows.some((blocked) => blocked.blocked_user === user.id)) {
                    all_posts.splice(index, 1);
                }
            });

            res.status(200).json({posts: all_posts.rows[0]});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.get_post_information = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            const post = await db.query(
                `SELECT id as id,
                users.original_poster as original_poster,
                text as text,
                posted as posted
                FROM posts 
                WHERE id = $1`, 
                [req.params.postid]
            );

            res.status(200).json({post: post.rows[0]});
        }
        else {
            res.send(401).send();
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
            // if(req.file) {
            //     var result = uploadImage(req);
            // }

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
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.send(500).json({error: err});
    }
}