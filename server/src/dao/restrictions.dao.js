import { ObjectId } from 'bson';

// variables created when file is loaded
let countries;
let restrictions;
let restdb;
const DEFAULT_SORT = [["Country_id", -1]]

class RestrictionsDAO {
    // inject method gives reference to connection & stores it in restaurants
    static async injectDB(conn) {
        if (countries) { // checks if restaurants has a value
            return // if it does, return 
        }
        try {
            // connecting to restaurants db
            restdb = await conn.db(process.env.DB_NAME);
            // reference to restaurants collection inside the db
            countries = await restdb.collection("countries");
            restrictions = await restdb.collection("restrictions");
        } 
        catch (e) {
            console.error(`Unable to establish a collection handle in countriesDAO: ${e}`);
        }
    }

    // defining getCountries and taking parameters setting their deafult values
    static async getRestrictions(query = {}, project = {}, sort = DEFAULT_SORT,  page = 0, restrictionsPerPage = 10) {
        let cursor;
        try {
            cursor = await restrictions.find(query).project(project).sort(sort);
        } 
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { restrictionsList: [], totalNumRestrictions: 0 }
        }
        // cursor fetches documents in batches 
        const displayCursor = cursor.skip(restrictionsPerPage*page).limit(restrictionsPerPage);
    
        try {
            // converting cursor object into array 
            const restrictionsList = await displayCursor.toArray();
            const totalNumRestrictions = (page === 0) ? await restrictions.countDocuments(query) : 0;
        
            return { restrictionsList, totalNumRestrictions }
        } 
        catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { restrictionsList: [], totalNumRestrictions: 0 }
        }
    }

    static async getRestrictionById(id) {
        try {
            // creating an array pipeline
            const pipeline = [
                {
                    // matching objectId to corresponding id
                    '$match': {'_id': new ObjectId(id)}
                }

            ];
    
          return await restrictions.aggregate(pipeline).next();
          
        }
        catch (e) {
            console.error(`Something went wrong in getRestrictionById: ${e}`);
            console.error(`e log: ${e.toString()}`);
            return null;
        }
    } 

    static async getRestrictionsByCountryID(id) {
        try {
            // creating an array pipeline
            const pipeline = [
                {
                    // matching objectId to corresponding id
                    '$match': {'_id': new ObjectId(id)}
                }, 
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
                                        '$restriction_id', '$$id' // $$ 
                                        ]
                                    }
                                }
                            }, 
                            {
                                '$sort': {'country_id': 1}
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

    static async updateRestriction(restriction, _id) {
        try {
            const updateResponse = await restrictions.updateOne(
                {_id: ObjectId(_id)}, // matching id to the objects country id
                // setting each parameter
                {$set: {restriction_id: restriction.restriction_id, bars_id: restriction.bars_id, nightclub_id: restriction.nightclub_id, pt_id : restriction.pt_id, restaurant_id: restriction.restaurant_id, shop_id: restriction.shop_id}}
                
            );

            return updateResponse;
        } 
        catch (e) {
            console.error(`Unable to update restriction: ${e}`);
            return { error: e };
        }
    }

    
};

export default RestrictionsDAO;




