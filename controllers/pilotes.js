// Import pilotes model
const Pilote = require('../models/pilotes');

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const pilotesValidationRules = () => {
    return [   
        body("firstname")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("First name must be specified.")
            .isAlphanumeric()
            .withMessage("First name has non-alphanumeric characters."),

        body("lastname")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Last name must be specified.")
            .isAlphanumeric()
            .withMessage("Last name has non-alphanumeric characters."),

        body("motoId")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("MotoId must be specified.")
            .isNumeric()
            .withMessage("MotoId must be a number."),

        body("number")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Number must be specified.")
            .isNumeric()
            .withMessage("Number must be a number."),

        body("weight")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Weight must be specified.")
            .isNumeric()
            .withMessage("Weight must be a number."),

        body("height")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Height must be specified.")
            .isNumeric()
            .withMessage("Height must be a number."),

        body("teamId")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Team must be specified.")
            .isAlphanumeric()
            .withMessage("Team has non-alphanumeric characters.")
    ]
}

const paramIdValidationRule = () => {
    return [
        param("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
    ]
};

const bodyIdValidationRule = () => {
    return [
        body("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
    ]
};

// Méthode de vérification de la conformité de la requête  
const checkValidity = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(400).json({
        errors: extractedErrors,
    })
}

exports.create = [pilotesValidationRules(), checkValidity, (req, res, next) => {
    const pilote = new Pilote({
        // _id: req.body.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        motoId: req.body.motoId,
        number: req.body.number,
        weight: req.body.weight,
        height: req.body.height,
        teamId: req.body.teamId,
    });

    pilote.save()
        .then(data => {
            return res.status(201).json(data);
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Pilote."
            });
        });
}];

exports.findAll = (req, res, next) => {
    Pilote.find()
        .then(pilotes => {
            return res.status(200).json(pilotes);
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving pilotes."
            });
        });
}

exports.findOne = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Pilote.findById(req.params.id)
        .then(pilote => {
            if (!pilote) {
                return res.status(404).send({
                    message: "Pilote not found with id " + req.params.id
                });
            }
            return res.status(200).json(pilote);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Pilote not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving pilote with id " + req.params.id
            });
        });
}];

exports.update = [paramIdValidationRule(), bodyIdValidationRule(), pilotesValidationRules(), checkValidity, (req, res, next) => {
    Pilote.findByIdAndUpdate(req.params.id, {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        motoId: req.body.motoId,
        number: req.body.number,
        weight: req.body.weight,
        height: req.body.height,
        teamId: req.body.teamId,
    }, { new: true })
        .then(pilote => {
            if (!pilote) {
                return res.status(404).send({
                    message: "Pilote not found with id " + req.params.id
                });
            }
            return res.status(200).json(pilote);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Pilote not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating pilote with id " + req.params.id
            });
        });
}];

exports.delete = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Pilote.findByIdAndRemove(req.params.id)
        .then(pilote => {
            if (!pilote) {
                return res.status(404).send({
                    message: "Pilote not found with id " + req.params.id
                });
            }
            return res.status(200).json({ message: "Pilote deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Pilote not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete pilote with id " + req.params.id
            });
        });
}];

exports.deleteAll = (req, res, next) => {
    Pilote.deleteMany({})
        .then(pilotes => {
            return res.status(200).json({ message: `${pilotes.deletedCount} pilotes were deleted successfully!` });
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Some error occurred while removing all pilotes."
            });
        });
}

