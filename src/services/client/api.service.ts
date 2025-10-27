import { prisma } from "config/client";
import { comparePassword } from "services/user.service";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { ACCOUNT_TYPE } from "config/constant";

const handleGetAllUser = async () => {
    return await prisma.user.findMany();
};

const handleGetUserById = async (id: number) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

const handleUpdateUserById = async (id: number, fullName: string, address: string, phone: string) => {
    return await prisma.user.update({
        where: { id },
        data: {
            fullName,
            address,
            phone,
        },
    });
};

const handleDeleteUserById = async (id: number) => {
    return await prisma.user.delete({
        where: { id },
    });
};

const handleUserLogin = async (username: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            role: true,
        },
    });
    if (!user) {
        throw new Error(`Username ${username} not found`);
    }

    // compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error(`Invalid password`);
    }

    // access token
    const payload = {
        id: user.id,
        username: user.username,
        roleId: user.roleId,
        role: user.role,
        accountType: user.accountType,
        avatar: user.avatar,
    };
    const secret = process.env.JWT_SECRET;
    const expiresIn: any = process.env.JWT_EXPIRES_IN;
    const access_token = jwt.sign(payload, secret, {
        expiresIn: expiresIn,
    });

    return access_token;
};

export { handleGetAllUser, handleGetUserById, handleUpdateUserById, handleDeleteUserById, handleUserLogin };
