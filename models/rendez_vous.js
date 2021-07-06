const mongoose = require("mongoose")
const Schema = mongoose.Schema


autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb+srv://ihebChaker05:poop2010@cluster.nfa5s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
autoIncrement.initialize(connection);
const RendezVousSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    nom_medecin: {
        type: String,
        required: true
    },
    prenom_medecin: {
        type: String,
        required: true
    },
    debut: {
        type: String,
        required: true
    },

    id_medecin: {
        type: Number,
        required: true
    },

    fin: {
        type: String,
        required: true,
    },
    id_patient: {
        type: Number,
        default: -1,
    },
    terminer: {
        type: Boolean,
        default: false
    },
    nom_patient: {
        type: String,
        default: "a"
    },
    prenom_patient: {
        type: String,
        default: "a"
    }
})
RendezVousSchema.plugin(autoIncrement.plugin, 'RendezVous');
RendezVousSchema.virtual('id').get(function () {
    return this._id;
});
// Ensure virtual fields are serialised.
RendezVousSchema.set('toJSON', {
    virtuals: true
});
const RendezVous = mongoose.model('RendezVous', RendezVousSchema)
module.exports = RendezVous


