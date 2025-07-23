import User from "../models/User.js";
import bcrypt from 'bcrypt'

const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    console.log(userId, oldPassword, newPassword)

    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(500).json({
        success: false,
        error: "user not found error",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword,user.password)

    if(!isMatch){
        return res.status(500).json({
      success: false,
      error: "wrong old password error",
    });
    }

    const hashedPassword = await bcrypt.hash(newPassword,10)

    const newUser = await User.findByIdAndUpdate({_id : userId},{password : hashedPassword })

    return res.status(200).json({
        success : true
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "setting server error",
    });
  }
};

export { changePassword };
