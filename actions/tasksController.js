"use server"

import { getCollection } from "../lib/db.js";
import { getUserFromCookie } from "../lib/getUser";
import { getCategoryById } from "./categoryController.js";

export const createTask = async function (prevState, formData)
{
    const user = await getUserFromCookie();

    const errors = {};

    const myTask = {
        name: formData.get("task"),
        userId: user.userId
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