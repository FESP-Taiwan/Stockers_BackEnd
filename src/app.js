const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { typeDefs, resolvers } = require("./schemas/index");
const config = require("config"); // require('dotenv').config()

const PORT = process.env.PORT || 5001;

const app = express();
<<<<<<< HEAD
app.get('/',(req,res)=>{res.send('<a href="http://localhost:5000/test">click me</a>')})
app.use('/',require('./routes/login'));
app.use('/stocker',require('./routes/stocker'));
=======
>>>>>>> 254ce941d4e273152b6a628215613c2b95cd5be0
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send('<a href="http://localhost:5000/test">click me</a>');
});
app.use("/", require("./routes/login"));
app.use("/modules", require("./routes/userModules"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers["token"];
    if (token) {
      try {
        const user = await jwt.verify(token, config.get("SECRET"));
        return { user };
      } catch (e) {
        throw new Error("Your session expired. Sign in again");
      }
    }
    return {};
  }
});

app.get("/test", (req, res) => {
  res.send("test");
});
app.get("/seed", (req, res) => {
  const { seed } = require("./db/seed/user.seed");
  seed();
  res.send("finish");
});
server.applyMiddleware({ app });

<<<<<<< HEAD
app.listen(PORT,() => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
})
=======
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
});
>>>>>>> 254ce941d4e273152b6a628215613c2b95cd5be0
