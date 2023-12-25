const { UserController } = require("../controllers");
const { Auth } = require("../middleware/auth");

module.exports = (app) => {
  const userController = new UserController();

  app.post("/register", userController.register);

  app.post("/login", userController.login);

  app.get("/profile", Auth, userController.getUserProfile);

  app.put("/updateProfile", Auth, userController.updateUserProfile);

  app.delete("/deleteProfile", Auth, userController.deleteUserProfile);

  app.post("/sendOtp", userController.sendOtp);

  app.get("/verifyOtp", userController.verifyOtp);
};
