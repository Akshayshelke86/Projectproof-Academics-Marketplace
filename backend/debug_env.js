import 'dotenv/config'
console.log("Checking ENV...");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Found" : "Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Found" : "Missing");
