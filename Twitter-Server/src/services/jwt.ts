import { PrismaClient, User } from "@prisma/client";
import JWT from 'jsonwebtoken'
const JWT_SECRET= "adknaodknad"
export default class JWTService {
    public static generateTokenForUser(user : User){
        const payload ={
            id:user?.id,
            email:user?.email,

        };
        const token = JWT.sign(payload, JWT_SECRET); 
    }
}