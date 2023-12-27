const {
    APIError,
    BadRequestError,
    STATUS_CODES,
  } = require("../../utils/errors/app-errors");
const { DB } = require("../connect");

class LikesRepo{
    
    async GetLikesforProduct(productID){
        try {
            const query = `SELECT count(*) FROM likes WHERE product_id='${productID}'`;
            const result = await DB.connection.execute(query);
            return result.rows;
        } catch (e) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                `Error while fetching comments ${e}`,
              );  
        }
    }

}


module.exports =  LikesRepo 