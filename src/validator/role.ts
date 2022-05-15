import Joi from 'Joi'
import { modules, specialRights } from "../config/rightsConfig";
import JoiObjectValidator from '../validator/joiObjectValidator'
import httpError  from 'http-errors';

const nameSchema = Joi.string().trim().alphanum();
const moduleSchema = Joi.string().valid(...modules);
const specialRightsSchema = Joi.array().items(
  Joi.string().valid(...specialRights)
);
export default class Role{ 
    constructor(){} 
addAndUpdateValidator(data:any){ 
    const schema = Joi.object({
        name: nameSchema.required(),
        moduleRights: Joi.array()
          .items(
            Joi.object({
              module: moduleSchema.required(),
              rights: Joi.object({
                read: Joi.boolean()
                  .required()
                  .when('create', { is: true, then: Joi.boolean().valid(true) })
                  .when('update', { is: true, then: Joi.boolean().valid(true) })
                  .when('delete', { is: true, then: Joi.boolean().valid(true) }),
                create: Joi.boolean().required(),
                update: Joi.boolean().required(),
                delete: Joi.boolean().required()
              }).required()
            }).required()
          )
          .required()
          .unique((a, b) => a.module === b.module),
        specialRights: specialRightsSchema.default([])
      });
      return JoiObjectValidator(schema, data);

}
findQueryValidator(queryParams:any){

    try {
        if (queryParams.query) {
          queryParams.query = JSON.parse(queryParams.query);
        }
        if (queryParams.options) {
          queryParams.options = JSON.parse(queryParams.options);
        }
      } catch (err:any) {
        throw httpError(400, `Invalid queryParams: ${err.message}`);
      }
      return JoiObjectValidator(
        Joi.object({
          query: Joi.object(),
          options: Joi.object({
            sort: Joi.object().pattern(/^/, Joi.number().valid(-1, 1).required()),
            offset: Joi.number().min(1),
            limit: Joi.when('options.offset', {
              is: Joi.exist(),
              then: Joi.number().min(1).required(),
              otherwise: Joi.number().min(1),
            }),
          }),
        }),
        queryParams
      );

}
mongoIdValidator(mongoObjectId:any){ 
    return JoiObjectValidator(
        Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .error(new Error('Invalid MongoObjectId')),
        mongoObjectId
      ); 
}
}