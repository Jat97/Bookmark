const db = require('db');

module.exports.findGroup = async (req) => {
    const found_group = await db.query(`SELECT * FROM groups WHERE title = $1`, [req.body.title]);

    return found_group.rows[0];
};

module.exports.createCommentTree = async (comments) => {
    const nodes = {};

    const tree = [];

    comments.forEach(comment => {
        if(comment.reply_to === null) {
            nodes[comment.id] = {
                id: comment.id,
                commenter: {
                    first_name: comment.first_name,
                    last_name: comment.last_name,
                    profile_picture: comment.profile_picture
                },
                reply_to: null,
                text: comment.text,
                posted: comment.posted,
                likes: [], 
                replies: []
            }
        }
    });

    for(const comment of comments) {
        const new_node = nodes[comment.id];

        const comment_likes = await db.query(
            `SELECT users.id AS id,
            users.first_name AS first_name,
            users.last_name AS last_name,
            users.profile_picture AS profile_picture,
            FROM likes
            LEFT JOIN users ON users.id === likes.liking_user,
            WHERE likes.liked_comment = $1`, 
            [comment.id]
        );

        nodes[comment.id].likes.concat(comment_likes.rows);

        if(comment.reply_to !== null) {
            nodes[comment.id].replies.push({
                id: comment.id,
                commenter: {
                    first_name: comment.first_name,
                    last_name: comment.last_name,
                    profile_picture: comment.profile_picture
                },
                text: comment.text,
                posted: comment.posted,
            });
        }
        else {
            tree.push(new_node);
        }
    }

    return tree;
}