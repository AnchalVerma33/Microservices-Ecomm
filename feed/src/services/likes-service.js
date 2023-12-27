const { LikesRepo } = require("../database/repository");
const { BadRequestError, APIError } = require("../utils/errors/app-errors");

class LikesService{
    constructor(){
        this.repo = new LikesRepo()
    }


    async fetchLikes(productID){
        try {
            const comments = await this.repo.GetLikesforProduct(productID);
            return comments;   
        } catch (e) {
            throw new APIError(e, e.statusCode);   
        }
    }
}


module.exports = LikesService