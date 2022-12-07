const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const mongoose = require("mongoose");

const Ong = require("../models/Ong.model");
const fileUploader = require("../configs/cloudinary.config");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

const saltRounds = 10;

router.get("/", async (req, res, next) => {
  try {
    const ongsFromDB = await Ong.find();
    res.status(200).json(ongsFromDB);
  } catch (error) {
    next(error);
  }
});
router.get("/:ongId", isAuthenticated, async (req, res, next) => {
  const {ongId} = req.params
  console.log(ongId)
  try {
    const ongFromDB = await Ong.findById(ongId, { passwordHash: 0, _id: 0});
    console.log(ongFromDB)
    res.status(200).json(ongFromDB);
  } catch (error) {
    next(error);
  }
});
//redeploy
router.post(
  "/signup",
  fileUploader.single("profileImgUrl"),
  async (req, res, next) => {
    const {
      name,
      username,
      email,
      identification,
      password,
      contact,
      acceptDonation,
    } = req.body;
    try {
      if (
        !name ||
        !username ||
        !email ||
        !password ||
        !contact ||
        !identification ||
        !acceptDonation
      ) {
        const error = new Error("Campos de preenchimento obrigatório!");
        error.status = 400;
        throw error;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);

      const ongInfo = {
        name,
        username,
        email,
        identification,
        contact,
        acceptDonation,
        passwordHash: hash,
      };

      if (req.file) ongInfo.profileImgUrl = req.file.path;

      const ongFromDB = await Ong.create(ongInfo);
      res.status(201).json(ongFromDB);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json(error.message);
        return;
      }
      if (error.code === 11000) {
        res.status(500).json("Nome de usuário ou email já existe");
        return;
      }
      next(error);
    }
  }
);

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json("Campos de email e senha obrigatórios!");
    }
    const ongFromDB = await Ong.findOne({ email });

    if (!ongFromDB) {
      return res.status(401).json("Usuário ou senha não encontrado!");
    }

    const verify = bcrypt.compareSync(password, ongFromDB.passwordHash);

    if (!verify) {
      return res.status(401).json("Usuário ou senha não encontrado!");
    }

    const payload = {
      _id: ongFromDB._id,
      name: ongFromDB.name,
      username: ongFromDB.username,
      email: ongFromDB.email,
      identification: ongFromDB.identification,
      contact: ongFromDB.contact,
      acceptDonation: ongFromDB.acceptDonation,
      type: ongFromDB.type,
      profileImgUrl: ongFromDB.profileImgUrl
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "3d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/edit",
  isAuthenticated,
  fileUploader.single("profileImgUrl"),
  async (req, res, next) => {
    const { _id } = req.payload;
    const {
      name,
      username,
      email,
      identification,
      contact,
      acceptDonation,
    } = req.body;
    try {
      const ongInfo = {
        name,
        username,
        email,
        identification,
        contact,
        acceptDonation,
      };

      if (req.file) ongInfo.profileImgUrl = req.file.path;

      const ongFromDB = await Ong.findByIdAndUpdate(_id, ongInfo, {
        new: true,
      });
      res.status(200).json(ongFromDB);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

module.exports = router;
