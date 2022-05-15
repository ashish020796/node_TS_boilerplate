import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from '../models/users.model'
const secret="8uwm32msiisisw"

const { JsonWebTokenError, TokenExpiredError } = jwt

const TOKEN_EXPIRED = process.env.TOKEN_EXPIRED || '3600'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refreshToken'
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'tokenScret'

export function jwtCacheError(err: any, res: Response) {
    if (err instanceof TokenExpiredError) {
        return res.status(403).json({ error: 1, error_code: 'TOKEN_EXPIRED', message: 'Token was expired' });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(403).json({ error: 1, error_code: 'TOKEN_INVALID', message: 'Token Invalid' });
    }

    return res.sendStatus(403)
}


export function JWTMiddleware(req: any, res: Response, next: NextFunction) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err: any, result: any) => {
        if (err) return jwtCacheError(err, res)
        const user = await User.findOne({ _id: result.user._id });

        if (user) {
            req.user = user;
            next()
        } else {
            return res.status(400).json({ error: 'User not exists' });
        }
    })
}

export function generateToken(userData:any, expiresIn:any) { 
    return jwt.sign(userData, secret, {
      expiresIn
    });
  }
 
    export function validatorJWT(req: Request, res: Response, next: NextFunction){ 
        const token =
          req.body.token || req.query.token || req.headers["x-access-token"];
      
        if (!token) {
          return res.status(403).send("A token is required for authentication");
        }
        try {
          const decoded = jwt.verify(token, secret); 
          req.user = decoded;
        } catch (err) {
          return res.status(401).send("Invalid Token");
        }
        return next();
      };
