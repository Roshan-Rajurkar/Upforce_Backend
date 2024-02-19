const express = require('express');
const multer = require('multer');
const { getAllUsers, getUserById, updateUser, deleteUser, getSearchUsers ,exportCsv} = require('../controllers/UserController');
const User = require('../model/User');
const router = express.Router();
const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRETE,
  });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        const originalFilename = file.originalname;
        const extension = originalFilename.split('.').pop();
        const filename = `${uniqueSuffix}.${extension}`;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

router.get('/allUsers', getAllUsers);
router.get('/getUser/:id', getUserById);
router.get('/getSearchUsers/:text', getSearchUsers);

router.post('/createUser', upload.single('file'), async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, gender, status, location } = req.body;

        const result = await cloudinary.uploader.upload(req.file.path)

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            mobile,
            gender,
            status,
            location,
            profileImage : result.secure_url
        });

        const savedUser = await newUser.save();
        res.status(201).json({ success: true, data: savedUser });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.put('/edit/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.get('/export2csv', exportCsv);
module.exports = router;
