import RequirementsDAO from "../dao/requirements.dao.js"
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
            //let id = req.params.requirement.id || {};
            let departure_id = req.body.departure_id || {};
            let arrival_id = req.body.arrival_id || {};

            // console.log(req.body.arrival_id)
            // let travel= await Travel.findOne(
            //     {
            //         arrival_id:req.body.arrival_id,
            //         departure_id:req.body.departure_id
            //     }
            // );
            // console.log(req.body.departure_id)
            // travel = await Travel.find({
            //     arrival_id:req.body.arrival_id,
            //     departure_id:req.body.departure_id
            // });
            
            // console.log(travel)
            
            
            
            //let req_id = ObjectId(req.params.requirements_id);
            let requirements = await  RequirementsDAO.getRequirementsByDepartureAndArrival(departure_id, arrival_id);
            console.log(requirements)
            //let requirements = await RequirementsDAO.getRequirementsById(travel.requirements_id);
            
            
            
            
            // let requirements = await Requirement.find(
            //     {requirements_id:travel[0].requirements_id}    
            //     )

            // console.log(requirements)
        
            
            // let vaccination = await Vaccination.find({vaccine_id:requirements.vaccine_id})
            // console.log(vaccination)

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

    static async apiUpdateRequirement(req, res, next) {
        // USer Authorization
        try {
            // gets authorization bearer token
           
           
           // passing country id to DAO 
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
