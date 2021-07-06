var express = require("express");
var app = express();
var path = require('path')
var bodyParser = require('body-parser')
let uri = "mongodb+srv://ihebChaker05:poop2010@cluster.nfa5s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
var mongoose = require('mongoose')
const FCM = require('fcm-node')
const SERVER_KEY = "AAAAW372CkI:APA91bFiGlnBMPhcvgYnaTn49MWVKeam3ATmJdESQcitOTOiZ7yn221fRNcUSP3g3jSpW6KXJdcLn4SQR5B3HAlrz3e4AixhVKsHBuJ5LJu6Pb4TiwGDuYHAGVyhS5LzPN6yaSLrOi1C"
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const fcm = new FCM(SERVER_KEY);

mongoose.connect(uri, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(result => {
    console.log("connected to database")
}).catch(err => console.log(err.message))
var Medecin = require('./models/medecin')
var Patient = require("./models/patient")
var RendezVous = require("./models/rendez_vous")
var Traitement = require("./models/traitement")
var Conseil = require("./models/conseil")
app.use(bodyParser.json());


const Tokens = {}

app.post("/create", (req, res) => {
    let medecin = new Medecin({
        title: req.body.title,
        age: req.body.age
    })

    medecin.save()
        .then(result => {
            console.log(result);
            res.status(200).send({ success: true, message: "article created succesfully" })
        })
        .catch(err => console.log(err.message))
})


app.use(express.static(path.join(__dirname, 'images')))
app.get('/getMedecins', function (req, res, next) {
    // var query = "select * from medecins"
    // connection.query(query, function (error, results) {
    //     if (error) { next(error) } else {
    //         res.send((results));
    //     }
    // })
    Medecin.find({}, (err, values) => {

        res.status(200).send(values)
    })
});
app.get('/', (req, res) => {
    res.send("<h1>hello </h1>")
})
app.post('/createMedecin', (req, res) => {

    let medecin = new Medecin({
        nom: req.body.nom,
        prenom: req.body.prenom,
        password: req.body.password,
        tel: req.body.tel,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        specialite: req.body.specialite,
        image: req.body.image,

    })
    medecin.save().then(result => {
        return res.status(200).send({ success: true, message: "medecin created successfully", data: 0 })
    }).catch(err => {
        return res.status(500).send({ success: false, message: err.message, data: 0 })
    })
})
app.post('/createConseil', async (req, res) => {
    console.log(req.body)
    const conseil = new Conseil({
        id_medecin: req.body.id_medecin,
        id_patient: req.body.id_patient,
        contenu: req.body.contenu,
    })
    conseil.save().then(result => {

        return res.status(200).send({ success: true, message: "conseil created successfully" })
    }).catch(err => {
        return res.status(500).send({ success: false, message: err.message })
    })
})
app.post("/createRendezVous", (req, res) => {

    if (!req.body.date || !req.body.debut || !req.body.fin || !req.body.id_medecin) return res.status(500).send({ success: false, message: "some fields are missing", data: -1 })
    Medecin.findOne({ _id: req.body.id_medecin }).then(resMedecin => {
        let medecin = resMedecin
        let rendezVous = new RendezVous({
            date: req.body.date,
            debut: req.body.debut,
            fin: req.body.fin,
            nom_medecin: medecin.nom_medecin,
            prenom_medecin: medecin.prenom_medecin,
            id_medecin: medecin._id,
        })

        rendezVous.save().then(result => {
            return res.status(200).send({ success: true, message: "rendez vous created successfully", data: 0 })
        }).catch(err => {
            return res.status(500).send({ success: false, message: err.message, data: 0 })
        })
    }).catch((err) => {
        return res.status(500).send({ success: false, message: err.message, data: -1 })
    })




})



app.get("/getRendezVousMedecin/:id", (req, res) => {
    RendezVous.find({ id_medecin: req.params.id }).then(list => {
        if (list.length == 0) {
            return res.status(200).send([])

        } else {
            return res.status(200).send(list)
        }
    }).catch((err) => {
        return res.status(500).send({ success: false, message: err.message, data: -1 })

    }
    )
})

app.get("/getRendezVousPatient/:id", (req, res) => {
    RendezVous.find({ id_patient: req.params.id }).then(list => {
        return res.status(200).send(list)
    }).catch((err) => {
        return res.status(500).send({ success: false, message: err.message, data: -1 })

    }
    )
})
app.post("/prendreRendezVous", (req, res) => {
    RendezVous.findOne({ _id: req.body.id_rendez_vous }).then(
        rendezVous => {
            if (rendezVous.id_patient != -1) {
                return res.status(400).send("Rendez Vous deja reserve !!")
            } else {
                Patient.findOne({ _id: req.body.id_patient }).then(patient => {
                    if (patient) {
                        rendezVous.id_patient = req.body.id_patient
                        rendezVous.nom_patient = patient.nom
                        rendezVous.prenom_patient = patient.prenom
                        rendezVous.save().then(result => {
                            let message = {
                                to: Tokens[rendezVous.id_medecin],
                                notification: {
                                    title: "Rendez vous prise",
                                    body: "Le rendez vous de " + rendezVous.date + " " + rendezVous.debut + "a etait reservez par le patient " + patient.nom + " " + patient.prenom,
                                    sound: "default",
                                    click_action: "OPEN_RENDEZ_VOUS_ACTIVITY",
                                },
                            };

                            fcm.send(message, (err, response) => {
                                if (err) {

                                } else {

                                }
                            })
                            return res.status(200).send({ success: true, message: "rendez vous reserver avec success", data: 0 })
                        }).catch(err => {
                            return res.status(500).send({ success: false, message: err.message, data: 0 })
                        })
                    } else {
                        return res.status(400).send({ success: false })
                    }
                })


            }
        }
    )

})
app.post("/createPatient", (req, res) => {
    const patient = new Patient({
        tel: req.body.tel,
        password: req.body.password
    })
    patient.save().then(result => {
        return res.status(200).send({ success: true, message: "patient created successfully", data: 0 })
    }).catch(err => {
        return res.status(500).send({ success: false, message: err.message, data: 0 })
    })


})
app.post("/auth/patient", (req, res) => {

    Patient.findOne({ tel: req.body.tel, password: req.body.password }).then(patient => {
        if (patient) {
            return res.status(200).send({ success: true, message: "patient exists", data: patient._id })
        } else {
            return res.status(404).send({ success: false, message: "Patient doesn't exist", data: -1 })

        }
    }).catch((err) => {
        return res.status(500).send({ success: false, message: err.message, data: 0 })
    })


})
app.post("/auth", (req, res) => {
    Medecin.findOne({ tel: req.body.tel, password: req.body.password }).then(medecin => {
        if (medecin) {
            return res.status(200).send(medecin)
        }
        Patient.findOne({ tel: req.body.tel, password: req.body.password }).then(patient => {
            if (patient) {
                return res.status(200).send(patient)
            }
        })
    }).catch((err) => {
        return res.status(500).send({ success: false, message: err.message, data: 0 })
    })

})
app.post("/createTraitement", (req, res) => {

    Medecin.findOne({ _id: req.body.id_medecin }).then(medecin => {
        if (medecin) {
            let traitement = new Traitement({
                id_patient: req.body.id_patient,
                id_medecin: req.body.id_medecin,
                date_debut: req.body.date_debut,
                date_fin: req.body.date_fin,
                titre: req.body.titre,
                instructions: req.body.instructions,
                nom_medecin: medecin.nom,
                prenom_medecin: medecin.prenom,
                image_medecin: medecin.image
            })
            traitement.save().then(result => {
                return res.status(200).send({ success: true, message: "traitement created successfully", data: 0 })
            }).catch((err) => {
                return res.status(500).send({ success: false, message: err.message, data: 0 })
            })

        }

    }).catch(err => {
        return res.status(500).send({ success: false, message: err.message, data: 0 })
    })
})


app.get("/getListeTraitements/:id", (req, res) => {
    Traitement.find({ id_patient: req.params.id }).then(
        listTraitement => {
            if (listTraitement.length == 0) {
                res.status(200).send({ success: false, message: "aucun traitement est trouve", data: [] })
            } else {
                res.status(200).send(listTraitement)
            }
        }
    ).catch((err) => {
        return res.status(500).send({ success: false, message: err.message, data: [] })
    })

})
app.post("/terminerTraitement", (req, res) => {
    Traitement.findOne({ _id: req.body.id_traitement }).then(traitement => {
        traitement.terminer = true
        traitement.save().then(result => {
            return res.status(200).send({ success: true, message: "traitement terminer avec success", data: null })
        }).catch(
            (err) => {
                return res.status(500).send({ success: false, message: err.message, data: null })
            }
        )
    }).catch(
        (err) => {
            return res.status(500).send({ success: false, message: err.message, data: null })
        }
    )
})
app.post("/subscribe", (req, res) => {
    Tokens[req.body.id_medecin] = req.body.token
    console.log(req.body.id_medecin)
    console.log(req.body.token)
    res.status(200).send({ success: true, message: "User subscribed successfully" })
})



app.post("/fcm", async (req, res, next) => {
    try {


        let message = {
            to: Tokens[req.body.id_medecin],
            notification: {
                title: req.body.title,
                body: req.body.body,
                sound: "default",
                click_action: "OPEN_RENDEZ_VOUS_ACTIVITY",
            },
        };

        fcm.send(message, (err, response) => {
            if (err) {
                next(err);
            } else {
                res.json(response);
            }
        });
    } catch (error) {
        next(error);

    }
});
app.listen(process.env.PORT || 5000, () => {
    console.log('listening on port 5000')
})