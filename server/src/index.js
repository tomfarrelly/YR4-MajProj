// const { response } = require('express');
// //import { ObjectId } from 'bson';

// let countries;


// const { MongoClient } = require('mongodb');




// async function main() {

    

//     const uri = "mongodb+srv://root:root@clustertom0.gladq.mongodb.net/?retryWrites=true&w=majority";

//     const client = new MongoClient(uri);

//     try{
//         await client.connect();

//        // await findOneCountryByName(client, 2);

//         await getCountryByID();

//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close()
//     }
   
// }

// main().catch(console.error);

// async function findOneCountryByName (client, nameOfCountry) {
//     const result = await client.db("covoid_db").collection("covoid_collection").findOne({Country_id: nameOfCountry});

//     if (result) {
//         console.log(`Found a Country in the collection with the name '${nameOfCountry}'`);
//         console.log(result);
//     } else {
//         console.log(`No Listings found with the name '${nameOfCountry}'`);
//     }
// }

// //async function listDatabases(client) {
//     // const databasesList = await client.db().admin().listDatabases();

//     // console.log("Databases:");
//     // databasesList.databases.forEach(db => {
//     //     console.log(`- ${db.name}`);
//     // })
//     // db.doc1.aggregate([
//     //     { $match: { _id: ObjectId("620e2e8d97ef54d62cc38b4a") } },
//     //     {
//     //         $lookup:
//     //         {
//     //             from: "restrictions",
//     //             localField: "_id",
//     //             foreignField: "Country_ID",
//     //             as: "Restriction_ID"
//     //         }
//     //     },
//     //     {
//     //         $unwind: "$Restriction_ID"
//     //     },
//     //     {
//     //         $project: {
//     //             __v: 0,
//     //             "Restriction_ID.__v": 0,
//     //             "Restriction_ID._id": 0,
//     //             "Restriction_ID.Country_ID": 0
                
//     //         }
//     //     }
    
//     // ]).pretty();

//      async function getCountryByID() {

            

//         try {
//             // creating an array pipeline
//             const pipeline = [
//                 {
//                     // matching to corresponding id
//                     '$match': {'Restriction_ID': 1}
//                 }, 
//                 {
//                     '$lookup': {
//                         'from': 'covoid_collection', 
//                         'let': {'id': '$Restriction_ID'}, // using $ gives us the corresponding field
//                         // pipeline of operations
//                         'pipeline': [
//                             {
//                                 '$match': { 
//                                     '$expr': {
//                                         '$eq': [
//                                         '$Country_id', '$$id' // $$ 
//                                         ]
//                                     }
//                                 }
//                             }
                            
//                         ], 
//                         'as': 'restrictions' // will add this all as a comments property of the movie object
//                     }
//                 }
//             ];
    
//           return await countries.aggregate(pipeline).next();
//         }
//         catch (e) {
//             console.error(`Something went wrong in getCountriesByID: ${e}`);
//             console.error(`e log: ${e.toString()}`);
//             return null;
//         }
//     }  

//}



import dotenv from 'dotenv'; // 
import { MongoClient } from "mongodb";

import app from "./server.js";
import RestrictionsDAO from "./dao/restrictions.dao.js";
import RequirementsDAO from "./dao/requirements.dao.js";
import TravelDAO from "./dao/travel.dao.js";
import CountriesDAO from "./dao/countries.dao.js";;
import connectDB from '../config/mongodb.js'

// calling the database configuration in the .env 
dotenv.config();

// set port
const port = process.env.PORT;
const dbUri = process.env.DB_URI;
//creating new MongoClient
const client = new MongoClient(dbUri);
// const bodyParser = require('body-parser');
// const models = require(`./models`);
connectDB();

try {
    //using connect method to connect to server
    await client.connect();
    // injecting database with data from dao
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





