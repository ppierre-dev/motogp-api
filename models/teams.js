const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    // _id: { type: Number, unique: true, min: 1 },
    name: { type: String, required: true },
    sponsor: { type: String, required: true },
});

// (Étape 3) Création d'une nouvelle propriété virtuelle "id" qui aura la valeur de la propriété "_id"
TeamSchema.virtual("id").get(function () {
    return this._id;
});

// (Étape 3) Définition de l'object qui sera retourné lorsque la méthode toJSON est appelée
TeamSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

// Liaison avec la collection "pilotes"
TeamSchema.virtual("pilotes", {
    ref: "pilotes",
    localField: "_id",
    foreignField: "teamId",
    justOne: false,
});



module.exports = mongoose.model('teams', TeamSchema);
