import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const validateName = (name) => {
  const namePattern = /^[A-Za-z\s]{3,}$/;
  return namePattern.test(name.trim());
};

const validateEmail = (email) => {
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.com$/;
  return emailPattern.test(email);
};

const validatePassword = (password) => {
  const minLength = /.{8,}/;
  const upperCase = /[A-Z]/;
  const lowerCase = /[a-z]/;
  const digit = /[0-9]/;
  const specialChar = /[!@#$%^&*]/;

  return (
    minLength.test(password) &&
    upperCase.test(password) &&
    lowerCase.test(password) &&
    digit.test(password) &&
    specialChar.test(password)
  );
};

async function userSignUpController(req, res) {
  try {
    const { name, email, password, profilePic } = req.body;

    if (!name || !email || !password) {
      return res.json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }
    if (!validateName(name)) {
      return res.json({
        message: "Name must contain only alphabets and minimum 3 characters",
        success: false,
        error: true,
      });
    }

    if (!validateEmail(email)) {
      return res.json({
        message: "Invalid email format",
        success: false,
        error: true,
      });
    }
    if (!validatePassword(password)) {
      return res.json({
        message:
          "Password must be 8+ char with uppercase, lowercase, number and special char",
        success: false,
        error: true,
      });
    }

    const userExist = await userModel.findOne({ email });

    if (userExist) {
      return res.json({
        message: "Email already registered",
        success: false,
        error: true,
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      name: name.trim().replace(/\s+/g, " "),
      email,
      password: hashPassword,
      profilePic,
    };

    const userData = new userModel(payload);
    const saveUser = await userData.save();

    const tokenData = { _id: saveUser._id, email: saveUser.email };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "8h",
    });

    return res.json({
      message: "User Registered Successfully",
      success: true,
      error: false,
      token,
      data: saveUser,
    });
  } catch (err) {
    return res.json({
      message: err.message || "Server Error",
      success: false,
      error: true,
    });
  }
}

export default userSignUpController;
