const { CommentController } = require("../controller")

module.exports = (app) => {
    const commentController = new CommentController();

    app.get("/getComment/:productID", commentController.fetchComment);
}