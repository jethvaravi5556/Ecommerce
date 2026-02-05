import userModel from "../../models/userModel.js"

async function userDetailController(req,res){
try{

    console.log("userid",req.userId)
    const user=await userModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.status(200).json({
        data:user,
        message:"user Details",
        error:false,
        success:true,
    })
}catch(err){
    res.status(400).json({
        message: err.message || err,
        error: true,
        success: false
    })
}
}
export default userDetailController