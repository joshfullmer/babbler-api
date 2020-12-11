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
import { loginController, signupController } from './auth';

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

app.post('/signup', signupController);

app.post('/login', loginController);

export default app;