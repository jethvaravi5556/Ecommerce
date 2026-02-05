import userModel from "../models/userModel.js";

const uploadProductPermission = async (userId) => {
  const user = await userModel.findById(userId);

  if (!user || user.role !== 'ADMIN') {
    return false;
  }
  return true;
};

export default uploadProductPermission;
