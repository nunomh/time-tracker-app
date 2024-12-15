"use server"

import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db.js";
import { getUserFromCookie } from "../lib/getUser";

export const createTrack = async function (prevState, formData)
{
    const user = await getUserFromCookie();

    const errors = {};

    const myTrack = {
        time: formData.get("time"),
        taskId: new ObjectId(formData.get("task")),
        userId: new ObjectId(user.userId)
    }

    if (errors.task)
    {
        return { errors, success: false }
    }

    const trackCollection = await getCollection("tracks");
    const newTrack = await tasksCollection.insertOne(myTrack);

    return { success: true }
}