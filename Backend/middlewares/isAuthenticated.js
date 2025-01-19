import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log(token);
        

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",

                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.id = decoded.userId; // Assuming `userId` exists in the JWT payload.
        next(); // Proceed to the next middleware or route handler.
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false,
        });
    }
};
