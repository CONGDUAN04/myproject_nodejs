import { prisma } from 'config/client';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { comparePassword } from 'services/user.service';
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

    passport.serializeUser(function(user:any, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username });
    });
    });

    passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
    });

}
export default configPassportLocal