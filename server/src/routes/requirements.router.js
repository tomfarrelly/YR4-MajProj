import { Router } from 'express';

import RequirementsController from '../controllers/requirements.controller.js';

const requirementsRouter = Router();

requirementsRouter.get('/', RequirementsController.apiGetRequirements);
requirementsRouter.get('/:id', RequirementsController.apiGetRequirementsById);
requirementsRouter.get('/travel-requirements/:id', RequirementsController.apiGetRequirementsByDepartureAndArrival);
requirementsRouter.put('/:id', RequirementsController.apiUpdateRequirement);



export default requirementsRouter;