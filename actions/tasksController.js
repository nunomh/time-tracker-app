"use server"

import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db.js";
import { getUserFromCookie } from "../lib/getUser";
import { getCategoryById } from "./categoryController.js";

export const createTask = async function (prevState, formData)
{
    const user = await getUserFromCookie();

    const errors = {};

    const myTask = {
        name: formData.get("task"),
        categoryId: new ObjectId(formData.get("category")),
        author: new ObjectId(user.userId)
    }

    if (typeof myTask.name != "string") myTask.name = "";

    myTask.name = myTask.name.trim();

    if (myTask.name == "") errors.task = "You must enter a value";


    if (errors.task)
    {
        return { errors, success: false }
    }

    const tasksCollection = await getCollection("tasks");
    const newTask = await tasksCollection.insertOne(myTask);

    return { success: true }
}

export const getTasks = async function ()
{
    const user = await getUserFromCookie();
    const tasksCollection = await getCollection("tasks");
    const categoriesCollection = await getCollection("categories");

    const tasks = await tasksCollection.aggregate([
        {
            $match: { author: new ObjectId(user.userId) }
        },
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryInfo"
            }
        },
        {
            $unwind: {
                path: "$categoryInfo",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: { $toString: "$_id" },
                name: 1,
                categoryId: { $toString: "$categoryId" },
                categoryName: "$categoryInfo.name",
                author: { $toString: "$author" }
            }
        }
    ]).toArray();

    return tasks;
}
