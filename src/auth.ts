import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { HttpStatus } from "./types/http";
import { User } from "./models/User";
import { ValidationErrorItem } from "sequelize/types";
import jwt from "jsonwebtoken";

const accessTokenSecret = "correcthorsebatterystaple";

export const signupController = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  const hash = await bcrypt.hashSync(password, 10);

  // TODO add null checking for email and password.
  if(!username) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: "Username is required." });

    return;
  }

  try {
    await User.create({ username, email, password: hash }); //this is creating a whole new object, not pointing to the previous object

    const token = jwt.sign({ username, email }, accessTokenSecret);

    res.status(HttpStatus.CREATED).json({ jwt: token });
  } catch ({ errors }) {
    const errorList = errors.map((error: ValidationErrorItem) => {
      return `${error.path} already exists.`;
    });

    res.status(HttpStatus.CONFLICT).json({ errors: errorList });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if(!email || !password) {
    res.status(HttpStatus.UNAUTHORIZED).send();

    return;
  }
  const { password: existingHash, username } = await User.findOne({ where: { email } }) || {};

  if(!existingHash) {
    res.status(HttpStatus.UNAUTHORIZED).send();

    return;
  }

  if(bcrypt.compareSync(password, existingHash)) {
    // Passwords match
    const token = jwt.sign({ username, email }, accessTokenSecret, { expiresIn: "1d" });

    res.status(HttpStatus.ACCEPTED).json({ jwt: token });
  } else {
    // Passwords don't match
    res.status(HttpStatus.UNAUTHORIZED).send();
  }
};

// export { signupController, loginController };