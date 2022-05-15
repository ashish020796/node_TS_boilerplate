import express from 'express'
import controller from '../controllers/users.controller'
import {validatorJWT} from "../middleware/JWTMiddleware" 
import moduleRight from "../middleware/rightsMiddleware" 

const router = express.Router()
const moduleName:string="user";

router.post('/login', controller.login) 
router.get('/user/:id',validatorJWT,moduleRight(moduleName,"read"),controller.getUser)
router.get('/users',validatorJWT, moduleRight(moduleName,"read"),controller.getUsers)
router.post('/register',validatorJWT, moduleRight(moduleName,"read"), controller.register)
router.get('/refresh-token', controller.refreshToken)
//router.post('/update-info', JWTMiddleware, controller.updateInfo)

export default router