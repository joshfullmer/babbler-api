// import { ApolloServer } from 'apollo-server';
// import resolvers from './resolvers';
// import typeDefs from './schema';

// const server = new ApolloServer({ typeDefs, resolvers });

// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });

import express from 'express';
import bodyParser from 'body-parser';
import { toNamespacedPath } from 'path';
import { sequelize } from './db';
import { User } from './db/models'

const app = express();
app.use(bodyParser.json());

sequelize.sync().then( async () => {
  // await User.create({username: 'tom'});
  
  app.listen(4000, () => {
    console.log('server is ready');
  });

})

//Endpoint
app.get('/users', async (req, res) => {
  let users = await User.findAll();
  res.json(users);
})


export default app;