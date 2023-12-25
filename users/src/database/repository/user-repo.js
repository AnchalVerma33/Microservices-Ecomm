const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/errors/app-errors");
const { UserModel } = require("../models");


class UserRepository {
  constructor() {
    this.User = UserModel;
  }

  // SignUp
  async CreateUser({
    id,
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    gender,
    salt,
  }) {
    try {
      const user = {
        id,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        gender,
        salt,
      };

      const newUser = new this.User(user);
      const savedUser = await newUser.save();
      return savedUser;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while adding user ${e}`,
      );
    }
  }

  // Find User Count

  async FindUserCount(filter) {
    try {
      const count = await this.User.countDocuments(filter);
      return count;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while fetching Users count ${e}`,
      );
    }
  }

  // Find Unique User By email or phone

  async FindOneUser(filter) {
    try {
      const user = await this.User.findOne(filter);
      return user;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while fetching Users count ${e}`,
      );
    }
  }

  // Update User details

  async UpdateUserDetails(id, updateDetails) {
    try {
     const user = await this.User.findOne({id});
     for(let key in updateDetails){
      user[key] = updateDetails[key];
     }
     const updatedUser = await user.save();
     return updatedUser;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while updating the user details ${e}`,
      );
    }
  }

  async DeleteUserProfile(filter) {
    try {
      const user = await this.User.findOne(filter);
      await user.deleteOne();
      return { success: true };
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while deleting user :  ${e}`,
      );
    }
  }
}

module.exports = UserRepository;
