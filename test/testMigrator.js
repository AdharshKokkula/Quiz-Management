import dotenv from "dotenv";
dotenv.config();

import Migrator from "../models/migrator.js";

(async () => {
  try {
    
    const tables = {
      users: null,
      participants: null,
      courses: null,
      events: null
    };

    const result = await Migrator.migrate(tables);

    console.log("Migration Result:");
    console.log(result);
  } catch (err) {
    console.error("Migration Error:", err);
  }
})();
