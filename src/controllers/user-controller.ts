import { Request, Response } from "express";
import { getAllUsers, handleCreateUser } from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
    // get users
    const users = await getAllUsers();
    return res.render("home", {
        users: users,
    });
};

const getCreateUserPage = (req: Request, res: Response) => {
    return res.render("create-user");
};

const postCreateUser = async (req: Request, res: Response) => {
    const { fullName, email, address } = req.body;

    // handle create user
    await handleCreateUser(fullName, email, address);

    return res.redirect("/");
};

export { getHomePage, getCreateUserPage, postCreateUser };
