import { ObjectId } from 'bson';

// variables created when file is loaded
let countries;
let restrictions;
let restdb;
const DEFAULT_SORT = [["_id", -1]]

class CountriesDAO {
    // inject method gives reference to connection & stores it in restaurants
    static async injectDB(conn) {
        if (countries) { // checks if countries has a value
            return // if it does, return 
        }
        try {
            // connecting to restaurants db
            restdb = await conn.db(process.env.DB_NAME);
            // reference to restaurants collection inside the db
            countries = await restdb.collection("countries");
            //restrictions = await restdb.collection("restrictions");
        } 
        catch (e) {
            console.error(`Unable to establish a collection handle in countriesDAO: ${e}`);
        }
    }

    // defining getCountries and taking parameters setting their deafult values
    static async getCountries(query = {}, project = {}, sort = DEFAULT_SORT,  page = 0, countriesPerPage = 50) {
        let cursor;
        try {
            cursor = await countries.find(query).project(project).sort(sort);
        } 
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { countriesList: [], totalNumCountries: 0 }
        }
        // cursor fetches documents in batches 
        const displayCursor = cursor.skip(countriesPerPage*page).limit(countriesPerPage);
    
        try {
            // converting cursor object into array 
            const countriesList = await displayCursor.toArray();
            const totalNumCountries = (page === 0) ? await countries.countDocuments(query) : 0;
        
            return { countriesList, totalNumCountries }
        } 
        catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { countriesList: [], totalNumCountries: 0 }
        }
    }

    static async getCountryById(id) {
        try {
            // creating an array pipeline
            const pipeline = [
                {
                    // matching objectId to corresponding id
                    '$match': {'_id': new ObjectId(id)}
                }

            ];
    
          return await countries.aggregate(pipeline).next();
          
        }
        catch (e) {
            console.error(`Something went wrong in getCountryById: ${e}`);
            console.error(`e log: ${e.toString()}`);
            return null;
        }
    }  

    

    static async getCountriesById(id) {
        try {
            // creating an array pipeline
            const pipeline = [
                {
                    // matching objectId to corresponding id
                    '$match': {'_id': new ObjectId(id)}
                }, 
                // {
                //     '$lookup': {
                //         'from': 'countries', 
                //         'let': {'id': '$_id'}, // using $ gives us the corresponding field
                //         // pipeline of operations
                //         'pipeline': [
                //             {
                //                 '$match': { 
                //                     '$expr': {
                //                         '$eq': [
                //                         '$country_id', '$$id' // $$ 
                //                         ]
                //                     }
                //                 }
                //             }, 
                //             {
                //                 '$sort': {'country_id': 1}
                //             }
                //         ], 
                //         'as': 'Countries' 
                //     }
                //  },

                 {
                    '$lookup': {
                        'from': 'restrictions', 
                        'let': {'id': '$restriction_id'}, // using $ gives us the corresponding field
                        // pipeline of operations
                        'pipeline': [
                            {
                                '$match': { 
                                    '$expr': {
                                        '$eq': [
                                        '$restriction_id', '$$id' 
                                        ]
                                    }
                                }
                            }, 
                            {
                                '$sort': {'restriction_id': 1}
                            }
                        ], 
                        'as': 'local_restrictions' // will add this all as a restrictions property of the country object
                    }
                },

                { 

                    '$unwind': '$local_restrictions' // $unwind used for getting data in object or for one record only
                    
                }, 

                

                {
                        '$lookup': {
                            'from': 'public_transport', 
                            'let': {'pt_id': '$local_restrictions.pt_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$pt_id', '$$pt_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'pt_id': -1}
                                }
                            ], 
                            'as': 'pt_restrictions' // will add this all as a restrictions property of the country object
                        }
                    },
                    { 

                        '$unwind': '$pt_restrictions' // $unwind used for getting data in object or for one record only
                        
                    }, 
                    {
                        '$lookup': {
                            'from': 'bars', 
                            'let': {'bars_id': '$local_restrictions.bars_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$bars_id', '$$bars_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'bars_id': -1}
                                }
                            ], 
                            'as': 'bars_restrictions' // will add this all as a restrictions property of the country object
                        }
                    },
                    { 

                        '$unwind': '$bars_restrictions' // $unwind used for getting data in object or for one record only
                        
                    }, 
                    
                    {
                        '$lookup': {
                            'from': 'shops', 
                            'let': {'shop_id': '$local_restrictions.shop_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$shop_id', '$$shop_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'shop_id': -1}
                                }
                            ], 
                            'as': 'shop_restrictions' // will add this all as a restrictions property of the country object
                        }
                    },
                    { 

                        '$unwind': '$shop_restrictions' // $unwind used for getting data in object or for one record only
                        
                    }, 
                    {
                        '$lookup': {
                            'from': 'restaurants', 
                            'let': {'restaurant_id': '$local_restrictions.restaurant_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$restaurant_id', '$$restaurant_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'restaurant_id': -1}
                                }
                            ], 
                            'as': 'restaurant_restrictions' // will add this all as a restrictions property of the country object
                        }
                    },
                    { 

                        '$unwind': '$restaurant_restrictions' // $unwind used for getting data in object or for one record only
                        
                    }, 
                    {
                        '$lookup': {
                            'from': 'nightclubs', 
                            'let': {'nightclub_id': '$local_restrictions.nightclub_id'}, // using $ gives us the corresponding field
                            // pipeline of operations
                            'pipeline': [
                                {
                                    '$match': { 
                                        '$and' : [{
                                        '$expr': {
                                            '$eq': [
                                            '$nightclub_id', '$$nightclub_id' // $$ 
                                            ]
                                        }
                                    }]
                                    }
                                }, 
                                {
                                    '$sort': {'nightclub_id': -1}
                                }
                            ], 
                            'as': 'nightclub_restrictions' // will add this all as a restrictions property of the country object
                        }
                    },
                    { 

                        '$unwind': '$nightclub_restrictions' // $unwind used for getting data in object or for one record only
                        
                    } 

            ];
    
          return await countries.aggregate(pipeline).next();
          
        }
        catch (e) {
            console.error(`Something went wrong in getCountriesByID: ${e}`);
            console.error(`e log: ${e.toString()}`);
            return null;
        }
    }  


    

    

    static async updateCountry(country, _id) {
        try {
            const updateResponse = await countries.updateOne(
                {_id: ObjectId(_id)}, // matching id to the objects country id
                // setting each parameter
                {$set: {country_id: country.country_id, name: country.name, restriction_id: country.restriction_id, region_id : country.region_id}}
                
            );

            return updateResponse;
        } 
        catch (e) {
            console.error(`Unable to update country: ${e}`);
            return { error: e };
        }
    }

    
};

export default CountriesDAO;




