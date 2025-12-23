const db = require('../database/db');
const {validateToken} = require('../database/token');

exports.get_post_feed = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const user_posts = await db.query(
                `SELECT posts.id as id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture,
                posts.text AS text,
                posts.posted AS posted
                FROM posts
                INNER JOIN users ON users.id = posts.original_poster
                WHERE posts.original_group IS NULL`
            );

            const group_posts = await db.query(
                `SELECT posts.id as id,
                groups.title AS title,
                groups.group_image AS group_image
                FROM posts 
                INNER JOIN groups ON groups.id = posts.original_group
                WHERE posts.original_poster IS NULL`
            );

            const all_posts = user_posts.rows.concat(group_posts.rows);

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
            
            const feed_posts = []; 
            
            for(let i = 0; i < all_posts.length; i++) {
                if(!blocked_users.rows.some(((block) => block.blocked_user === post.original_poster)) 
                    || friends.rows.some((friend) => friend.friend_2 === post.original_poster) ||
                    groups.some((group) => group.member_of === post.original_poster)) {
                    const user_likes = await db.query(
                        `SELECT users.id AS id,
                        users.first_name AS first_name,
                        users.last_name AS last_name,
                        users.profile_picture AS profile_picture
                        FROM likes 
                        INNER JOIN users ON users.id = likes.liking_user
                        WHERE likes.liked_post = $1 AND likes.liking_group IS NULL`, 
                        [all_posts[i].id]
                    );

                    const group_likes = await db.query(
                        `SELECT groups.id AS id,
                        groups.title AS title,
                        groups.group_image AS group_image
                        FROM likes
                        INNER JOIN groups ON groups.id = likes.liking_group
                        WHERE likes.liked_post = $1 AND likes.liking_user IS NULL`,
                        [all_posts[i].id]
                    )

                    const post_likes = user_likes.rows.concat(group_likes.rows);

                    feed_posts.push({
                        id: all_posts[i].id,
                        original_poster: all_posts[i].first_name ? {
                            first_name: all_posts[i].first_name,
                            last_name: all_posts[i].last_name,
                            profile_picture: all_posts[i].profile_picture
                        } : null,
                        text: all_posts[i].text,
                        posted: all_posts[i].posted,
                        original_group: all_posts[i].title ? {
                            title: all_posts[i].title,
                            group_image: all_posts[i].group_image
                        } : null,
                        edited: all_posts[i].edited,
                        shared_by: all_posts[i].shared_by,
                        likes: post_likes
                    });
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
        const user_key = await validateToken(req, res);

        if(user_key) {
            const post = await db.query(
                `INSERT INTO posts (text, original_poster, posted) VALUES ($1, $2, $3) RETURNING *`,
                [req.body.text, user_key.logged_user.id, new Date(Date.now())]
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
        const user_key = await validateToken(req, res);

        if(user_key) {
            const edited_post = await db.query(
                `ALTER TABLE posts SET text = $1 WHERE id = $2 RETURNING *`,
                [req.body.text, req.params.postid]
            );

            res.status(200).json({post: edited_post.rows[0]});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.like_post = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
            const post_like = await db.query(
                `INSERT INTO likes (liking_user, liked_post, liked_comment) VALUES ($1, $2, $3) RETURNING *`,
                [user_key.logged_user.id, req.params.postid, null]
            );

            const post = await db.query(
                `SELECT id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture,
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
                    first_name: post.rows[0].first_name,
                    last_name: post.rows[0].last_name,
                    profile_picture: post.rows[0].profile_picture
                } : null,
                text: post.rows[0].text,
                posted: post.rows[0].posted,
                original_group: post.rows[0].title ? {
                    title: post.rows[0].title,
                    group_image: post.rows[0].group_image
                } : null,
                edited: post.rows[0].edited,
                shared_by: post.rows[0].shared_by,
                likes: post_like.rows[0]
            }

            res.status(200).json({post: updated_post});
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

exports.unlike_post = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

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
        res.status(500).json({error: err});
    }
};

exports.share_post = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key) {
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
                    user_key.logged_user,
                    original_post.rows[0].edited
                ]
            );

            res.status(200).json({post: shared_post.rows[0]})
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({err: err});
    }
}

exports.delete_post = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

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
        res.status(500).json({error: err});
    }
}