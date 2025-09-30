import { prisma } from 'config/client';
import { get } from 'node:http';
import { URLSearchParams } from 'node:url';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { comparePassword, getAllUser, getUserById } from 'services/user.service';
const configPassportLocal = () => {
    passport.use(new LocalStrategy({passReqToCallback:true},async function verify(req,username, password, callback) {
        const {session} = req as any;
        if(session?.messages?.length){
            session.messages =[];
        }
        console.log("check username/password",username,password);
        const user = await prisma.user.findUnique({
        where: { username: username },
    });
    if(!user)
    //throw error 
    {
        // throw new Error(`${username} not found`);
        return callback(null, false, { message: `username/password Invalid` });
    }
    //compare password
    const isMath = await comparePassword(password,user.password);
    if(!isMath){
        // throw new Error("Invalid password");
        return callback(null, false, { message: `username/password Invalid` });
    }else{
        return callback(null,user);
    }
}));

    passport.serializeUser(function(user:any, callback) {
    
        callback(null, { id: user.id, username: user.username });
    });

    passport.deserializeUser(async function(user: any, callback) {
       const {id, username} = user
       ///query to db
       const userInDB = await getUserById(id);

        return callback(null, {...userInDB});
    });

}
export default configPassportLocal ;