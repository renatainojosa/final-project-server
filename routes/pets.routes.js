const router = require("express").Router();

const fileUploader = require("../configs/cloudinary.config");

const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const Ong = require("../models/Ong.model");

router.post(
  "/new-pet",
  fileUploader.single("profileImgUrl"),
  async (req, res, next) => {
    const {
      name,
      description,
      category,
      gender,
      breed,
      age,
      color,
      castrated,
      vaccinated,
    } = req.body;
    const { _id } = req.payload;

    try {
      const petInfo = {
        name,
        description,
        category,
        gender,
        breed,
        age,
        color,
        castrated,
        vaccinated,
        ownerId: _id,
      };

      if (req.file) petInfo.profileImgUrl = req.file.path;

      const petFromDB = await Pet.create(petInfo);
      await User.findByIdAndUpdate(
        _id,
        { $push: { pets: petFromDB._id } },
        { new: true }
      );
      await Ong.findByIdAndUpdate(
        _id,
        { $push: { pets: petFromDB._id } },
        { new: true }
      );
      res.status(200).json(petFromDB);
    } catch (error) {
      console.error("Error trying to create pet", error);
      next(error);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const petsFromDB = await Pet.find()
    res.status(200).json(petsFromDB);
  } catch (error) {
    next(error);
  }
});

router.get("/user-pets", async (req, res, next) => {
    const {_id} = req.payload;
  try {
    const petsFromDB = await Pet.find({ownerId: _id});
    res.status(200).json(petsFromDB);
  } catch (error) {
    next(error);
  }
});

router.get("/:petId", async (req, res, next) => {
  const { petId } = req.params;

  try {
    const petFromDB = await Pet.findById(petId);
    res.status(200).json(petFromDB);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:petId",
  fileUploader.single("profileImgUrl"),
  async (req, res, next) => {
    const { petId } = req.params;
    const {
      name,
      description,
      category,
      gender,
      breed,
      age,
      color,
      castrated,
      vaccinated,
    } = req.body;

    try {
      const petInfo = {
        name,
        description,
        category,
        gender,
        breed,
        age,
        color,
        castrated,
        vaccinated,
      };

      if (req.file) petInfo.profileImgUrl = req.file.path;

      const petFromDB = await Pet.findByIdAndUpdate(petId, petInfo, {
        new: true,
      });
      res
        .status(200)
        .json({ message: `Pet ${petId} atualizado: ${petFromDB.name}` });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:petId", async (req, res, next) => {
  const { petId } = req.params;
  const { _id } = req.payload;

  try {
    await Ong.findByIdAndUpdate(_id, { $pull: { pets: petId } }, { new: true });
    await User.findByIdAndUpdate(
      _id,
      { $pull: { pets: petId } },
      { new: true }
    );
    await Pet.findByIdAndRemove(petId);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
