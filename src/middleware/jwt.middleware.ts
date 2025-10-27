import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    const whiteList = ["/add-product-to-cart", "/login"];

    const isWhiteList = whiteList.some((route) => route === path);
    if (isWhiteList) {
        next();
        return;
    }

    const token = req.headers["authorization"]?.split(" ")[1]; // format: Bearer <token>

    try {
        const dataDecoded: any = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: dataDecoded.id,
            username: dataDecoded.username,
            password: "",
            fullName: "",
            address: "",
            phone: "",
            accountType: dataDecoded.accountType,
            roleId: dataDecoded.roleId,
            role: dataDecoded.role,
            avatar: dataDecoded.avatar,
        };
        next();
    } catch (error) {
        return res.status(401).json({
            data: null,
            message: "Token ko hop le",
        });
    }
};

export { checkValidJWT };
