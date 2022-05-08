import { Router } from 'express';

import TravelController from '../controllers/travel.controller.js';

const travelRouter = Router();

travelRouter.get('/', TravelController.apiGetTravel);
travelRouter.get('/:id', TravelController.apiGetTravelById);
travelRouter.post('/travel-requirements', TravelController.apiGetTravelRequirementsByDepartureAndArrival);
travelRouter.put('/:id', TravelController.apiUpdateTravel);



export default travelRouter;

