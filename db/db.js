import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

class DB {
  static session = null;

  static get connection() {
    return mongoose.connection;
  }

  // Connect to MongoDB
  static async connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(" MongoDB connected");
    } catch (err) {
      console.error(" DB connection error:", err);
      process.exit(1); // optional: could throw instead
    }
  }

  // Helper to get model (accepts string or model directly)
  static _getModel(m) {
    return typeof m === "string" ? mongoose.model(m) : m;
  }

  // Insert document(s) and return created doc
  static async insert(modelName, data, { session } = {}) {
    try {
      const Model = this._getModel(modelName);
      const doc = new Model(data);
      await doc.save(session ? { session } : undefined);
      return doc; // return full document
    } catch (err) {
      console.error("Insert Error:", err);
      throw err;
    }
  }

  // Update matching documents
  static async update(modelName, data, where = {}, { session } = {}) {
    try {
      const Model = this._getModel(modelName);
      const result = await Model.updateMany(where, { $set: data }).session(
        session || null
      );
      return result.modifiedCount ?? 0;
    } catch (err) {
      console.error("Update Error:", err);
      return 0;
    }
  }

  // Select/Find documents
  static async select(modelName, where = {}, options = {}) {
    try {
      const Model = this._getModel(modelName);
      const { session, limit, sort, populate } = options;

      let query = Model.find(where);

      if (session) query = query.session(session);
      if (limit) query = query.limit(limit);
      if (sort) query = query.sort(sort);
      if (populate) query = query.populate(populate);

      return await query.exec();
    } catch (err) {
      console.error("Select Error:", err);
      throw err;
    }
  }

  // Count documents
  static async count(modelName, where = {}) {
    try {
      const Model = this._getModel(modelName);
      return await Model.countDocuments(where);
    } catch (err) {
      console.error("Count Error:", err);
      return 0;
    }
  }

  // Check if document exists
  static async exists(modelName, where = {}) {
    try {
      const Model = this._getModel(modelName);
      return await Model.exists(where);
    } catch (err) {
      console.error("Exists Error:", err);
      return null;
    }
  }

  // Transaction wrapper
  static async withTransaction(callback) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        return await callback(session);
      });
    } finally {
      await session.endSession();
    }
  }

  // Manual transaction (if you prefer old style)
  static async beginTransaction() {
    const session = await mongoose.startSession();
    session.startTransaction();
    this.session = session;
  }

  static async commit() {
    if (this.session) {
      await this.session.commitTransaction();
      this.session.endSession();
      this.session = null;
    }
  }

  static async rollback() {
    if (this.session) {
      await this.session.abortTransaction();
      this.session.endSession();
      this.session = null;
    }
  }

  // Close DB connection
  static async close() {
    await mongoose.connection.close();
    this.session = null;
  }

  // Check connection status
  static isConnected() {
    return mongoose.connection.readyState === 1;
  }

  // Simple sanitizer (avoid for real security)
  static sanitize(value) {
    if (typeof value === "string") {
      return value.replace(/[^\w\s@.-]/gi, "");
    }
    return value;
  }
}

export default DB;
