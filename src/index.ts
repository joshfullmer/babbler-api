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
import { User } from './db/models';
import { HttpStatus } from './types/http';
import { ValidationErrorItem } from 'sequelize/types';

const app = express();

app.use(bodyParser.json());

sequelize.sync().then( async () => {
  // await User.create({username: 'tom'});

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
  const { username } = req.body;

  if(!username) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: "Username is required." });

    return;
  }

  try {
    const user = await User.create({ username }); //this is creating a whole new object, not pointing to the previous object

    res.status(HttpStatus.CREATED).json(user);
  } catch ({ errors }) {
    const errorList = errors.map((error: ValidationErrorItem) => {
      return `${error.path} already exists.`;
    });

    res.status(HttpStatus.CONFLICT).json({ errors: errorList });
    console.log(errors);

  }
});
//The common status code for post is 201


export default app;