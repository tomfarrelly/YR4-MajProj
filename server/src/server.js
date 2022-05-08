import express from 'express'; // middleware
import cors from 'cors'; // importing cors for security

// Importing router objects

import requirementsRouter from './routes/requirements.router.js';
import restrictionsRouter from './routes/restrictions.router.js';
import travelRouter from './routes/travel.router.js';
import countriesRouter from './routes/countries.router.js';
import usersRouter from './routes/users.router.js';


// applying third party middleware to application to add functionality
const app = express();

//parsing incoming requests 
//bounding application level middleware to the app object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/users', usersRouter);
app.use('/requirements', requirementsRouter);
app.use('/restrictions', restrictionsRouter);
app.use('/travel', travelRouter);
app.use('/countries', countriesRouter);


//app.listen(5000, () => {console.log("Server started on port 5000") })

export default app;


