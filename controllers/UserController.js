const fs = require('fs');
const User = require('../model/User');
const CsvParser = require('json2csv').Parser
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching user by ID:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, mobile, gender, status, location,profileImage } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.mobile = mobile;
        user.gender = gender;
        user.status = status;
        user.location = location;
        user.profileImage = profileImage

        const updatedUser = await user.save();

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const getSearchUsers = async (req, res) => {
    try {
        const { text } = req.params;

        const users = await User.find({
            $or: [
                { firstName: { $regex: text, $options: 'i' } },
                { lastName: { $regex: text, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Error searching users:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
const exportCsv = async (req, res) => {
    try {
        let users = [];
        const userData = await User.find({});

        userData.forEach((user) => {
            const { firstName, lastName, email, mobile, location, gender, status } = user;
            users.push({ firstName, lastName, email, mobile, location, gender, status });
        });

        const csvHeader = ['ID', 'FirstName', 'LastName', 'Email', 'Mobile', 'Gender', 'Location', 'Status'];

        const csvParser = new CsvParser({ csvHeader });
        const csvData = csvParser.parse(users);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=usersData.csv");

        res.status(200).end(csvData);
    } catch (error) {
        console.error('Error exporting CSV:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser,  getSearchUsers, exportCsv};
