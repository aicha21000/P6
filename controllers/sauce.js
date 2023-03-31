const Sauce = require("../models/Sauce");
const fs = require("fs");
const mime = require("mime-types");

exports.createSauce = (req, res, next) => {
    if (req.file) {
        const sauceObject = JSON.parse(req.body.sauce);
        delete sauceObject._id;
        delete sauceObject._userId;

        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
            }`,
            likes: 0,
            dislikes: 0,
        });

        sauce
            .save()
            .then(() => {
                res.status(201).json({ message: "Objet enregistré !" });
            })
            .catch((error) => {
                res.status(400).json({ error });
            });
    } else {
        return res.status(400).json({ error: "Fichier image absent" });
    }
};

exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                return res.status(403).json({ message: "Forbidden" });
            }
            let sauceObject;
            if (req.file) {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {});

                sauceObject = {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get("host")}/images/${
                        req.file.filename
                    }`,
                };
            } else {
                sauceObject = {
                    ...req.body,
                };
            }
            Sauce.updateOne(
                { _id: req.params.id },
                { ...sauceObject, _id: req.params.id }
            )
                .then(() => res.status(200).json({ message: "Objet modifié!" }))
                .catch((error) => res.status(400).json({ error }));

        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Forbidden" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: "Objet supprimé !",
                            });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(201).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce.usersLiked.includes(req.body.userId)) {
                if (req.body.like === 1) {
                    sauce.usersLiked.push(req.body.userId);
                    sauce.likes++;
                }
            }

            if (sauce.usersLiked.includes(req.body.userId)) {
                if (req.body.like === 0) {
                    sauce.usersLiked.pop(req.body.userId);
                    sauce.likes--;
                }
            }
            if (!sauce.usersDisliked.includes(req.body.userId)) {
                if (req.body.like === -1) {
                    sauce.usersDisliked.push(req.body.userId);
                    sauce.dislikes++;
                }
            }
            if (sauce.usersDisliked.includes(req.body.userId))
                if (req.body.like === 0) {
                    sauce.usersDisliked.pop(req.body.userId);
                    sauce.dislikes--;
                }

            sauce
                .save()
                .then(() => res.status(200).json({ sauce }))
                .catch((error) => res.status(401).json({ error }));
        })

        .catch((error) => {
            res.status(400).json({ error });
        });
};
