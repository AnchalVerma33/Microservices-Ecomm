const { CommentService } = require("../services")

class CommentController{
    constructor(){
        this.service = new CommentService()
    }


    fetchComment = async(req,res,next) => {
        try{
            const { productID } = req.params;
            const data = await this.service.fetchComment(productID);
            return res.json({success:true, data});
        }catch(e){
            next(e)
        }
    }
}


module.exports = CommentController