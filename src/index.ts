// import { ApolloServer } from 'apollo-server';
// import resolvers from './resolvers';
// import typeDefs from './schema';

// const server = new ApolloServer({ typeDefs, resolvers });

// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });

import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './db';
import { User } from './models/User';
import { HttpStatus } from './types/http';
import { ValidationErrorItem } from 'sequelize/types';
import bcrypt from "bcrypt";

const app = express();

app.use(bodyParser.json());

//Look into migrations - as alter: true can be destructive
//https://sequelize.org/master/manual/migrations.html
sequelize.sync().then( async () => {
  app.listen(4000, () => {
    console.log('server is ready');
  });

});

//Endpoint
app.get('/users', async (req, res) => {
  const users = await User.findAll();

  res.json(users);
});
//The common status code for get is 200

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  const hash = await bcrypt.hashSync(password, 10);

  // TODO add null checking for email and password.
  if(!username) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: "Username is required." });

    return;
  }

  try {
    const user = await User.create({ username, email, password: hash }); //this is creating a whole new object, not pointing to the previous object

    // TODO send back a JWT, indicating they have successfully been logged in as well
    res.status(HttpStatus.CREATED).json(user);
  } catch ({ errors }) {
    const errorList = errors.map((error: ValidationErrorItem) => {
      return `${error.path} already exists.`;
    });

    res.status(HttpStatus.CONFLICT).json({ errors: errorList });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    res.status(HttpStatus.UNAUTHORIZED).send();

    return;
  }
  const { password: existingHash } = await User.findOne({ where: { email } }) || {};

  if(!existingHash) {
    res.status(HttpStatus.UNAUTHORIZED).send();

    return;
  }

  if(bcrypt.compareSync(password, existingHash)) {
    // Passwords match
    // TODO return JWT for future requests
    res.status(HttpStatus.ACCEPTED).json({ jwt: "" });
  } else {
    // Passwords don't match
    res.status(HttpStatus.UNAUTHORIZED).send();
  }
});

export default app;