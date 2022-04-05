import { Router } from 'express';

import RestrictionsController from '../controllers/restrictions.controller.js';

const restrictionsRouter = Router();

restrictionsRouter.get('/', RestrictionsController.apiGetRestrictions);
restrictionsRouter.get('/:id', RestrictionsController.apiGetRestrictionsByCountryId);
restrictionsRouter.put('/:id', RestrictionsController.apiUpdateRestriction);



export default restrictionsRouter;