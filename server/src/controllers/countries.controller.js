import CountriesDAO from "../dao/countries.dao.js"
//import { User } from "./users.controller.js"; // importing user object

export default class CountriesController {
    
    static async apiGetCountries(req, res, next) {
        // const  COUNTRIES_PER_PAGE = 6
        const { countriesList, totalNumCountries } = await CountriesDAO.getCountries();
        let response = {
            countries: countriesList,
            // page: 0,
            // filters: {},
            // entries_per_page: COUNTRIES_PER_PAGE,
             total_results: totalNumCountries,
        }
        res.json(response);
    }

    static async apiGetCountriesById(req, res, next) {
        try {
            let id = req.params.id || {};
            let country = await CountriesDAO.getCountriesById(id);
            if (!country) {
                res.status(404).json({ error: "Not found" });
                return;
            }
           // let updated_type = country.lastupdated instanceof Date ? "Date" : "other";
            res.json({ country });
        }
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiUpdateCountry(req, res, next) {
        // USer Authorization
        try {
            // gets authorization bearer token
           
           
           // passing country id to DAO 
            const _id = req.params.id;
            const country = req.body;
            const countryResponse = await CountriesDAO.updateCountry(country, _id);
            

            
            var { error } = countryResponse;
            if (error) {
                res.status(400).json({ error });
            }
            
            if (countryResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update",
                );
            }

            const updatedCountry = await CountriesDAO.getCountriesById(_id);
            
            res.json({ country: updatedCountry });
        } 
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ e });
        }
    }

    


   
}
