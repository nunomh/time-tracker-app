"use server"

import { getCollection } from "../lib/db.js";
import bcrypt from "bcrypt";
import { cookies } from "next/headers.js";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

function isAlphaNumeric(x)
{
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(x);
}

export const login = async function (prevState, formData)
{
    const errors = {};

    const ourUser = {
        username: formData.get("username"),
        password: formData.get("password"),
    }

    if (typeof ourUser.username != "string") ourUser.username = "";
    if (typeof ourUser.password != "string") ourUser.password = "";

    const collection = await getCollection("users");
    const user = await collection.findOne({ username: ourUser.username });

    if (!user)
    {
        errors.username = "User not found";
        return { success: false, errors: errors }
    }

    const matchOrNot = bcrypt.compareSync(ourUser.password, user.password);
    if (!matchOrNot)
    {
        errors.password = "Invalid Password"
        return { success: false, errors: errors }
    }

    // create jwt value
    const ourTokenValue = jwt.sign({ name: user.username, userId: user._id, createdDate: user.createdDate, exp: Math.floor(Date.now() / 1000 + 60 * 60 * 24) }, process.env.JWTSECRET)

    // log the user in by giving them a cookie
    cookies().set("timetrackerapp", ourTokenValue, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        secure: true // only send over https if it's not a development environment
    });

    return redirect("/");
}

export const logout = async function ()
{
    const cookieStore = await cookies();
    await cookieStore.delete("timetrackerapp");
    redirect("/");
}

export const register = async function (prevState, formData)
{
    const errors = {}

    const ourUser = {
        username: formData.get("username"),
        password: formData.get("password"),
        createdDate: new Date()
    }

    if (typeof ourUser.username != "string") ourUser.username = "";
    if (typeof ourUser.password != "string") ourUser.password = "";

    ourUser.username = ourUser.username.trim();
    ourUser.password = ourUser.password.trim();

    if (ourUser.username.length < 3) errors.username = "Username must be at least 3 characters long";
    if (ourUser.username.length > 30) errors.username = "Username cannot be longer than 30 characters";
    if (!isAlphaNumeric(ourUser.username)) errors.username = "You can only use letters and numbers in your username";
    if (ourUser.username == "") errors.username = "You must enter a username";

    // see if username already exists or not
    const usersCollection = await getCollection("users");
    const existingUser = await usersCollection.findOne({ username: ourUser.username });
    if (existingUser) errors.username = "Username is already taken";

    if (ourUser.password.length < 8) errors.password = "Password must be at least 8 characters long";
    if (ourUser.password.length > 30) errors.password = "Password cannot be longer than 30 characters";
    if (ourUser.password == "") errors.password = "You must enter a password";

    if (errors.username || errors.password)
    {
        return { errors, success: false }
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    ourUser.password = bcrypt.hashSync(ourUser.password, salt);

    // storing a new user in the database
    const newUser = await usersCollection.insertOne(ourUser);
    console.log(newUser)
    const userId = newUser.insertedId.toString();

    // create jwt value
    const jwtValue = jwt.sign({ name: ourUser.username, userId: userId, createdDate: new Date(), exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, process.env.JWTSECRET);

    // log the user in by giving them a cookie
    (await cookies()).set("timetrackerapp", jwtValue, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: true
    })

    return { success: true }
}