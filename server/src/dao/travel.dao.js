import { ObjectId } from 'bson';

// variables created when file is loaded
let requirements;
let travels;
//let restrictions;
let restdb;
const DEFAULT_SORT = [["travel_id", -1]]

class TravelDAO {
    // inject method gives reference to connection & stores it in travel
    static async injectDB(conn) {
        if (travels) { // checks if travel has a value
            return // if it does, return 
        }
        try {
           
            restdb = await conn.db(process.env.DB_NAME);
            // reference to travel collection inside the db
            travels = await restdb.collection("travel");
            requirements = await restdb.collection("requirements");
           
        } 
        catch (e) {
            console.error(`Unable to establish a collection handle in TravelDAO: ${e}`);
        }
    }



    static async getRequirements(query = {}, project = {}, sort = DEFAULT_SORT,  page = 0, requirementsPerPage = 10) {
        let cursor;
        try {
            cursor = await requirements.find(query).project(project).sort(sort);
        } 
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { requirementsList: [], totalNumRequirements: 0 }
        }
        // cursor fetches documents in batches 
        const displayCursor = cursor.skip(requirementsPerPage*page).limit(requirementsPerPage);
    
        try {
            // converting cursor object into array 
            const requirementsList = await displayCursor.toArray();
            const totalNumRequirements = (page === 0) ? await requirements.countDocuments(query) : 0;
        
            return { requirementsList, totalNumRequirements }
        } 
        catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { requirementsList: [], totalNumRequirements: 0 }
        }
    }





    
    static async getTravel(query = {}, project = {}, sort = DEFAULT_SORT,  page = 0, travelPerPage = 10) {
        let cursor;
        try {
            cursor = await travels.find(query).project(project).sort(sort);
        } 
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { travelList: [], totalNumTravel: 0 }
        }
        // cursor fetches documents in batches 
        const displayCursor = cursor.skip(travelPerPage*page).limit(travelPerPage);
    
        try {
            // converting cursor object into array 
            const travelList = await displayCursor.toArray();
            const totalNumTravel = (page === 0) ? await travel.countDocuments(query) : 0;
        
            return { travelList, totalNumTravel }
        } 
        catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { travelList: [], totalNumTravel: 0 }
        }
    }

    static async getTravelById(id) {
        try {
            // creating an array pipeline
            const pipeline = [
                // {
                //     // matching objectId to corresponding id
                //     '$match': {'_id': new ObjectId(id)}
                // },
                // {
                //     '$lookup': {
                //         'from': 'countries', 
                //         'let': {'departure_id': '$departure_id'}, // using $ gives us the corresponding field
                //         // pipeline of operations
                //         'pipeline': [
                //             {
                //                 '$match': { 
                //                     '$and' : [{
                //                     '$expr': {
                //                         '$eq': [
                //                         '$country_id', '$$departure_id' // $$ 
                //                         ]
                //                     }
                //                 }]
                //                 }
                //             }, 
                            
                //             {
                //                 '$sort': {'country_id': -1}
                //             }
                //         ], 
                //         'as': 'departure_country' // will add this all as a restrictions property of the country object
                //     }
                // }, 
                // {
                //     '$lookup': {
                //         'from': 'countries', 
                //         'let': {'arrival_id': '$arrival_id'}, // using $ gives us the corresponding field
                //         // pipeline of operations
                //         'pipeline': [
                //             {
                //                 '$match': { 
                //                     '$and' : [{
                //                     '$expr': {
                //                         '$eq': [
                //                         '$country_id', '$$arrival_id' // $$ 
                //                         ]
                //                     }
                //                 }]
                //                 }
                //             }, 
                            
                //             {
                //                 '$sort': {'country_id': -1}
                //             }
                //         ], 
                //         'as': 'arrival_country' // will add this all as a restrictions property of the country object
                //     }
                // }, 

                // {
                //     '$lookup': {
                //         'from': 'travel', 
                //         'let': {'id': '$_id'}, // using $ gives us the corresponding field
                //         // pipeline of operations
                //         'pipeline': [
                //             {
                //                 '$match': { 
                //                     '$and' : [{
                //                     '$expr': {
                //                         '$eq': [
                //                         '$_id', '$$id' // $$ 
                //                         ]
                //                     }
                //                 }]
                //                 }
                //             }, 
                            
                //             {
                //                 '$sort': {'departure_id': -1}
                //             }
                //         ], 
                //         'as': 'arrival' // will add this all as a restrictions property of the country object
                //     }
                // }, 
                // {
                //     '$lookup': {
                //         'from': 'countries', 
                //         'let': {'departure_id': '$departure_id'}, // using $ gives us the corresponding field
                //         // pipeline of operations
                //         'pipeline': [
                //             {
                //                 '$match': { 
                //                     '$and' : [{
                //                     '$expr': {
                //                         '$eq': [
                //                         '$country_id', '$$departure_id' // $$ 
                //                         ]
                //                     }
                //                 }]
                //                 }
                //             }, 
                            
                //             {
                //                 '$sort': {'country_id': -1}
                //             }
                //         ], 
                //         'as': 'departure_country' // will add this all as a restrictions property of the country object
                //     }
                // }, 
                // {
                //     '$lookup': {
                //         'from': 'countries', 
                //         'let': {'arrival_id': '$arrival_id'}, // using $ gives us the corresponding field
                //         // pipeline of operations
                //         'pipeline': [
                //             {
                //                 '$match': { 
                //                     '$and' : [{
                //                     '$expr': {
                //                         '$eq': [
                //                         '$country_id', '$$arrival_id' // $$ 
                //                         ]
                //                     }
                //                 }]
                //                 }
                //             }, 
                            
                //             {
                //                 '$sort': {'country_id': -1}
                //             }
                //         ], 
                //         'as': 'arrival_country' // will add this all as a restrictions property of the country object
                //     }
                // } 

                {
                    // matching objectId to corresponding id
                    '$match': {'_id': new ObjectId(id)}
                },
                {
                    '$lookup': {
                        'from': 'countries', 
                        'let': {'departure_id': '$departure_id'}, // using $ gives us the corresponding field
                        // pipeline of operations
                        'pipeline': [
                            {
                                '$match': { 
                                    '$and' : [{
                                    '$expr': {
                                        '$eq': [
                                        '$country_id', '$$departure_id' // $$ 
                                        ]
                                    }
                                }]
                                }
                            }, 
                            
                            {
                                '$sort': {'country_id': -1}
                            }
                        ], 
                        'as': 'departure_country' // will add this all as a restrictions property of the country object
                    }
                }, 
                {
                    '$lookup': {
                        'from': 'countries', 
                        'let': {'arrival_id': '$arrival_id'}, // using $ gives us the corresponding field
                        // pipeline of operations
                        'pipeline': [
                            {
                                '$match': { 
                                    '$and' : [{
                                    '$expr': {
                                        '$eq': [
                                        '$country_id', '$$arrival_id' // $$ 
                                        ]
                                    }
                                }]
                                }
                            }, 
                            
                            {
                                '$sort': {'country_id': -1}
                            }
                        ], 
                        'as': 'arrival_country' // will add this all as a restrictions property of the country object
                    }
                }, 
                {
                    '$lookup': {
                        'from': 'requirements', 
                        'let': {'requirements_id': '$requirements_id'}, // using $ gives us the corresponding field
                        // pipeline of operations
                        'pipeline': [
                            {
                                '$match': { 
                                    '$expr': {
                                        '$eq': [
                                        '$requirements_id', '$$requirements_id' 
                                        ]
                                    }
                                }
                            }, 
                            {
                                '$sort': {'travel_id': 1}
                            }
                        ], 
                        'as': 'travel_requirements' // will add this all as a restrictions property of the country object
                    }
                },

                { 

                    '$unwind': '$travel_requirements' // $unwind used for getting data in object or for one record only
                    
                }, 
                

                {
                    '$lookup': {
                        'from': 'vaccination', 
                        'let': {'vaccine_id': '$travel_requirements.vaccine_id'}, // using $ gives us the corresponding field
                        // pipeline of operations
                        'pipeline': [
                            {
                                '$match': { 
                                    '$and' : [{
                                    '$expr': {
                                        '$eq': [
                                        '$vaccine_id', '$$vaccine_id' // $$ 
                                        ]
                                    }
                                }]
                                }
                            }, 
                            {
                                '$sort': {'vaccine_id': -1}
                            }
                        ], 
                        'as': 'vaccine_requirements' // will add this all as a restrictions property of the country object
                    }
                },
                    {
                        '$lookup': {
                            'from': 'quarantine', 
                            'let': {'quarantine_id': '$travel_requirements.quarantine_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$quarantine_id', '$$quarantine_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'quarantine_id': -1}
                                }
                            ], 
                            'as': 'quarantine_requirements' // will add this all as a restrictions property of the country object
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'test', 
                            'let': {'test_id': '$travel_requirements.test_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$test_id', '$$test_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'test_id': -1}
                                }
                            ], 
                            'as': 'test_requirements' // will add this all as a restrictions property of the country object
                        }
                    },
                    { 

                        '$unwind': '$test_requirements' // $unwind used for getting data in object or for one record only
                        
                    }, 
                    {
                        '$lookup': {
                            'from': 'pcr', 
                            'let': {'pcr_id': '$test_requirements.pcr_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        // '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$pcr_id', '$$pcr_id' // $$ 
                                            ]
                                        }
                                    //}]
                                    }
                                }, 
                                {
                                    '$sort': {'pcr_id': -1}
                                }
                            ], 
                            'as': 'pcr_requirements' // will add this all as a restrictions property of the country object
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'antigen', 
                            'let': {'antigen_id': '$test_requirements.antigen_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        // '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$antigen_id', '$$antigen_id' // $$ 
                                            ]
                                        }
                                    //}]
                                    }
                                }, 
                                {
                                    '$sort': {'antigen_id': -1}
                                }
                            ], 
                            'as': 'antigen_requirements' // will add this all as a restrictions property of the country object
                        }
                    }
                
                    
                    
                    
                    

            ];
    
          return await travels.aggregate(pipeline).next();
          
        }
        catch (e) {
            console.error(`Something went wrong in getTravelById: ${e}`);
            console.error(`e log: ${e.toString()}`);
            return null;
        }
    }
    
    static async getTravelRequirementsByDepartureAndArrival(departure_id, arrival_id) {
        try {
            // creating an array pipeline
            const pipeline = [
                {
                    '$match': {
                        //'_id': new ObjectId(id),
                        'departure_id': departure_id, 
                        'arrival_id': arrival_id

                    }
                  },
                  {
                    '$lookup': {
                        'from': 'countries', 
                        'let': {'departure_id': '$departure_id'}, // using $ gives us the corresponding field
                        // pipeline of operations
                        'pipeline': [
                            {
                                '$match': { 
                                    '$and' : [{
                                    '$expr': {
                                        '$eq': [
                                        '$country_id', '$$departure_id' // $$ 
                                        ]
                                    }
                                }]
                                }
                            }, 
                            
                            {
                                '$sort': {'country_id': -1}
                            }
                        ], 
                        'as': 'departure_country' // will add this all as a restrictions property of the country object
                    }
                }, 
                {
                    '$lookup': {
                        'from': 'countries', 
                        'let': {'arrival_id': '$arrival_id'}, // using $ gives us the corresponding field
                        // pipeline of operations
                        'pipeline': [
                            {
                                '$match': { 
                                    '$and' : [{
                                    '$expr': {
                                        '$eq': [
                                        '$country_id', '$$arrival_id' // $$ 
                                        ]
                                    }
                                }]
                                }
                            }, 
                            
                            {
                                '$sort': {'country_id': -1}
                            }
                        ], 
                        'as': 'arrival_country' // will add this all as a restrictions property of the country object
                    }
                }, 
                {
                    '$lookup': {
                        'from': 'requirements', 
                        'let': {'id': '$requirements_id'}, // using $ gives us the corresponding field
                        // pipeline of operations
                        'pipeline': [
                            {
                                '$match': { 
                                    '$expr': {
                                        '$eq': [
                                        '$requirements_id', '$$id' 
                                        ]
                                    }
                                }
                            }, 
                            {
                                '$sort': {'travel_id': 1}
                            }
                        ], 
                        'as': 'travel_requirements' // will add this all as a restrictions property of the country object
                    }
                },

                { 

                    '$unwind': '$travel_requirements' // $unwind used for getting data in object or for one record only
                    
                }, 
                

                {
                        '$lookup': {
                            'from': 'vaccination', 
                            'let': {'vaccine_id': '$travel_requirements.vaccine_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$vaccine_id', '$$vaccine_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'vaccine_id': -1}
                                }
                            ], 
                            'as': 'vaccine_requirements' // will add this all as a restrictions property of the country object
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'quarantine', 
                            'let': {'quarantine_id': '$travel_requirements.quarantine_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$quarantine_id', '$$quarantine_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'quarantine_id': -1}
                                }
                            ], 
                            'as': 'quarantine_requirements' // will add this all as a restrictions property of the country object
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'test', 
                            'let': {'test_id': '$travel_requirements.test_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$test_id', '$$test_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'test_id': -1}
                                }
                            ], 
                            'as': 'test_requirements' // will add this all as a restrictions property of the country object
                        }
                    },
                    { 

                        '$unwind': '$test_requirements' // $unwind used for getting data in object or for one record only
                        
                    }, 
                    {
                        '$lookup': {
                            'from': 'pcr', 
                            'let': {'pcr_id': '$test_requirements.pcr_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$pcr_id', '$$pcr_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'pcr_id': -1}
                                }
                            ], 
                            'as': 'pcr_requirements' // will add this all as a restrictions property of the country object
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'antigen', 
                            'let': {'antigen_id': '$test_requirements.antigen_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$antigen_id', '$$antigen_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'antigen_id': -1}
                                }
                            ], 
                            'as': 'antigen_requirements' // will add this all as a restrictions property of the country object
                        }
                    }

            ];
    
          return await travels.aggregate(pipeline).next();
          
        }
        catch (e) {
            console.error(`Something went wrong in getRequirementsByDepartureAndArrival: ${e}`);
            console.error(`e log: ${e.toString()}`);
            return null;
        }
    }

    static async updateTravel(travel, _id) {
        try {
            const updateResponse = await travels.updateOne(
                {_id: ObjectId(_id)}, // matching id to the objects country id
                // setting each parameter
                {$set: {departure_id: travel.departure_id, arrival_id: travel.arrival_id, requirements_id: travel.requirements_id}}
                
            );

            return updateResponse;
        } 
        catch (e) {
            console.error(`Unable to update travel: ${e}`);
            return { error: e };
        }
    }

    
};

export default TravelDAO;




