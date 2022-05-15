import mongoose, {Types,Schema} from "mongoose";

export const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String}, 
    roles:[{ type : Schema.Types.ObjectId, ref: 'Role' }]

})

enum Gender {
    Male = 1,
    Female = 0
  }

export interface User {
    userName: string;
    name?: string; 
    password: string;
    email: string;
    Roles: Array<string>;
    gender: Gender;  
  }

export default mongoose.model('User', UserSchema)