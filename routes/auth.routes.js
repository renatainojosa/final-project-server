const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
// const fileUploader = require('../configs/cloudinary.config.js');
const { isAuthenticated } = require("../middlewares/jwt.middleware");

const saltRounds = 10;

//rotas de autenticação
router.get("/users", async (req, res, next) => {
  try {
    const usersFromDB = await User.find();
    res.status(200).json(usersFromDB);
  } catch (error) {
    next(error);
  }
});

//fileUploader.single('profileImgUrl') -> usar antes do async
router.post("/signup", async (req, res, next) => {
  const { username, email, password, contact, profileImgUrl } = req.body;
  try {
    if (!username || !email || !password || !contact) {
      const error = new Error("Campos de preenchimento obrigatório!");
      error.status = 400;
      throw error;
    }
    console.log('arquivo:', req.file)
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const userFromDB = await User.create({
      username,
      email,
      contact,
      passwordHash: hash,
      profileImgUrl,
      //req.file.path -> colocar no profileImgUrl
    });
    res.status(201).json(userFromDB);
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
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json("Campos de email e senha obrigatórios!");
    }
    const userFromDB = await User.findOne({ email });

    if (!userFromDB) {
      return res.status(401).json("Usuário ou senha não encontrado!");
    }

    const verify = bcrypt.compareSync(password, userFromDB.passwordHash);

    if (!verify) {
      return res.status(401).json("Usuário ou senha não encontrado!");
    }

    const payload = {
      _id: userFromDB._id,
      username: userFromDB.username,
      email: userFromDB.email,
      contact: userFromDB.contact,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "15d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

router.put("/:userId/edit", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  const { username, email, contact, password, profileImgUrl } = req.body;
  try {
    const userFromDB = await User.findByIdAndUpdate(
      userId,
      { username, email, contact, password, profileImgUrl },
      { new: true }
    );
    res.status(200).json(userFromDB);
  } catch (error) {
    next(error);
  }
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

module.exports = router;
