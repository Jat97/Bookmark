const multer = require('multer');
const cloudinary = require('cloudinary');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUD_KEY,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
    secure: true
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.fieldname === 'profilepic') {
            cb(null, '../express-bookmark/public/profilepics');
        }
        else if(file.fieldname === 'chatimage') {
            cb(null, '../express-bookmark/public/chatimages');
        }
        else if(file.fieldname === 'groupimage') {
            cb(null, '../express-bookmark/public/groupimages');
        }
        else {
            cb(null, '../express-bookmark/public/postimages');
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}`);
    }
});

module.exports.upload = multer({storage: storage});

module.exports.uploadImage = async (req) => {
    let result = await cloudinary.v2.uploader.upload(path.join(`${req.file.destination}/${req.file.fieldname}`));

    return result;
}