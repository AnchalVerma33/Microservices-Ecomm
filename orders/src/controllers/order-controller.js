const { RedisUtils } = require("../database/cache");
const { OrderService } = require("../services");

class OrderController {
  constructor() {
    this.servcie = new OrderService();
    this.redis = new RedisUtils();
  }

  initiateOrder = async (req, res, next) => {
    try {
      const { productData } = req.body;
      const { user } = req;
      const data = await this.servcie.InitiateOrder({ productData, user });
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  cancelOrder = async (req, res, next) => {
    try {
      const data = await this.servcie.CancelOrder({
        filters: req.params,
        user: req.user,
      });
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  completeOrder = async (req, res, next) => {
    try {
      const { orderID, paymentID, transactionHash } = req.body;
      const data = await this.servcie.CompleteOrder({
        filters: { orderID },
        user: req.user,
        details: { paymentID, transactionHash },
      });
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  getAllOrders = async (req, res, next) => {
    try {
      const filters = req.query;
      filters.userID = req.user.id;
      let infoLevel = "min";
      if (filters.infoLevel === "max") {
        infoLevel = "max";
      }
      delete filters.infoLevel;
      const data = await this.servcie.GetAllOrders(filters, infoLevel);
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  getOneOrder = async (req, res, next) => {
    try {
      const filters = req.query;
      filters.userID = req.user.id;
      let infoLevel = "min";
      if (filters.infoLevel === "max") {
        infoLevel = "max";
      }
      delete filters.infoLevel;
      const data = await this.servcie.GetOneOrder(filters, infoLevel);
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  verifyOrder = async (req, res, next) => {
    try {
      const { orderID } = req.body;
      const { user } = req;
      const data = await this.servcie.VerifyOrder({ orderID, userID: user.id });
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };
}

module.exports = OrderController;
