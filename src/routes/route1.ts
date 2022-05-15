import { Router, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler'
import Role from '../controllers/role';
import { authenticate } from '../controllers/authentication';
import RoleValidator from '../validator/role';
import moduleRight from '../middleware/rightsMiddleware' 


const moduleName = 'role';
let RoleCtlr = new Role()
let roleValidator = new RoleValidator()
const router = Router();
router.post('/authenticate', authenticate)

router.post('/add', moduleRight(moduleName, 'create'), asyncHandler(async (req, res) => {
    const roleData = roleValidator.addAndUpdateValidator(req.body);
    let role = await RoleCtlr.add(roleData);
    res.send(role);
}));

router.get('/find',moduleRight(moduleName, 'read'),
    asyncHandler(async (req, res) => {
        const queryParams = roleValidator.findQueryValidator(req.query);
        let roles = await RoleCtlr.find(queryParams);
        res.send(roles);
    }));
router.get('/findOne/:id',moduleRight(moduleName, 'read'),
asyncHandler(async (req, res) => {
    const _id = roleValidator.mongoIdValidator(req.params.id);
    let role = await RoleCtlr.findOne({ _id });
     res.send(role);
  })
);
router.patch('/update/:id',moduleRight(moduleName, 'update'),   asyncHandler(async (req, res) => {
    const data = roleValidator.addAndUpdateValidator(req.body);
    const _id = roleValidator.mongoIdValidator(req.params.id);
    let role = await RoleCtlr.updateOneById(_id, data);
     res.send(role);
  })); 
router.delete('/delete/:id', moduleRight(moduleName, 'delete'),asyncHandler(async (req, res) => {
    const _id = roleValidator.mongoIdValidator(req.params.id);
    let role = await RoleCtlr.delete({ _id });
     res.send(role);
  }));

export default router;