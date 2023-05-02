const mongoose = require('mongoose');

const PiloteSchema = new mongoose.Schema({
    // _id: { type: Number, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    motoId: { type: Number, required: true },
    number: { type: Number, required: true },
    weight: { type: Number, required: true},
    height: { type: Number, required: true},
    teamId: { type: String, required: true, ref: 'teams'},
});

// (Étape 3) Création d'une nouvelle propriété virtuelle "id" qui aura la valeur de la propriété "_id"
PiloteSchema.virtual("id").get(function () {
    return this._id;
});

// (Étape 3) Définition de l'object qui sera retourné lorsque la méthode toJSON est appelée
PiloteSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });

// Liaison avec la collection "teams"
PiloteSchema.virtual("team", {
    ref: "teams",
    localField: "teamId",
    foreignField: "_id",
    justOne: true,
});

module.exports = mongoose.model('pilotes', PiloteSchema);