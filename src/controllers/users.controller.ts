import { modules } from './../config/rightsConfig';
import {JWTMiddleware,generateToken} from "../middleware/JWTMiddleware";
import User from "../models/users.model"; 
import bcrypt from "bcryptjs"
import { NextFunction, Request, Response } from "express";

const expiresIn = 8.64e7;
interface IUserRequest extends Request {
    user?: any
}


export default {
    login: async (req: Request, res: Response) => {
        const { email, password } = req.body
        const user = await User.findOne({email:email}).populate('roles')
        if (user) { 
            const result = await bcrypt.compare(password, user.password);
            if (result) {
              delete user.password;
             // user.admin = user.roleSummary.specialRights.includes('admin');
              const date = new Date(); 
              return res.json({
                email:user.email, 
                expiresAt: new Date(date.getTime() + expiresIn), // convert ms to sec for token
                token: generateToken({user:user}, expiresIn / 1000), // customize userObject to set selectedFields 
              })
            } 
        }

        return res.status(500).json({
            message: 'Username or Password not exits!'
        })
    },
    register: async (req: Request, res: Response) => {
        const { userName, password } = req.body 

        const user = await User.findOne({ userName:userName }) 
        if (user) {
            return res.status(500).json({
                message: 'User exits!'
            })
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const register = new User({ ...req.body, userName,password:encryptedPassword })
        return register.save()
            .then(async (result:any) => {
                const user = JSON.parse(JSON.stringify(result))

                delete user.password
                delete user.id
                delete user.__v
                delete user.createdAt
                delete user.updatedAt


                return res.json({
                    user,
                    token: await generateToken({email:user.email},expiresIn) 
                })
            })
            .catch((error:any) => res.status(500).json({
                message: error.message,
                error
            }))


    },
    refreshToken: async (req: Request, res: Response, next: NextFunction) => {
        const { refreshToken } = req.body

        if (refreshToken == null) {
            return res.status(403).json({
                error: 1,
                error_code: 'REFRESH_TOKEN_REQUIRED',
                message: 'refreshToken is required'
            });
        }


        const token = await Token.findOne({ refreshToken })


        if (!token) {
            return res.status(403).json({
                error: 1,
                error_code: 'REFRESH_TOKEN_NOT_EXISTS',
                message: 'refreshToken not exists'
            });
        }

        return res.json({
            accessToken: await Token.refreshToken(refreshToken, res)
        })

    },
    updateInfo: async (req: IUserRequest, res: Response, next: NextFunction) => {
        const { name } = req.body
        const { _id, ...user } = req.body
        User.findOneAndUpdate({ _id: _id }, user, { runValidators: true, new: true })
            .then(result => res.json(result))
            .catch(error => res.status(500).json({ message: error.message, error }))

    },
    getUser: async (req: Request, res: Response) => {   
        const user = await User.findById(req.params.id) 
        if (!user) {
            return res.status(500).json({
                message: 'Not found!'
            })

        } 
        else{return res.send(user)}
    },
    getUsers: async (req: Request, res: Response, next: NextFunction) => { 
        const users = await User.find({},{name:1,}) 
        if (users) { 
            return res.json({users})  
        }
        else { return res.status(500).json({
            message: 'Not found!'
        })} 


    }
}