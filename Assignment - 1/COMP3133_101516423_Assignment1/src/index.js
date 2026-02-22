require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const bodyParser = require("body-parser");

const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const startServer = async () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ limit: "10mb" }));

  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}/graphql`)
  );
};

startServer();