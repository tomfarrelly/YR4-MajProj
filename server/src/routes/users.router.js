import { Router } from 'express';

import UsersController from '../controllers/users.controller.js';




const usersRouter = Router();

usersRouter.post("/register", UsersController.register);
usersRouter.post("/login", UsersController.login);
usersRouter.post("/logout", UsersController.logout);
usersRouter.delete("/delete", UsersController.delete);
// router.put("/update-preferences", UsersController.save);


export default usersRouter;