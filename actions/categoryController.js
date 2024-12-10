"use server"

import { getCollection } from "../lib/db.js";
import { getUserFromCookie } from "../lib/getUser";

export const createCategory = async function (prevState, formData)
{
    const user = await getUserFromCookie();

    const errors = {};

    const myCategory = {
        name: formData.get("category"),
        userId: user.userId
    }

    if (typeof myCategory.name != "string") myCategory.name = "";

    myCategory.name = myCategory.name.trim();

    if (myCategory.name == "") errors.category = "You must enter a value";


    if (errors.category)
    {
        return { errors, success: false }
    }

    const categoriesCollection = await getCollection("categories");
    const newCategory = await categoriesCollection.insertOne(myCategory);

    return { success: true }
}