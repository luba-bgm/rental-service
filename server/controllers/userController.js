import bcrypt from "bcrypt";
import ApiError from "../error/apiError.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const checkAuth = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      userType: user.userType,
      avatar: user.avatar,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return res.json({
    id: user.id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    isPro: user.userType === "pro",
    token,
  });
};

export const logout = (req, res) => {
  res.status(204).send();
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return next(ApiError.badRequest("Пользователь не найден"));

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return next(ApiError.badRequest("Неверный пароль"));

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    next(ApiError.internal("Ошибка авторизации"));
  }
};

export const registration = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password, userType, username } = req.body;

    if (!email || !password) {
      return next(ApiError.badRequest("Incorrect email or password"));
    }

    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      return next(ApiError.badRequest("User with same email already exist"));
    }

    const avatarImage = `/static/${req.file.filename}`;

    const hashPassword = await bcrypt.hash(password, 5);

    const user = await User.create({
      email,
      userType,
      username,
      avatar: avatarImage,
      password: hashPassword,
    });

    res.json({
      user: {
        id: user.id,
        email: user.emdil,
        username: user.username,
        avatarUrl: user.avatar,
        isPro: user.userType === "pro",
      },
    });
  } catch (error) {
    next(ApiError.internal("Registration error"));
  }
};