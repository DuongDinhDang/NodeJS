import { prisma } from "config/client";
import { ACCOUNT_TYPE, TOTAL_ITEMS_PER_PAGE } from "config/constant";
import bcrypt from "bcrypt";
const saltRounds = 10;

const hashPassword = async (plainText: string) => {
    return await bcrypt.hash(plainText, saltRounds);
};

const comparePassword = async (plainText: string, hashPassword: string) => {
    return await bcrypt.compare(plainText, hashPassword);
};

const handleCreateUser = async (
    fullName: string,
    email: string,
    address: string,
    phone: string,
    avatar: string,
    role: string
) => {
    const defaultPassword = await hashPassword("123456");

    const newUser = await prisma.user.create({
        data: {
            fullName: fullName,
            username: email,
            address: address,
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            avatar: avatar,
            phone: phone,
            roleId: +role,
        },
    });
    return newUser;
};

const getAllUsers = async (page: number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const skip = (page - 1) * pageSize;
    const users = await prisma.user.findMany({
        skip: skip,
        take: pageSize,
    });
    return users;
};

const countTotalUserPages = async () => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const totalItems = await prisma.user.count();

    const totalPages = Math.ceil(totalItems / pageSize);
    return totalPages;
};

const getAllRoles = async () => {
    const roles = await prisma.role.findMany();
    return roles;
};

const handleDeleteUser = async (id: string) => {
    const result = await prisma.user.delete({
        where: { id: +id },
    });
    return result;
};

const getUserById = async (id: string) => {
    const user = prisma.user.findUnique({ where: { id: +id } });
    return user;
};

const updateUserById = async (
    id: string,
    fullName: string,
    phone: string,
    role: string,
    address: string,
    avatar: string
) => {
    const updatedUser = await prisma.user.update({
        where: { id: +id },
        data: {
            fullName: fullName,
            phone: phone,
            roleId: +role,
            address: address,
            ...(avatar !== undefined && { avatar: avatar }),
        },
    });
    return updatedUser;
};

export {
    handleCreateUser,
    getAllUsers,
    handleDeleteUser,
    getUserById,
    updateUserById,
    getAllRoles,
    hashPassword,
    comparePassword,
    countTotalUserPages,
};
