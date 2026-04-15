import User from '../model/userSchema.js';
import bcrypt from 'bcrypt';


// 🔐 LOGIN
export const userLogIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    req.session.user = {
      id: user.id,
      username: user.username
    };

    return res.status(200).json({
      message: `${username} login successful`,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📝 SIGNUP
export const userSignUp = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, phone } = req.body;

    // check if user exists
    const exist = await User.findOne({
      where: { username }
    });

    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstname,
      lastname,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
    });

    res.status(200).json({
      message: "User registered successfully",
      user: newUser
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};