const jwt = require('jsonwebtoken');

module.exports.validateToken = (req, res) => {
    return new Promise((resolve, reject) => {
        const token = req.cookies.usertoken;

        if(token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, key) => {
                if(err) {
                    reject(res.status(500).json({error: err}))
                    
                }
                else {
                    return resolve(key);
                }
            })
        }
        else {
            return reject(null)
        }
    });
}