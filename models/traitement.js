const mongoose = require("mongoose")
const Schema = mongoose.Schema

autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb+srv://ihebChaker05:poop2010@cluster.nfa5s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
autoIncrement.initialize(connection);

const TraitementSchema = new Schema({
    id_patient: {
        type: Number,
        required: true
    },
    id_medecin: {
        type: Number,
        required: true
    },
    titre: {
        type: String,
        required: true
    },
    instructions: {
        type: String
    },
    date_debut: {
        type: String
    },
    nom_medecin: {
        type: String
    },
    prenom_medecin: {
        type: String
    },
    image_medecin: {
        type: String
    },
    date_fin: {
        type: String,
        required: true
    },
    terminer: {
        type: Boolean,
        default: false
    }
})
TraitementSchema.plugin(autoIncrement.plugin, 'Traitement');


const Traitement = mongoose.model("Traitement", TraitementSchema)
module.exports = Traitement