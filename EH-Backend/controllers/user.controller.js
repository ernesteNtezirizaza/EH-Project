const db = require("../models");
const User = db.User;
const Role = db.Role;
const bcrypt = require("bcryptjs");
const path = require("path")
const fs = require("fs")
const { literal } = require('sequelize');
const jwt = require("jsonwebtoken");
const sendEmail = require('../Utils/SendEmail')
const dotenv = require("dotenv");

dotenv.config();

exports.createUser = async (req, res) => {
  const { firstName, lastName, username, email, password, roleId } = req.body;

  try {
    // Check if email exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).send({ message: "Email already exists." });
    }

    // Check if username exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).send({ message: "Username already exists." });
    }

    // Create the user
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      roleId,
      image: `${process.env.BACKEND_URL}/uploads/avatar.png`
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(newUser, req);
    if (!emailSent) {
      return res.status(500).send({ message: "Failed to send verification email." });
    }

    return res.status(201).send({ message: "User registered successfully.", data: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message || "Some error occurred while creating the User." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const offset = parseInt(page) * parseInt(limit);

    const users = await User.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      include: Role ? [{ model: Role, attributes: ['name', 'id'] }] : [],
      attributes: [
        'id',
        'firstName',
        'lastName',
        'username',
        'email',
        'isVerified',
        [literal(`to_char("Users"."createdAt", 'YYYY-MM-DD HH24:MI:SS.MS')`), 'createdAt'],
        [literal(`to_char("Users"."updatedAt", 'YYYY-MM-DD HH24:MI:SS.MS')`), 'updatedAt'],
      ],
    });

    res.status(200).send({
      total: users.count,
      users: users.rows,
    });
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving users.',
    });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isVerified: true } });
    const recentUsers = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 3,
      attributes: ['id', 'firstName', 'lastName', 'email', 'roleId', 'isVerified', 'createdAt']
    });

    res.status(200).send({
      totalUsers,
      activeUsers,
      recentUsers
    });
  } catch (err) {
    console.error('Error getting user stats:', err);
    res.status(500).send({ message: "Error retrieving user statistics" });
  }
};

exports.getUserById = (req, res) => {
  User.findByPk(req.params.id, {
    include: [
      {
        model: Role,
        attributes: ['name', 'id']
      }
    ]
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      res.status(200).send(user);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { email: newEmail, username: newUsername } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: `User with id=${id} not found.` });
    }

    // Check if new email already exists
    if (newEmail && newEmail !== user.email) {
      const emailExists = await User.findOne({ where: { email: newEmail } });
      if (emailExists) {
        return res.status(400).send({ message: "Email already exists." });
      }

      // Update user's email and set isVerified to false
      user.email = newEmail;
      user.isVerified = false;

      // Save user changes
      await user.save();

      // Send verification email
      const emailSent = await sendVerificationEmail(user, req);

      if (!emailSent) {
        return res.status(500).send({ message: "Failed to send verification email." });
      }
    }

    // Check if new username already exists
    if (newUsername && newUsername !== user.username) {
      const usernameExists = await User.findOne({ where: { username: newUsername } });
      if (usernameExists) {
        return res.status(400).send({ message: "Username already exists." });
      }

      // Update user's username
      user.username = newUsername;
    }

    // Update other fields
    await user.update(req.body);

    return res.status(200).send({ message: "User updated successfully." });

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message || "Some error occurred while updating the User." });
  }
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({ message: "User deleted successfully!" });
      } else {
        res.status(400).send({ message: `Cannot delete User with id=${id}. Maybe User was not found!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.uploadUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(`Fetching user with ID: ${userId}`);
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          attributes: ['name', 'id']
        }
      ]
    });

    if (!user) {
      console.log('User not found');
      return res.status(404).send({ message: "User not found." });
    }

    const file = req.file;
    if (!file) {
      console.log('No image uploaded');
      return res.status(400).send("No image uploaded!!");
    }

    const imageName = user.image.split("/").pop();
    const imagePath = path.join(__dirname, "../../uploads/", imageName);

    // Remove the old image if it exists and is not the default avatar
    if (imagePath !== path.join(__dirname, "../../uploads/", "avatar.png")) {
      try {
        fs.unlinkSync(imagePath);
        console.log('Old image deleted successfully');
      } catch (err) {
        console.error('Error deleting old image:', err);
        return res.status(500).send(err.toString());
      }
    } else {
      console.log('Old image is the default avatar or not set, not deleting.');
    }

    const filePath = `${process.env.BACKEND_URL}/uploads/${file.filename}`;
    console.log(`New image path: ${filePath}`);

    // Update user image path
    user.image = filePath;
    await user.save();

    console.log(`User image updated to: ${user.image}`);

    res.status(200).send({
      user,
      image: filePath,
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send("Server error");
  }
};

async function sendVerificationEmail(user, req) {
  try {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: process.env.JWT_EXPIRE
    });

    user.verificationToken = token;
    await user.save();

    const username = user.username;
    const link = `${process.env.FRONTEND_URL}/verify-user/${token}`;
    const subject = 'Account Verification - EH';
    const html = `
      <p>Hi <b>${username}</b>,</p>
      <p>Please click on the following <a href="${link}">link</a> to verify your account.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br />
      <p>Best Regards,<br />
      EH<br />
      Together We Can</p>
      <br />
      <p>DISCLAIMER<br />
      ------------------<br />
      This email contains confidential information, do not disclose it to any third parties because it is only reserved for intended EH users.<br />
      If you are not the intended EH user, please delete it and ignore the content.<br />
      Thank you.</p>
  `;

    await sendEmail({
      email: user.email,
      subject: subject,
      html,
    });

    return true;

  } catch (error) {
    console.error(error);
    return false;
  }
}
