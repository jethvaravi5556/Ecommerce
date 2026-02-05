import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";

async function userSignUpController(req, res) {
  try {
    const { name, email, password } = req.body;

    console.log("req.body", req.body);

    if (!name) throw new Error("Please Provide Name");
    if (!email) throw new Error("Please Provide Email");
    if (!password) throw new Error("Please Provide PassWord");

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Something went wrong while hashing the password");
    }

    const payLoad = {
      ...req.body,
      role: 'GENERAL',
      password: hashPassword,
    };

    const newUser = new userModel(payLoad);
    const saveUser = await newUser.save();

    res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message: "User Created Successfully",
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

export default userSignUpController;
