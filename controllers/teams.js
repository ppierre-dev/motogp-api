// Import pilotes model
const Team = require('../models/teams');

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const teamsValidationRules = () => {
    return [   
        body("name")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Name must be specified."),
        body("sponsor")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Sponsor must be specified.")
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

exports.create = [teamsValidationRules(), checkValidity, (req, res, next) => {
    const team = new Team({
        name: req.body.name,
        sponsor: req.body.sponsor,
    });

    team.save()
        .then(data => {
            return res.status(201).json(data);
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Team."
            });
        });
}];

exports.findAll = (req, res, next) => {
    Team.find()
        .then(teams => {
            return res.status(200).json(teams);
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Some error occurred while retrieving teams."
            });
        });
}

exports.findOne = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Team.findById(req.params.id)
        .then(team => {
            if (!team) {
                return res.status(404).send({
                    message: "Team not found with id " + req.params.id
                });
            }
            return res.status(200).json(team);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Team not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving team with id " + req.params.id
            });
        });
}];

exports.update = [paramIdValidationRule(), teamsValidationRules(), checkValidity, (req, res, next) => {
    Team.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        sponsor: req.body.sponsor,
    }, { new: true })
        .then(team => {
            if (!team) {
                return res.status(404).send({
                    message: "Team not found with id " + req.params.id
                });
            }
            return res.status(200).json(team);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Team not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating team with id " + req.params.id
            });
        });
}];

exports.delete = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Team.findByIdAndRemove(req.params.id)
        .then(team => {
            if (!team) {
                return res.status(404).send({
                    message: "Team not found with id " + req.params.id
                });
            }
            return res.status(200).json({ message: "Team deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Team not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete team with id " + req.params.id
            });
        });
}];

exports.deleteAll = (req, res, next) => {
    Team.deleteMany({})
        .then(data => {
            return res.status(200).json({ message: `${data.deletedCount} Teams were deleted successfully!` });
        }).catch(err => {
            return res.status(500).send({
                message: err.message || "Some error occurred while removing all teams."
            });
        });
};

exports.findPilots = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Team.findById(req.params.id)
        .populate('pilotes')
        .then(team => {
            if (!team) {
                return res.status(404).send({
                    message: "Team not found with id " + req.params.id
                });
            }
            return res.status(200).json(team.pilotes);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Team not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving team with id " + req.params.id
            });
        });
}];

