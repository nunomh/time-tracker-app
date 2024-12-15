"use server"

import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db.js";
import { getUserFromCookie } from "../lib/getUser";

export const createTrack = async function (prevState, formData)
{
    console.log(formData);

    const user = await getUserFromCookie();

    const taskValue = formData.get("task"); // Get the combined value
    const [taskId, categoryId] = taskValue.split(":"); // Split by colon

    const errors = {};

    const myTrack = {
        time: parseInt(formData.get("time")),
        taskId: new ObjectId(taskId),
        categoryId: new ObjectId(categoryId),
        author: new ObjectId(user.userId),
    };

    if (errors.task)
    {
        return { errors, success: false };
    }

    const tracksCollection = await getCollection("tracks");
    const newTrack = await tracksCollection.insertOne(myTrack);

    return { success: true };
};

export const getTracks = async function ()
{
    const user = await getUserFromCookie();
    const tracksCollection = await getCollection("tracks");
    const categoriesCollection = await getCollection("categories");

    // Aggregate data grouped by categoryId
    const tracks = await tracksCollection
        .aggregate([
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
                $group: {
                    _id: "$categoryId",
                    categoryName: { $first: "$categoryInfo.name" },
                    totalTime: { $sum: "$time" },
                    tracks: {
                        $push: {
                            _id: { $toString: "$_id" },
                            time: "$time",
                            // taskId: { $toString: "$taskId" },
                            author: { $toString: "$author" }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    categoryId: { $toString: "$_id" },
                    categoryName: 1,
                    totalTime: 1,
                    tracks: 1
                }
            },
            {
                $sort: { totalTime: -1 } // Sorting by total time, change as needed
            }
        ])
        .toArray();

    return tracks;
};