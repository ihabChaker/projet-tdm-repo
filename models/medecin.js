const mongoose = require('mongoose')
const Schema = mongoose.Schema
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb+srv://ihebChaker05:poop2010@cluster.nfa5s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
autoIncrement.initialize(connection);

const MedecinSchema = new Schema({
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

    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    specialite: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "patient"
    }
}, { timestamps: true })

MedecinSchema.plugin(autoIncrement.plugin, 'Medecin');
MedecinSchema.virtual('id').get(function () {
    return this._id;
});

// Ensure virtual fields are serialised.
MedecinSchema.set('toJSON', {
    virtuals: true
});
const Medecin = mongoose.model('Medecin', MedecinSchema)
module.exports = Medecin