import jwt from "jsonwebtoken"
console.log("!!! generateToken.js FILE LOADED !!!");

const generateToken = (id) => {
    console.log("FATAL TEST: ENTERING generateToken");
    process.exit(1);
    const secret = "6e39e44e46eac799dfd050db1891454f6954f14f81943c09d44a9a2daa904";
    console.log("SECRET TYPE:", typeof secret);
    console.log("SECRET LENGTH:", secret.length);
    console.log("-----------------------------------------");

    if (!secret || secret === "") {
        throw new Error("STRICT_MODE: Secret is GONE!");
    }

    try {
        const token = jwt.sign({ id }, secret, {
            expiresIn: "30d"
        })
        console.log("TOKEN GENERATED SUCCESS");
        return token;
    } catch (err) {
        console.error("JWT SIGN ERROR:", err.message);
        throw err;
    }
}

export default generateToken