import RestrictionsDAO from "../dao/restrictions.dao.js"
//import { User } from "./users.controller.js"; // importing user object

export default class RestrictionsController {
    
    static async apiGetRestrictions(req, res, next) {
        const  RESTRICTIONS_PER_PAGE = 6
        const { restrictionsList, totalNumRestrictions } = await RestrictionsDAO.getRestrictions();
        let response = {
            restrictions: restrictionsList,
            page: 0,
            filters: {},
            entries_per_page: RESTRICTIONS_PER_PAGE,
            total_results: totalNumRestrictions,
        }
        res.json(response);
    }

    static async apiGetRestrictionsByCountryId(req, res, next) {
        try {
            let id = req.params.id || {};
            let country = await RestrictionsDAO.getRestrictionsByCountryID(id);
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

    static async apiUpdateRestriction(req, res, next) {
        // USer Authorization
        try {
            // gets authorization bearer token
           
           
           // passing country id to DAO 
            const _id = req.params.id;
            const restriction = req.body;
            const restrictionResponse = await RestrictionsDAO.updateRestriction(restriction, _id);
            

            
            var { error } = restrictionResponse;
            if (error) {
                res.status(400).json({ error });
            }
            
            if (restrictionResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update restriction",
                );
            }

            const updatedRestriction = await RestrictionsDAO.getRestrictionById(_id);
            
            res.json({ restriction: updatedRestriction });
        } 
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ e });
        }
    }

    


   
}
