const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const generateJWT = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET);
};

const checkPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

app.post("/api/auth/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // check if username exists in database
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      return res.status(409).send({ message: "Username already taken" });
    }

    const hashedPassword = hashPassword(password);

    // if no, create the new user and return the access token
    const createdUser = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const jwt = generateJWT(createdUser);

    res.send(jwt);
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
    });

    const passwordIsCorrect = checkPassword(password, user.password);

    if (!passwordIsCorrect || !user) {
      return res.status(401).send({ message: "Wrong credentials" });
    }

    res.send(generateJWT(user));
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", async (req, res, next) => {
  const token = req.headers.authorization;

  const user = jwt.verify(token, process.env.JWT_SECRET);

  res.send(user);
});

app.listen(3000);
