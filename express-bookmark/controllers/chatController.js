const {db} = require('../database/db');
const {validateToken} = require('../database/token');
const {uploadImage} = require('uploadimage');

exports.get_all_chats = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            const chats = await db.query(
                `SELECT id as id,
                users.user_1 as user_1,
                users.user_2 as user_2,
                messages.last_message_sent as last_message_sent
                FROM chats WHERE user_1 = $1`,
                [user_key.logged_user.id]
            );

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

exports.get_chat_messages = async (req, res) => {
    try {
        const user_key = validateToken(req, res);

        if(user_key) {
            let messages;

            const user_messages = await db.query(
                `SELECT users.sending_user as sending_user,
                users.receiving_user as receiving_user,
                text as text,
                sent as sent,
                checked as checked
                FROM messages WHERE sending_user = $1 AND receiving_user = $2`,
                [user_key.logged_user.id, req.params.userid]
            );

            const partner_messages = await db.query(
                `SELECT users.sending_user as sending_user,
                users.receiving_user as receiving_user,
                text as text,
                sent as sent,
                checked as checked
                FROM messages WHERE sending_user = $1 AND receiving_user = $2`,
                [req.params.userid, user_key.logged_user.id]
            );

            messages = user_messages.rows.concat(partner_messages.rows).sort((a, b) => a.sent > b.sent ? 1 : -1);

            res.status(200).json({messages: messages});
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({error: err});
    }
};

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