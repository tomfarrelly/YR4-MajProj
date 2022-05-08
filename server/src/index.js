import dotenv from 'dotenv'; // 
import { MongoClient } from "mongodb";

import app from "./server.js";
import RestrictionsDAO from "./dao/restrictions.dao.js";
import RequirementsDAO from "./dao/requirements.dao.js";
import TravelDAO from "./dao/travel.dao.js";
import CountriesDAO from "./dao/countries.dao.js";
import UsersDAO from "./dao/users.dao.js";
//import connectDB from '../config/mongodb.js'

// calling the database configuration in the .env 
dotenv.config();

// set port
const port = process.env.PORT;
const dbUri = process.env.DB_URI;
//creating new MongoClient
const client = new MongoClient(dbUri);

//connectDB();

try {
    //using connect method to connect to server
    await client.connect();
    // injecting database with data from dao
    await UsersDAO.injectDB(client);
    await RestrictionsDAO.injectDB(client);
    await RequirementsDAO.injectDB(client);
    await TravelDAO.injectDB(client);
    await CountriesDAO.injectDB(client);
    
   
    // listening for the port number
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    });
}
catch(err) {
    console.error(err.stack);
    process.exit(1);
}





