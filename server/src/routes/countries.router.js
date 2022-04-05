import { Router } from 'express';

import CountriesController from '../controllers/countries.controller.js';

const countriesRouter = Router();

countriesRouter.get('/', CountriesController.apiGetCountries);
countriesRouter.get('/:id', CountriesController.apiGetCountriesById);
countriesRouter.put('/:id', CountriesController.apiUpdateCountry);



export default countriesRouter;