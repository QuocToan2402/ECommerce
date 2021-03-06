import multer from 'multer';
import express from 'express';
import { isAuth } from '../middleware.js';

const uploadRouter = express.Router();//implement express

//function save folder in upload folder and rename to datetime.jpg
const storage = multer.diskStorage({//defile local storage
    destination(req, file, cb) {//
        cb(null, 'uploads/');//
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}.jpg`);
    },
});

const upload = multer({ storage });

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {//only admin can upload, 
    res.send(`/${req.file.path}`);//send file name
}); 

export default uploadRouter;
