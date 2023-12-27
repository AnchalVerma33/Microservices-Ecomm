const { LikesController } = require("../controller")

module.exports = (app) => {
    const likesController = new LikesController();

    app.get("/getLikes/:productID", likesController.fetchLikes);
}