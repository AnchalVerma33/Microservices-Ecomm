const { RedisUtils } = require("../database/cache");
const UserRepository = require("../database/repository/user-repo");
const { BadRequestError, APIError } = require("../utils/errors/app-errors");
const {
  FilterValues,
  ValidateEmail,
  ValidatePassword,
  GenerateSalt,
  GeneratePassword,
  GenerateUUID,
  FormatData,
  ComparePass,
  GenerateToken,
  CanSendOtp,
  GenerateRandomPin,
} = require("../utils/helpers");
const SendEmail = require("../utils/mails");

class UserService {
  constructor() {
    this.repository = new UserRepository();
    this.redis = new RedisUtils();
    this.mail = new SendEmail();
  }

  // Register User
  async SignUp(userInput) {
    try {
      const { firstName, lastName, email, password, gender, phoneNumber } =
        userInput;

      let existingUser = 0;

      FilterValues(
        [firstName, lastName, email, password, gender, phoneNumber],
        [null, ""],
        {
          firstName,
          lastName,
          email,
          password,
          gender,
          phoneNumber,
        },
      );

      ValidateEmail(email);
      ValidatePassword(password);

      existingUser = await this.repository.FindUserCount({ email });
      if (existingUser > 0) {
        throw new BadRequestError("Email Already Exist");
      }

      existingUser = await this.repository.FindUserCount({ phoneNumber });

      if (existingUser > 0) {
        throw new BadRequestError("Phone Number already exist");
      }

      const salt = await GenerateSalt();
      const userPassword = await GeneratePassword(password, salt);
      const id = GenerateUUID();

      const newUser = await this.repository.CreateUser({
        id,
        email,
        password: userPassword,
        firstName,
        lastName,
        phoneNumber,
        gender,
        salt,
        verified: false,
      });

      await this.SendOtp(email);

      return FormatData({
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        phone_number: newUser.phoneNumber,
        gender: newUser.gender,
      });
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }

  // Login User
  async Login(userInput) {
    try {
      const { email, password } = userInput;

      ValidateEmail(email);
      ValidatePassword(password);

      const existingUser = await this.repository.FindOneUser({ email });
      if (!existingUser) {
        throw new BadRequestError("User dosen't exist");
      }

      const { password: user_password, salt: user_salt } = existingUser;

      const validPassword = await ComparePass(
        password,
        user_password,
        user_salt,
      );

      if (!validPassword) {
        throw new BadRequestError("Wrong Password");
      }

      // Generate Token
      const token = await GenerateToken({
        email: existingUser.email,
        id: existingUser.id,
      });

      return FormatData({
        id: existingUser.id,
        email: existingUser.email,
        first_name: existingUser.firstName,
        last_name: existingUser.lastName,
        phone_number: existingUser.phoneNumber,
        token,
      });
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }

  // User Profile

  async UserProfile(id) {
    try {
      const existingUser = await this.repository.FindOneUser({ id });
      if (!existingUser) {
        throw new APIError("Profile dosen't exist", 404);
      }
      const formattedData = {
        id: existingUser.id,
        email: existingUser.email,
        first_name: existingUser.firstName,
        last_name: existingUser.lastName,
        phoneNumber: existingUser.phoneNumber,
      };

      if (existingUser.address) {
        formattedData.address = existingUser.address;
      }
      return FormatData(formattedData);
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }

  // Send Otp

  async SendOtp(email) {
    try {
      const data = await CanSendOtp(this.redis, `otp_${email}`);

      if (!data.canSend) {
        return `Can't send otp until ${data.remainingTime} seconds.`;
      }

      const otp = GenerateRandomPin(6);

      const verificationLink = `http://localhost:5001/verifyOtp?email=${email}&otp=${otp}`;

      const message = `Thank you for using our Shopping App\n For Verification Click on below link : ${verificationLink}`;

      await this.mail.sendEmail(message, email);

      await this.redis.RedisSET(`otp_${email}`, otp, 60);

      return `Otp sent : ${otp}`;
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }

  // Verify Otp

  async VerifyOtp(email, otp) {
    try {
      const savedOtp = await this.redis.RedisGET(`otp_${email}`);

      if (savedOtp === otp) {
        await this.redis.RedisDEL(`otp_${email}`);
        return "Otp verified Successfully";
      }
      return "Otp not verified";
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }

  // Update User

  async UpdateUser(id, updates) {
    try {
      const filterUpdates = {};

      for (const key in updates) {
        if (updates[key] !== null) {
          filterUpdates[key] = updates[key];
        }
      }
      FilterValues(
        ["email", "phone_number", "password"],
        [null, ""],
        filterUpdates,
      );

      if (
        filterUpdates.phoneNumber &&
        (await this.repository.FindUserCount({
          phoneNumber: filterUpdates.phoneNumber,
        })) > 0
      ) {
        throw new BadRequestError("Number already exist");
      }

      if (
        filterUpdates.email &&
        (await this.repository.FindUserCount({ email: filterUpdates.email })) >
          0
      ) {
        throw new BadRequestError("Email already exist");
      }

      if (filterUpdates.password) {
        ValidatePassword(filterUpdates.password);
        const salt = await GenerateSalt();
        const userPassword = await GeneratePassword(
          filterUpdates.password,
          salt,
        );
        filterUpdates.password = userPassword;
      }

      const user = await this.repository.UpdateUserDetails(id, filterUpdates);
      delete user.salt;
      delete user.password;
      return user;
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }

  async DeleteUser(filter) {
    try {
      return this.repository.DeleteUserProfile(filter);
    } catch (e) {
      throw new APIError(e, e.statusCode);
    }
  }
}

module.exports = UserService;
