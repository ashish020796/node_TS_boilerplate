import { modules } from '../config/rightsConfig';
import httpError  from 'http-errors'; 
import { RequestHandler, NextFunction } from 'express';
import Joi from "joi";
import JoiObjectValidator from '../validator/joiObjectValidator'

 
export default function (moduleName: string, rightName:string) {
  return function (req :RequestHandler, res: RequestHandler, next: NextFunction) {  
    JoiObjectValidator(Joi.string().valid(...modules), moduleName);
    JoiObjectValidator(
      Joi.string().valid('read', 'create', 'update', 'delete'),
      rightName
    );
    let found:boolean=false;
    req.user.user.roles.forEach((role:any)=>{
      role.moduleRights.forEach((right:any)=>{  
        if(right.rights[rightName]===true && right.module==moduleName)found=true
      }) 
    })
    if(found)return next(); 
    return next(httpError(401));
  };
};
