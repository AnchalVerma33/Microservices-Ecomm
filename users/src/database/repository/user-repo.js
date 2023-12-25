const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/errors/app-errors");
const connectDB = require("../connect");
const { User } = require("../models");

class UserRepository {
  constructor() {
    this.User = new User().schema;
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

      const newUser = await this.User.create(user);
      return newUser;
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
      const count = await this.User.count({ where: filter });
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
      const user = await this.User.findOne({ where: filter });
      if (!user) {
        return null;
      }
      return user.dataValues;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error while fetching Users count ${e}`,
      );
    }
  }

  // Update User details

  async UpdateUserDetails(id, updateDetails, returnUpdatedDetails = true) {
    try {
      const [updatedCount, updatedUsers] = await this.User.update(
        updateDetails,
        {
          where: { id },
          returning: returnUpdatedDetails,
        },
      );
      const user = updatedUsers[0].dataValues;
      return user;
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
      await this.User.destroy({ where: filter });
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
