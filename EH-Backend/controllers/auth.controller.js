const db = require("../models");
const User = db.User;
const Role = db.Role;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require('../Utils/SendEmail')
const dotenv = require("dotenv");

dotenv.config();

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, roleId } = req.body;

    // Validate the presence of required fields
    if (!firstName || !lastName || !username || !email || !password || !roleId) {
      return res.status(400).send({ message: "All fields are required." });
    }

    // Check if the role exists
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(400).send({ message: "Role not found." });
    }

    // Save User to Database
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      isVerified: false,
      roleId,
      image: `${process.env.BACKEND_URL}/uploads/avatar.png`
    });

    // Send verification email and handle response within the main function
    const emailSent = await sendVerificationEmail(user, req);

    if (emailSent) {
      return res.status(201).send({
        message: "User registered successfully. Please check your email to verify your account before login!",
        data: user
      });
    } else {
      return res.status(500).send({ message: "Failed to send verification email." });
    }
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).send({ message: err.message });
    }
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({
      where: {
        email: email,
      },
      include: [
        {
          model: Role,
          attributes: ['name'], // Fetch only the 'name' attribute of Role
        },
      ],
    });

    // If user is not found, return an error
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return res.status(401).send({
        message: "User is not verified. Please verify your account to login.",
      });
    }

    // Compare the provided password with the hashed password in the database
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    // If the password is invalid, return an error
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Email or Password!",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    const roleName = user.Role ? user.Role.name : '';

    // Return the user details and the JWT token
    return res.status(200).send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      roleName: roleName,
      image: user.image,
      accessToken: token,
      message: 'User Logged in Successfully',
    });
  } catch (err) {
    // Handle any errors
    return res.status(500).send({ message: err.message });
  }
};



exports.resendToken = async (req, res) => {
  try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) return res.status(401).send({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

      if (user.isVerified) return res.status(400).json({ message: 'This account has already been verified. Please log in.'});

      await sendVerificationEmail(user, req, res);

  } catch (error) {
      res.status(500).json({message: error.message})
  }
};


exports.resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).send({ message: "User is already verified." });
    }

    await sendVerificationEmail(user, req, res);

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


exports.verifyUser = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(400).send({ message: "Invalid verification token." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // Send verification email and handle response within the main function
    const emailSent = await sendConfirmationEmailToLogin(user, req, res);

    if (emailSent) {
      return res.status(201).send({ message: `User [${user.username}] verified successfully.`});
    } else {
      return res.status(500).send({ message: "Failed to send confirmation email." });
    }

  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

async function sendConfirmationEmailToLogin(user, req, res) {
  try {
    const username = user.username;
    const subject = 'Account Confirmation - EH';
    const html = `
      <p>Hi <b>${username}</b>,</p>
      <p>Your Account has been verified. Please login.</p>
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

exports.initiatePasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    // Send email with reset link
    const resetLink = `${process.env.BACKEND_URL}/api/v1/auth/reset-password/${resetToken}`;
    const subject = 'Password Reset Request - EH';
    const html = `
      <p>Hi <b>${user.username},</b></p>
      <p>You have requested a password reset. Please follow <a href="${resetLink}">this link</a> to reset your password.</p>
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
      html: html
    });

    res.status(200).json({ message: 'Password reset link sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).send({ message: 'Invalid or expired reset token.' });
    }

    // Update user password
    user.password = bcrypt.hashSync(newPassword, 8);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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