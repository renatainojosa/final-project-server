const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const mongoose = require("mongoose");

const Ong = require("../models/Ong.model");
const fileUploader = require("../configs/cloudinary.config");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

const saltRounds = 10;

//rotas de autenticação
router.get("/", async (req, res, next) => {
  try {
    const ongsFromDB = await Ong.find();
    res.status(200).json(ongsFromDB);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/signup",
  fileUploader.single("profileImgUrl"),
  async (req, res, next) => {
    const {
      username,
      email,
      identification,
      password,
      contact,
      acceptDonation,
    } = req.body;
    try {
      if (
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
      username: ongFromDB.username,
      email: ongFromDB.email,
      identification: ongFromDB.identification,
      contact: ongFromDB.contact,
      acceptDonation: ongFromDB.acceptDonation,
      type: ongFromDB.type
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
  "/:ongId/edit",
  isAuthenticated,
  fileUploader.single("profileImgUrl"),
  async (req, res, next) => {
    const { ongId } = req.params;
    const {
      username,
      email,
      identification,
      contact,
      password,
      acceptDonation,
    } = req.body;
    try {
      const ongInfo = {
        username,
        email,
        identification,
        contact,
        password,
        acceptDonation,
      };

      if (req.file) ongInfo.profileImgUrl = req.file.path;

      const ongFromDB = await Ong.findByIdAndUpdate(ongId, ongInfo, {
        new: true,
      });
      res.status(200).json(ongFromDB);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/verify", isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.payload;
    const ongFromDB = await Ong.findById(_id);
    if (!ongFromDB) throw new Error('token não é de ong')
    res.status(200).json(req.payload);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
