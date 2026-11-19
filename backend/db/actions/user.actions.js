import { connectToDatabase } from "../connection.js";
import User from "../schemas/user.schema.js";

export const createUser = async (data) => {
  await connectToDatabase();
  const user = new User(data);
  return user.save();
};

export const findUserByEmail = async (email) => {
  await connectToDatabase();
  return User.findOne({ email });
};

export const findUserById = async (id) => {
  await connectToDatabase();
  return User.findById(id);
};

export const findAllUsers = async () => {
  await connectToDatabase();
  return User.find();
};
