import DB from "../db/db.js"; // path to db.js

class Migrator {
 
  static async migrate(tables, defaults = {}) {
    const output = [];
    const errorMsgs = {};
    let error = false;

    // Connect to DB
    await DB.connect();

    for (const table of Object.keys(tables)) {
      output.push(`Migrating table: ${table}`);

      try {
        // Check if collection exists
        const collections = await DB.connection.db
          .listCollections({ name: table })
          .toArray();

        if (collections.length > 0) {
          // Skip if exists
          output.push(`Skipped table: ${table} (already exists)`);
        } else {
         
          const collection = await DB.connection.db.createCollection(table);
          output.push(`Migrated table: ${table}`);

         
          if (defaults[table] && Array.isArray(defaults[table]) && defaults[table].length > 0) {
            await collection.insertMany(defaults[table]);
            output.push(`Inserted default documents into: ${table}`);
          }
        }
      } catch (err) {
        errorMsgs[table] = err.message;
        output.push(`Error migrating table: ${table} - ${err.message}`);
        error = true;
      }
    }

    
    await DB.close();

    return {
      output,
      error,
      errorMsgs,
    };
  }
}

export default Migrator;
