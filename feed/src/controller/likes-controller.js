const { LikesService } = require("../services")

class LikesController{
    constructor(){
        this.service = new LikesService()
    }


    fetchLikes = async(req,res,next) => {
        try{
            const { productID } = req.params;
            const data = await this.service.fetchLikes(productID);
            return res.json({success:true, data});
        }catch(e){
            next(e)
        }
    }
}


module.exports = LikesController