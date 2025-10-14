import DB from "../db/db.js"; // your DB class
import User from "../models/auth/users.js"; // import the User model

const runTests = async () => {
  try {
  
    await DB.connect();

    
    const testEmail = `parvati${Date.now()}@example.com`;

   
    let newUser;
    try {
      newUser = await DB.insert("User", {
        email: testEmail,
        phone: "9876543210",
        name: "Parvati Saud",
        password: "12345",
        role: "user",
        status: "pending",
      });
      console.log(" Inserted User:", newUser);
    } catch (err) {
      if (err.code === 11000) {
        console.log(" User already exists, skipping insert.");
      } else {
        throw err;
      }
    }

 
    const users = await DB.select("User");
    console.log(" All Users:", users);

    
    const updated = await DB.update(
      "User",
      { status: "verified" },
      { email: testEmail }
    );
    console.log(" Updated count:", updated);

    
    const count = await DB.count("User");
    console.log(" Total Users:", count);

    
    const exists = await DB.exists("User", { email: testEmail });
    console.log(" User Exists:", !!exists);

    
    const transactionEmail = `amit${Date.now()}@example.com`;
    await DB.withTransaction(async (session) => {
      const doc1 = await DB.insert(
        "User",
        {
          email: transactionEmail,
          phone: "9123456789",
          name: "Amit",
          password: "pass123",
        },
        { session }
      );

      console.log(" Inserted inside transaction:", doc1);


runTests();
