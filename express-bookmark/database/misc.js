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
            nodes[comment.id] = {...comment, likes: [], replies: []}
        }
    });

    for(const comment of comments) {
        const new_node = nodes[comment.id];

        const comment_likes = await db.query(`SELECT id as id,
            users.liking_user as liking_user,
            comments.liked_comment as liked_comment
            FROM likes
            WHERE liked_comment = $1`, 
            [comment.id]
        );

        nodes[comment.id].likes.concat(comment_likes.rows);

        if(comment.reply_to !== null) {
            nodes[comment.id].replies.push(comment);
        }
        else {
            tree.push(new_node);
        }
    }

    return tree;
}