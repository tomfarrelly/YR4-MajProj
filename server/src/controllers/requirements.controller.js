import RequirementsDAO from "../dao/requirements.dao.js";
import { User } from "./users.controller.js"; // importing user object
//import { useParams } from "react-router-dom";
// import { ObjectId } from 'bson';
// import Travel from '../../models/Travel.js'
// import Requirement from "../../models/Requirement.js";
// import Vaccination from "../../models/Vaccination.js";


export default class RequirementsController {
    
    static async apiGetRequirements(req, res, next) {
        const  REQUIREMENTS_PER_PAGE = 6
        const { requirementsList, totalNumRequirements } = await RequirementsDAO.getRequirements();
        let response = {
            requirements: requirementsList,
            page: 0,
            filters: {},
            entries_per_page: REQUIREMENTS_PER_PAGE,
            total_results: totalNumRequirements,
        }
        res.json(response);
    }

    static async apiGetRequirementsById(req, res, next) {
        try {
            let id = req.params.id || {};
            let requirements = await RequirementsDAO.getRequirementsById(id);
            if (!requirements) {
                res.status(404).json({ error: "Not found" });
                return;
            }
           // let updated_type = country.lastupdated instanceof Date ? "Date" : "other";
            res.json({ requirements });
        }
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiGetRequirementsByDepartureAndArrival(req, res, next) {
        try {
            const userJwt = req.get("Authorization").slice("Bearer ");                                                   // pulling token from request error
            const user = await User.decoded(userJwt);                                                                        // decoding token
            var { error } = user;
            if (error) {
                res.status(401).json({ error });
                return;
            }
           
            let departure_id = req.body.departure_id || {};
            let arrival_id = req.body.arrival_id || {};

            let requirements = await  RequirementsDAO.getRequirementsByDepartureAndArrival(departure_id, arrival_id);
            console.log(requirements)
            
            if (!requirements) { 
                res.status(404).json({ error: "Not found" });
                return;
            }
            res.json({ requirements });   
        }
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiUpdateRequirement(req, res, next) {

        try {

            const _id = req.params.id;
            const requirement = req.body;
            const requirementResponse = await RequirementsDAO.updateRequirement(requirement, _id);
            

            
            var { error } = requirementResponse;
            if (error) {
                res.status(400).json({ error });
            }
            
            if (requirementResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update requirement",
                );
            }

            const updatedRequirement = await RequirementsDAO.getRequirementsById(_id);
            
            res.json({ requirement: updatedRequirement });
        } 
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ e });
        }
    }

    


   
}
