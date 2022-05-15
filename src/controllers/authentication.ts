import { RequestHandler } from 'express';
import {Authentication} from '../models/authentication' 

export const authenticate: RequestHandler = (req, res, next) => { 
 let Obj= new Authentication()
 Obj.authenticateFn(req?.body?.userName,req?.body?.password)  
    return res.json({ todos: [] }); 
  };
 

let authenticateObj={
     authenticate: function(req: object,res:object){


    }

}
