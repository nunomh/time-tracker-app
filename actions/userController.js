"use server"

import { getCollection } from "../lib/db.js"

function isAlphaNumeric(x)
{
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(x);
}

export const register = async function (prevState, formData)
{
    const errors = {}

    const ourUser = {
        username: formData.get("username"),
        password: formData.get("password")
    }

    if (typeof ourUser.username != "string") ourUser.username = "";
    if (typeof ourUser.password != "string") ourUser.password = "";

    ourUser.username = ourUser.username.trim();
    ourUser.password = ourUser.password.trim();

    if (ourUser.username.length < 3) errors.username = "Username must be at least 3 characters long";
    if (ourUser.username.length > 30) errors.username = "Username cannot be longer than 30 characters";
    if (!isAlphaNumeric(ourUser.username)) errors.username = "You can only use letters and numbers in your username";
    if (ourUser.username == "") errors.username = "You must enter a username";

    if (ourUser.password.length < 8) errors.password = "Password must be at least 8 characters long";
    if (ourUser.password.length > 30) errors.password = "Password cannot be longer than 30 characters";
    if (ourUser.password == "") errors.password = "You must enter a password";

    if (errors.username || errors.password)
    {
        return { errors, success: false }
    }

    // storing a new user in the database
    const usersCollection = await getCollection("users");
    await usersCollection.insertOne(ourUser);

    // log the user in by giving them a cookie

    return { success: true }
}