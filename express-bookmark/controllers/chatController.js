const {db} = require('../database/db');
const {validateToken} = require('../database/token');
const {uploadImage} = require('uploadimage');

exports.get_all_chats = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            const user_chats = await db.query(
                `SELECT chats.id AS id,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture
                users.id AS sender_id
                messages.text AS text,
                messages.sent AS sent,
                messages.checked AS checked
                FROM chats 
                INNER JOIN users ON users.id = chats.user_2
                INNER JOIN messages ON messages.id = chats.last_message_sent
                WHERE user_1 = $1`,
                [user_key.logged_user.id]
            );

            const chats = [];
            
            for(const chat of user_chats.rows) {
                const new_chat = {
                    id: chat.id,
                    user: {
                        first_name: chat.first_name,
                        last_name: chat.last_name,
                        profile_picture: chat.profile_picture
                    },
                };

                const messages = await db.query(
                    `SELECT messages.id AS id,
                    messages.text AS text,
                    messages.image AS image,
                    messages.sent AS sent,
                    messages.checked AS checked,
                    users.id AS userid
                    users.first_name AS first_name,
                    users.last_name AS last_name
                    FROM messages 
                    INNER JOIN users ON user.id = messages.sending_user
                    INNER JOIN users ON user.id = messages.receiving_user
                    WHERE (messages.sending_user = $1 AND messages.receiving_user = $2)
                    OR (messages.sending_user = $2 AND messages.receiving_user = $1)`,
                    [user_key.logged_user.id, new_chat.user.id]
                );

                chats.push({chat: new_chat, messages: messages.rows});
            }

            res.status(200).json({chats: chats});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

// exports.get_chat_messages = async (req, res) => {
//     try {
//         const user_key = validateToken(req, res);

//         if(user_key) {
//             const messages = await db.query(
//                 `SELECT messages.id AS id,
//                 messages.sending_user AS sender,
//                 messages.receiving_user AS receiver,
//                 messages.text AS text,
//                 messages.sent AS sent,
//                 messages.checked AS checked
//                 FROM messages
//                 LEFT JOIN users AS sender ON sender.id = messages.sending_user
//                 LEFT JOIN users AS receiver ON receiver.id = messages.receiving_user
//                 WHERE (sender = $1 AND receiver = $2)
//                 OR (sender = $2 AND receiver = $1)`,
//                 [user_key.logged_user.id, req.params.userid]
//             );

//             res.status(200).json({messages: messages});
//         }
//         else {
//             res.status(401).send();
//         }
//     }
//     catch (err) {
//         res.status(500).json({error: err});
//     }
// };

exports.send_message = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            if(req.file) {
                var result = uploadImage(req);
            }

            const message = await db.query(
                `INSERT INTO (sending_user, receiving_user, text, image, sent, checked) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [user_key.logged_user.id, req.params.userid, req.body.text, result ? result.secure_url : null, Date.now(), false]
            );

            res.status(200).json({message: message.rows[0]});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

exports.delete_chat = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            await db.query(`DELETE FROM chats WHERE id = $1`, [req.params.chatid]);
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};