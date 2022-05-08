import { ObjectId } from 'bson';

// variables created when file is loaded
let requirements;
let travels;
//let restrictions;
let restdb;
const DEFAULT_SORT = [["travel_id", -1]]

class RequirementsDAO {
    // inject method gives reference to connection & stores it in restaurants
    static async injectDB(conn) {
        if (travels) { // checks if travels has a value
            return // if it does, return 
        }
        try {
            // connecting to restaurants db
            restdb = await conn.db(process.env.DB_NAME);
            // reference to restaurants collection inside the db
            travels = await restdb.collection("travel");
           
            requirements = await restdb.collection("requirements");
        } 
        catch (e) {
            console.error(`Unable to establish a collection handle in RequirementsDAO: ${e}`);
        }
    }

    // defining getRestaurants and taking parameters setting their deafult values
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

    static async getRequirementsById(id) {
        try {
            // creating an array pipeline
            const pipeline = [
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

                    '$unwind': '$departure_country' // $unwind used for getting data in object or for one record only
                    
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

                    '$unwind': '$arrival_country' // $unwind used for getting data in object or for one record only
                    
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
                            'let': {'vaccine_id': '$vaccine_id'}, // using $ gives us the corresponding field
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
                            'let': {'quarantine_id': '$quarantine_id'}, // using $ gives us the corresponding field
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
                            'let': {'test_id': '$test_id'}, // using $ gives us the corresponding field
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

                        '$unwind': '$pcr_requirements' // $unwind used for getting data in object or for one record only
                        
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
                    },
                    { 

                        '$unwind': '$antigen_requirements' // $unwind used for getting data in object or for one record only
                        
                    } 

            ];
    
          return await requirements.aggregate(pipeline).next();
          
        }
        catch (e) {
            console.error(`Something went wrong in getRequirementsByID: ${e}`);
            console.error(`e log: ${e.toString()}`);
            return null;
        }
    }
    
    

    static async getRequirementsByDepartureAndArrival(departure_id, arrival_id) {
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

                    '$unwind': '$departure_country' // $unwind used for getting data in object or for one record only
                    
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

                    '$unwind': '$arrival_country' // $unwind used for getting data in object or for one record only
                    
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

    static async updateRequirement(requirement, _id) {
        try {
            const updateResponse = await requirements.updateOne(
                {_id: ObjectId(_id)}, // matching id to the objects country id
                // setting each parameter
                {$set: {requirements_id: requirement.requirements_id, vaccine_id: requirement.vaccine_id, test_id: requirement.test_id, quarantine_id : requirement.quarantine_id, document_id: requirement.document_id, status: requirement.status}}
                
            );

            return updateResponse;
        } 
        catch (e) {
            console.error(`Unable to update requirement: ${e}`);
            return { error: e };
        }
    }


    
};

export default RequirementsDAO;




