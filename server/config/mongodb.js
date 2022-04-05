//const mongoose = require('mongoose');
import mongoose from 'mongoose'
const connectDB = async()=>{
    const connectionObj = await mongoose.connect('mongodb+srv://root:root@clustertom0.gladq.mongodb.net/covoid_db?retryWrites=true&w=majority',{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    console.log('mongodb covoid_db connected')
};
export default connectDB;