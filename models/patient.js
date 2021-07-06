const mongoose = require("mongoose")
const Schema = mongoose.Schema

autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb+srv://ihebChaker05:poop2010@cluster.nfa5s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
autoIncrement.initialize(connection);

const PatientSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "patient"
    }
})


PatientSchema.plugin(autoIncrement.plugin, 'Patient');
PatientSchema.virtual('id').get(function () {
    return this._id;
});
// Ensure virtual fields are serialised.
PatientSchema.set('toJSON', {
    virtuals: true
});
const Patient = mongoose.model('Patient', PatientSchema)
module.exports = Patient