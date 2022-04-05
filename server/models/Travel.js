//const mongoose = require('mongoose');
import mongoose from 'mongoose'


const travelSchema=new mongoose.Schema({
    arrival_id:Number,
    departure_id:Number,
    requirements_id:Number
});
let Travel =mongoose.model('Travel',travelSchema)

export default Travel;