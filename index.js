import { app } from "./server.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

/* MODELOS de Mongo DB*/
import { RestaurantsDAO } from "./dao/restaurantsDAO.js";
import { UsersDAO } from "./dao/usersDAO.js";

dotenv.config();
const port = process.env.PORT || 8000;

MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await RestaurantsDAO.injectDB(client);
    await UsersDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  });
