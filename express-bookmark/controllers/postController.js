const db = require('db');
const {uploadImage} = require('imageupload');

exports.get_home_feed = async (req, res) => {
    try {
        const user_key = validateToken(req);

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

            res.status(200).json({posts: all_posts});
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
        const user_key = validateToken(req);

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

            res.status(200).json({post: post});
        }
        else {
            res.send(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.create_posts = async (req, res) => {
    
}