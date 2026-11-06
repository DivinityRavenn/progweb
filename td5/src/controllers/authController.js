import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET
const saltRound=10;
export async function registerUser(email,password){
    try{
        const hashpassword=await bcrypt.hash(password,saltRound);
        const user=await User.create({email,password:hashpassword});
        return {success: true,message: "your account has been created"};
    }catch(error){
        return {success:false,message : "something went wrong"};
    }

}

export async function loginUser(email,password){
    try {
        const user =await User.findOne({email});
        const match=await bcrypt.compare(password,user.password);
        if (!match) {
            return { success: false, message: "Identifiants invalides" };
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            success: true,
            message: "Connexion réussie",
            token: token
        };
    } catch (error) {
        return { success: false, message: "Erreur lors de la connexion: " + error.message };
    }
}