import connectdb from "./src/db/dbconn.js";
// require('dotenv').config({path:'./.env'})

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

connectdb()
