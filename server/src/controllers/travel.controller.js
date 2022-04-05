import TravelDAO from "../dao/travel.dao.js"

export default class TravelController {
    
    static async apiGetTravel(req, res, next) {
        const  TRAVEL_PER_PAGE = 6
        const { travelList, totalNumTravel } = await TravelDAO.getTravel();
        let response = {
            travel: travelList,
            page: 0,
            filters: {},
            entries_per_page: TRAVEL_PER_PAGE,
            total_results: totalNumTravel,
        }
        res.json(response);
    }

    static async apiGetTravelById(req, res, next) {
        try {
            let id = req.params.id || {};
            let travel = await TravelDAO.getTravelById(id);
            if (!travel) {
                res.status(404).json({ error: "Not found" });
                return;
            }
           // let updated_type = country.lastupdated instanceof Date ? "Date" : "other";
            res.json({ travel });
        }
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiGetTravelRequirementsByDepartureAndArrival(req, res, next) {
        try {

            console.log(req.body);
            
            let departure_id = req.body.departure_id || {};
            let arrival_id = req.body.arrival_id || {};


            let travels = await  TravelDAO.getTravelRequirementsByDepartureAndArrival(departure_id, arrival_id);
            console.log(travels)
            

            if (!travels) { 
                res.status(404).json({ error: "Not found" });
                return;
            }
           // let updated_type = country.lastupdated instanceof Date ? "Date" : "other";
            res.json({ travels });
           
        }

        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiUpdateTravel(req, res, next) {
        // USer Authorization
        try {
            // gets authorization bearer token
           
           
           // passing country id to DAO 
            const _id = req.params.id;
            const travel = req.body;
            const travelResponse = await TravelDAO.updateTravel(travel, _id);
            

            
            var { error } = travelResponse;
            if (error) {
                res.status(400).json({ error });
            }
            
            if (travelResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update travel",
                );
            }

            const updatedTravel = await TravelDAO.getTravelById(_id);
            
            res.json({ travel: updatedTravel });
        } 
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ e });
        }
    }

    


   
}
