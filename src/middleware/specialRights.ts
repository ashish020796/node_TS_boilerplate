/* import { specialRights } from '../config/rightsConfig';
import { RequestHandler } from 'express';
import Joi from "joi";
import JoiObjectValidator from '../validator/joiObjectValidator'

export function check(req:RequestHandler, res: RequestHandler, next:RequestHandler) {
 
    return function (req:RequestHandler, res:RequestHandler, next:RequestHandler) {
      JoiObjectValidator(
        Joi.string().valid(...specialRights),
        SpecialRightName
      );
      if (
        req.user &&
        req.user.roleSummary &&
        req.user.roleSummary.spAecialRights.indexOf(SpecialRightName) > -1
      ) {
        return next();
      }
      return next(createError(401));
    }; 
}; */
