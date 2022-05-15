import { RequestHandler } from 'express'; 
import RoleSchema from '../models/role'; 


export default class Role{
constructor(){}
add(data:any){ 
return new RoleSchema(data).save(data)
}


find(params:any){
  return RoleSchema.find({});
}

findOne(query:any){
  return RoleSchema.findOne(query);
}
async updateOneById(_id:string, data: any) {
    const role = await RoleSchema.findOneAndUpdate({ _id }, data, {
    new: true
  }).lean();
  if (!role) throw new Error(`Role not found id ${_id}`);
  return role;
}
updateMany(query:any, data: any){
  return new RoleSchema(query, data);
}
delete(query:any){
  return  RoleSchema.deleteOne(query);
}






}