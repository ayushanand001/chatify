import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // prevent XSS attacks
        sameSite: isProduction ? "none" : "lax", // cross-site cookie in prod (e.g. Vercel + Render)
        secure: isProduction // HTTPS required when sameSite is 'none'
    });

    return token;
};

