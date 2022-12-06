const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
const fileUploader = require("../configs/cloudinary.config.js");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

const saltRounds = 10;

router.get("/users", async (req, res, next) => {
  try {
    const usersFromDB = await User.find();
    res.status(200).json(usersFromDB);
  } catch (error) {
    next(error);
  }
});

router.get("/:idUser", async (req, res, next) => {
  const {idUser} = req.params
  console.log(idUser)
});
// router.get("/:userId", isAuthenticated, async (req, res, next) => {
//   const {userId} = req.params
//   try {
//     const userFromDB = await User.findById(userId, { passwordHash: 0, _id: 0});
//     res.status(200).json(userFromDB);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/user", isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.payload;
    const userFromDB = await User.findById(_id, { passwordHash: 0, _id: 0 });
    res.status(200).json(userFromDB);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/signup",
  fileUploader.single("profileImgUrl"),
  async (req, res, next) => {
    const { name, username, email, password, contact } = req.body;
    try {
      if (!name || !username || !email || !password || !contact) {
        const error = new Error("Campos de preenchimento obrigatório!");
        error.status = 400;
        throw error;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);

      const userInfo = { name, username, email, contact, passwordHash: hash };

      if (req.file) userInfo.profileImgUrl = req.file.path;

      const userFromDB = await User.create(userInfo);
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
  }
);

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
      name: userFromDB.name,
      username: userFromDB.username,
      email: userFromDB.email,
      contact: userFromDB.contact,
      type: userFromDB.type,
      profileImgUrl: userFromDB.profileImgUrl
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "15d",
    });

    res.status(200).json({ token, payload });
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
    const { name, username, email, contact } = req.body;
    try {
      const userInfo = { name, username, email, contact };

      if (req.file) userInfo.profileImgUrl = req.file.path;

      const userFromDB = await User.findByIdAndUpdate(_id, userInfo, {
        new: true,
      });

      res.status(200).json(userFromDB);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

module.exports = router;
