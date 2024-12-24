"use server"

import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db.js";
import { getUserFromCookie, validateSession } from "../lib/getUser";


export const getCategoriesFromUser = async function ()
{
    await validateSession();
    const user = await getUserFromCookie();
    const categoriesCollection = await getCollection("categories");
    const categories = await categoriesCollection
        .find({ author: new ObjectId(user.userId) })
        .sort()
        .toArray();

    // Convert _id to a plain string
    return categories.map(category => ({
        ...category,
        _id: category._id.toString(),
        author: category.author?.toString()
    }));
};

export const createCategory = async function (prevState, formData)
{
    const user = await getUserFromCookie();

    const errors = {};

    const myCategory = {
        name: formData.get("category"),
        author: ObjectId.createFromHexString(user.userId)
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

export const editCategory = async function (prevState, formData)
{
    const user = await getUserFromCookie();

    const errors = {};

    const myCategory = {
        name: formData.get("category"),
        author: ObjectId.createFromHexString(user.userId)
    }

    if (typeof myCategory.name != "string") myCategory.name = "";

    myCategory.name = myCategory.name.trim();

    if (myCategory.name == "") errors.category = "You must enter a value";


    if (errors.category)
    {
        return { errors, success: false }
    }

    const categoriesCollection = await getCollection("categories");

    let categoryId = formData.get("category_id");
    if (typeof categoryId != "string") categoryId = "";

    // make sure the user is the author of the category being edited

    const category = await categoriesCollection.findOne({ _id: ObjectId.createFromHexString(categoryId), author: ObjectId.createFromHexString(user.userId) });

    if (!category) return { errors: { category: "You are not the author of this category" }, success: false };

    await categoriesCollection.updateOne({ _id: ObjectId.createFromHexString(categoryId) }, { $set: { name: myCategory.name } });

    return { success: true }
}
