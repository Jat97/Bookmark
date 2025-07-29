const db = require('db');

module.exports.findGroup = async (req) => {
    const found_group = await db.query(`SELECT * FROM groups WHERE title = $1`, [req.body.title]);

    return found_group.rows[0];
};

module.exports.createCommentTree = (comments) => {
    const nodes = {};

    const tree = [];

    comments.forEach(comment => {
        if(comment.reply_to === null) {
            nodes[comment.id] = {...comment, replies: []}
        }
    });

    comments.forEach(comment => {
        const new_node = nodes[comment.id];

        if(comment.reply_to !== null) {
            nodes[comment.id].replies.push(comment);
        }
        else {
            tree.push(new_node);
        }
    });

    return tree;
}