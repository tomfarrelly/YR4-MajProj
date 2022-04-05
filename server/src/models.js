const mongodb = require('mongodb');

// ===============
// Database Config
// ===============
const Schema = mongodb.Schema;
mongodb.connect('mongodb+srv://root:root@clustertom0.gladq.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});

// =======
// Schemas
// =======

const travelSchema = new Schema({
    departure_id: BigInt64Array,
    arrival_id: BigInt64Array,
    requirements_id: BigInt64Array,
  },
  { strict: false }
);

const models = {};
models.Travel = mongoose.model('travel', travelSchema);

module.exports = models;