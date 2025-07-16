import connectdb from "./src/db/dbconn.js";
import { app } from "./src/app.js";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

connectdb()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is Running at port ${port}`);
    });
    app.on("Error", (err) => {
      console.log("ERROR ", err);
      throw err;
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection Falied", err);
  });
