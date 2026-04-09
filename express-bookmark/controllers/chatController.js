const db = require('../database/db');
const {validateToken} = require('../database/token');
const {uploadImage} = require('../database/imageupload');

exports.get_all_chats = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const user_chats = await db.query(
                `SELECT chats.id AS id,
                chats.last_message_sent AS last_message_sent,
                users.id AS userid,
                users.first_name AS first_name,
                users.last_name AS last_name,
                users.profile_picture AS profile_picture,
                users.online AS online,
                users.hidden AS hidden,
                FROM chats 
                INNER JOIN users ON users.id = chats.user_2
                WHERE user_1 = $1`,
                [user_key.logged_user.id]
            );

            const chats = [];
            
            for(const chat of user_chats.rows) {
                const new_chat = {
                    id: chat.id,
                    user: {
                        id: chat.userid,
                        first_name: chat.first_name,
                        last_name: chat.last_name,
                        profile_picture: chat.profile_picture,
                        online: chat.online,
                        hidden: chat.hidden
                    }
                };

                const messages = await db.query(
                    `SELECT messages.id,
                    messages.text,
                    messages.image,
                    messages.sent,
                    messages.checked,
                    messages.sending_user,
                    messages.receiving_user
                    FROM messages 
                    INNER JOIN users AS sender ON sender.id = messages.sending_user
                    INNER JOIN users AS receiver ON receiver.id = messages.receiving_user
                    WHERE (sender.id = $1 AND receiver.id = $2)
                    OR (sender.id = $2 AND receiver.id = $1)`,
                    [user_key.logged_user.id, new_chat.user.id]
                );

                const arranged_messages = messages.rows.sort((a, b) => a.sent > b.sent ? 1 : -1);

                chats.push({chat: new_chat, messages: arranged_messages});
            }

            res.status(200).json({chats: chats});
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.create_chat = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const new_chat = await db.query(
                `INSERT INTO chats (user_1, user_2) VALUES ($1, $2) RETURNING *`,
                [user_key.logged_user.id, req.params.userid]
            );

            res.status(201).json({chat: new_chat.rows[0]});
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
}

exports.read_chat = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const partner_messages = await db.query(
                `SELECT * 
                FROM messages 
                WHERE sending_user = $1 
                AND receiving_user = $2`,
                [req.params.userid, user_key.logged_user.id]
            );

            for(const message of partner_messages.rows) {
                if(!message.checked) {
                   await db.query(
                    `UPDATE messages 
                    SET checked = true`
                ) 
                }
            }

            res.sendStatus(200);
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.send_message = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            if(req.file) {
                var result = await uploadImage(req);
            }

            let partner_chat = await db.query(
                `SELECT * 
                FROM chats 
                WHERE user_1 = $1 
                AND user_2 = $2`,
                [req.params.userid, user_key.logged_user.id]
            );

            const message = await db.query(
                `INSERT INTO messages (sending_user, receiving_user, text, image, sent, checked) 
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [
                    user_key.logged_user.id, 
                    req.params.userid, 
                    req.body.text, 
                    result ? result.secure_url : null, 
                    new Date(Date.now()), 
                    false
                ]
            );

            if(partner_chat.rows.length === 0 ){
                partner_chat = await db.query(
                    `INSERT INTO chats (user_1, user_2) VALUES ($1, $2)`,
                    [req.params.userid, user_key.logged_user.id, message.rows[0].id]
                );
            }

            res.status(201).json({message: message.rows[0]});
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};

exports.delete_chat = async (req, res) => {
    try {
        const user_key = await validateToken(req, res);

        if(user_key.logged_user) {
            const user_chat = await db.query(
                `SELECT * 
                FROM chats
                WHERE id = $1`,
                [req.params.chatid]
            );

            const partner_chat = await db.query(
                `SELECT * 
                FROM chats 
                WHERE id = $1`,
                [user_chat.rows[0].user_2]
            );

            if(partner_chat.rows.length === 0) {
                await db.query(
                    `DELETE 
                    FROM messages
                    WHERE sending_user = $1 AND receiving_user = $2
                    OR sending_user = $2 AND receiving_user = $1`,
                    [user_chat.rows[0].user_1, user_chat.rows[0].user_2]
                );
            }

            await db.query(
                `DELETE 
                FROM chats 
                WHERE id = $1`, 
                [user_chat.rows[0].id]
            );

            res.sendStatus(200);
        }
        else if(user_key.guest) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        res.status(500).json({server_error: err});
    }
};