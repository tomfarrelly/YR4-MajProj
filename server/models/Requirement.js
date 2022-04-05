//const mongoose = require('mongoose');
import mongoose from 'mongoose'


const reqSchema=new mongoose.Schema({
    // vaccine_id:Number,
    // test_id:Number,
    // quarantine_id:Number,
    // document_id:Number,
    // status:String,
    // requirements_id:Number
});
let Requirement =mongoose.model('Requirement',reqSchema)

export default Requirement;