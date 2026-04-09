const db = require('./db');

module.exports.createCommentTree = async (comments) => {
    const nodes = {};

    const tree = [];

    comments.forEach(comment => {
        if(!comment.reply_to) {
            nodes[comment.id] = {
                id: comment.id,
                commenting_user: comment.first_name && {
                    id: comment.userid,
                    first_name: comment.first_name,
                    last_name: comment.last_name,
                    profile_picture: comment.profile_picture
                },
                commenting_group: comment.title && {
                    id: comment.groupid,
                    title: comment.title,
                    group_image: comment.group_image
                },
                reply_to: null,
                text: comment.text,
                posted: comment.posted,
                edited: null,
                likes: [], 
                replies: []
            }
        }
    });

    for(const comment of comments) {
        const new_node = nodes[comment.id];

        const user_likes = await db.query(
            `SELECT users.id AS userid,
            users.first_name AS first_name,
            users.last_name AS last_name,
            users.profile_picture AS profile_picture
            FROM likes
            INNER JOIN users ON users.id = likes.liking_user
            WHERE likes.liked_comment = $1`, 
            [comment.id]
        );

        const group_likes = await db.query(
            `SELECT groups.id AS groupid,
            groups.title AS title,
            groups.group_image AS group_image
            FROM likes
            INNER JOIN groups ON groups.id = likes.liking_group
            WHERE likes.liked_comment = $1`,
            [comment.id]
        )
        
        const comment_likes = user_likes.rows.concat(group_likes.rows);

        comment_likes.forEach(like => {
            let formatted_like;  

            if(like.userid) {
                formatted_like = {
                    id: like.userid,
                    first_name: like.first_name,
                    last_name: like.last_name,
                    profile_picture: like.profile_picture
                }
            }   
            else {
                formatted_like = {
                    id: like.groupid,
                    title: like.title,
                    group_image: like.group_image
                }
            }
            
            nodes[comment.id]?.likes.push(formatted_like);
        });

        if(comment.reply_to) {
            nodes[comment.reply_to]?.replies.push({
                id: comment.id,
                commenting_user: comment.first_name ? {
                    id: comment.userid,
                    first_name: comment.first_name,
                    last_name: comment.last_name,
                    profile_picture: comment.profile_picture
                } : null,
                commenting_group: comment.title ? {
                    id: comment.groupid,
                    title: comment.title,
                    group_image: comment.group_image
                } : null,
                text: comment.text,
                posted: comment.posted,
                edited: null,
                likes: comment_likes.rows,
                replies: comment.replies
            });
        }
        else {
            tree.push(new_node);
        }
    }

    return tree;
}

module.exports.getPostLikes = async (all_posts) => {
    const feed_posts = [];

    for(const post of all_posts) {
        const user_likes = await db.query(
            `SELECT users.id AS id,
            users.first_name AS first_name,
            users.last_name AS last_name,
            users.profile_picture AS profile_picture
            FROM likes 
            INNER JOIN users ON users.id = likes.liking_user
            WHERE likes.liked_post = $1 AND likes.liking_group IS NULL`, 
            [post.id]
        );

        const group_likes = await db.query(
            `SELECT groups.id AS id,
            groups.title AS title,
            groups.group_image AS group_image
            FROM likes
            INNER JOIN groups ON groups.id = likes.liking_group
            WHERE likes.liked_post = $1 AND likes.liking_user IS NULL`,
            [post.id]
        )

        const post_likes = user_likes.rows.concat(group_likes.rows);

        feed_posts.push({
            id: post.id,
            original_poster: post.first_name ? {
                id: post.userid,
                first_name: post.first_name,
                last_name: post.last_name,
                profile_picture: post.profile_picture
            } : null,
            text: post.text,
            posted: post.posted,
            original_group: post.title ? {
                id: post.groupid,
                title: post.title,
                group_image: post.group_image
            } : null,
            edited: post.edited,
            shared_by: post.sharer_id && {
                id: post.sharer_id,
                first_name: post.sharer_first,
                last_name: post.sharer_last,
                profile_picture: post.sharer_picture
            },
            likes: post_likes
        });
    }

    return feed_posts;
}