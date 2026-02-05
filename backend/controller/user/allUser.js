import userModel from "../../models/userModel.js"
async function allUserController(req,res){
    try{
        console.log("User ID:", req.userId); // Debugging log

        // Ensure userId is received correctly
        if (!req.userId) {
            return res.status(401).json({
                message: "Unauthorized: User ID missing",
                error: true,
                success: false,
            });
        }

        const allUsers= await userModel.find()

        res.status(200).json({
            message: "all users",
            data: allUsers, 
            success: true,
            error: false
        })

    }catch(err){
        res.status(400).json({
            messge: err.message || err,
            error: true,
            success: false
        })
    }
}
export default allUserController