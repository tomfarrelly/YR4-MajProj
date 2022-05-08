import { Router } from 'express';

import UsersController from '../controllers/users.controller.js';




const usersRouter = Router();

usersRouter.post("/register", UsersController.register);
usersRouter.post("/login", UsersController.login);
usersRouter.post("/logout", UsersController.logout);
usersRouter.delete("/delete", UsersController.delete);
// router.put("/update-preferences", UsersController.save);
usersRouter.post("/make-admin", UsersController.createAdminUser);

export default usersRouter;