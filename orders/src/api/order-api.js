const { OrderController } = require("../controllers");
const { Auth } = require("../middleware/auth");

module.exports = (app) => {
  const orderController = new OrderController();

  app.post("/initiate", Auth, orderController.initiateOrder);

  app.post("/cancel/:orderID", Auth, orderController.cancelOrder);

  app.post("/complete", Auth, orderController.completeOrder);

  app.get("/getAllOrders", Auth, orderController.getAllOrders);

  app.get("/getOneOrder", Auth, orderController.getOneOrder);

  app.post("/verifyOrder", Auth, orderController.verifyOrder);
};
