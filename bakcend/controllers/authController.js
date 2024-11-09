const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const moment = require('moment-timezone');

//********************************************Register***********************************************
const register = async (req, res) => {
  const { first_name, last_name, email, password, roles } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) {
      return res.status(401).json({ message: 'User already exists' });
    }

    const userRoles = roles && roles.length > 0 ? roles : ['user'];

    // Create the user without manually hashing the password (let pre-save hook handle it)
    const user = await User.create({
      first_name,
      last_name,
      email,
      password, // Plain-text password, hashing is done in the pre-save hook
      roles: userRoles,
    });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
          roles: user.roles, // Include roles in the token
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
          roles: user.roles, // Include roles in the token
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      roles: user.roles, // Include roles in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//************************************Login*******************************************************
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: 'User does not exist' });
    }

    // Compare the provided password with the hashed password
    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      console.error(`Login failed for user ${email}: Incorrect password`);
      return res.status(401).json({ message: 'Wrong Password' });
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          roles: foundUser.roles, // Include roles in the token
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          roles: foundUser.roles, // Include roles in the token
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      email: foundUser.email,
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      roles: foundUser.roles, // Include roles in the response
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//*************************************REFRESH****************************************
const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      try {
        const foundUser = await User.findById(decoded.UserInfo.id).exec();
        if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: foundUser._id,
              roles: foundUser.roles, // Include roles in the token
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        );

        res.json({ accessToken });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    }
  );
};

//**********************************Logout***********************************
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });

  res.json({ message: 'Cookie cleared' });
};

//**********************************Request Password Reset***********************************
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist." });
    }

    // Generate and hash the reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiration time to 1 hour and 10 minutes from now (UTC)
    const expirationTimeUTC = new Date(Date.now() + 70 * 60 * 1000); // UTC time

    // Save the hashed token and expiration time in the database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = expirationTimeUTC;

    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/auth/reset-password/${resetToken}`;

    // Email content
    const message = `You requested a password reset. Please make a PUT request to the following URL: \n\n ${resetUrl}`;

    // Send email
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });

    res.status(200).json({ message: "Password reset link sent to email." });

  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: "Error sending email." });
  }
};

//********************** resetPassword function***********************************************
const resetPassword = async (req, res) => {
  const { token } = req.params; // Token from URL
  const { password } = req.body; // New password from user

  try {
    // Hash the token from the URL to compare with the stored hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
   
    console.log('Hashed Token:', hashedToken);

    // Find user with matching resetPasswordToken and token that has not expired (UTC comparison)
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() }, // Current date in UTC
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Manually set the updatedAt field
    user.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // Add 1 hour

    // Clear the reset token fields since password reset is successful
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
   
    // Save the updated user to the database
    await user.save();
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: "Server error." });
  }
};


module.exports = {
  register,
  login,
  refresh,
  logout,
  requestPasswordReset,
  resetPassword,
};
