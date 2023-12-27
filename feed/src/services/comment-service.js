const { CommentRepo } = require("../database/repository");
const { BadRequestError, APIError } = require("../utils/errors/app-errors");

class CommentService{
    constructor(){
        this.repo = new CommentRepo()
    }


    async fetchComment(productID){
        try {
            const comments = await this.repo.GetCommentforProduct(productID);
            return comments;   
        } catch (e) {
            throw new APIError(e, e.statusCode);   
        }
    }
}


module.exports = CommentService