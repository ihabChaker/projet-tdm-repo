const mongoose = require("mongoose")
const Schema = mongoose.Schema

autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb+srv://ihebChaker05:poop2010@cluster.nfa5s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
autoIncrement.initialize(connection);

const ConseilSchema = new Schema({
    id_medecin: {
        type: Number,
        required: true
    },
    id_patient: {
        type: Number,
        required: true
    },
    contenu: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

ConseilSchema.plugin(autoIncrement.plugin, 'Conseil');


const Conseil = mongoose.model("Conseil", ConseilSchema)
module.exports = Conseil