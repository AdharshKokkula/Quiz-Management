import Validator from "../models/validator.js"; // Adjust path if needed

// Test data
const fields = {
  name: {
    value: "Parvati",
    rules: [{ type: "required", message: "Name is required" }],
    callbacks: [],
  },
  email: {
    value: "parvati@example.com",
    rules: [
      { type: "required", message: "Email is required" },
      { type: "email", message: "Invalid email format" },
    ],
    callbacks: [],
  },
  password: {
    value: "Abc@1234",
    rules: [
      { type: "required", message: "Password is required" },
      { type: "password", message: "Weak password" },
    ],
    callbacks: [],
  },
  phone: {
    value: "9876543210",
    rules: [{ type: "phone", message: "Invalid phone number" }],
    callbacks: [],
  },
  pan: {
    value: "ABCDE1234F",
    rules: [{ type: "pan", message: "Invalid PAN number" }],
    callbacks: [],
  },
  aadhaar: {
    value: "234567890123",
    rules: [{ type: "aadhaar", message: "Invalid Aadhaar number" }],
    callbacks: [],
  },
  website: {
    value: "https://example.com",
    rules: [{ type: "url", message: "Invalid URL" }],
    callbacks: [],
  },
  domain: {
    value: "example.com",
    rules: [{ type: "domain", message: "Invalid domain" }],
    callbacks: [],
  },
};

// Run validation
const result = Validator.validate(fields);

// Print result
console.log("Validation Result:");
console.log(JSON.stringify(result, null, 2));
