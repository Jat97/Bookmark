const db = require('db');

module.exports.findGroup = async (req) => {
    const found_group = await db.query(`SELECT * FROM groups WHERE title = $1`, [req.body.title]);

    return found_group.rows[0];
}