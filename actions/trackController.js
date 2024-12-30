"use server"

import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db.js";
import { getUserFromCookie, validateSession } from "../lib/getUser";

export const createTrack = async function (prevState, formData)
{
	await validateSession();
	const user = await getUserFromCookie();

	const taskValue = formData.get("task"); // Get the combined value
	const [taskId, categoryId] = taskValue.split(":"); // Split by colon

	const errors = {};

	console.log("formData.get('time')", formData.get("time"))

	const myTrack = {
		time: parseInt(formData.get("time")),
		createdDate: new Date(),
		modifiedDate: new Date(),
		taskId: new ObjectId(taskId),
		categoryId: new ObjectId(categoryId),
		author: new ObjectId(user.userId),
	};

	console.log("myTrack", myTrack)

	if (errors.task)
	{
		return { errors, success: false };
	}

	const tracksCollection = await getCollection("tracks");
	const newTrack = await tracksCollection.insertOne(myTrack);

	return { success: true };
};

export const editTrack = async function (prevState, formData)
{
	await validateSession();
	const tracksCollection = await getCollection("tracks");

	console.log(formData)

	const taskValue = formData.get("task"); // Get the combined value
	const [taskId, categoryId] = taskValue.split(":"); // Split by colon

	const myTrack = {
		time: parseInt(formData.get("time")),
		modifiedDate: new Date(),
		taskId: new ObjectId(taskId),
		categoryId: new ObjectId(categoryId),
	};

	const result = await tracksCollection.updateOne({ _id: new ObjectId(formData.get("track_id")) }, { $set: myTrack });

	if (result.modifiedCount === 0)
	{
		return { success: false, errors: { track_id: "Track not found" } };
	}

	return { success: true };
};

export const getTracks = async function ()
{
	await validateSession();
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

export const getTasksFromUserTimeTable = async function ()
{
	await validateSession();
	const user = await getUserFromCookie();
	const tracksCollection = await getCollection("tracks");
	const tasksCollection = await getCollection("tasks");

	// Aggregate data grouped by categoryId
	const tracks = await tracksCollection
		.aggregate([
			{
				$match: { author: new ObjectId(user.userId) }
			},
			{
				$lookup: {
					from: "tasks",
					localField: "taskId",
					foreignField: "_id",
					as: "taskInfo"
				}
			},
			{
				$unwind: {
					path: "$taskInfo",
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$group: {
					_id: "$taskId",
					taskName: { $first: "$taskInfo.name" },
					totalTime: { $sum: "$time" },
					tracks: {
						$push: {
							_id: { $toString: "$_id" },
							time: "$time",
							// taskId: { $toString: "$taskId" },
							author: { $toString: "$author" },
							createdDate: "$createdDate"
						}
					}
				}
			},
			{
				$project: {
					_id: 0,
					taskId: { $toString: "$_id" },
					taskName: 1,
					totalTime: 1,
					tracks: 1
				}
			},
			{
				$sort: { totalTime: -1 } // Sorting by total time, change as needed
			}
		])
		.toArray();

	return tracks.sort((a, b) =>
	{
		const mostRecentA = a.tracks.reduce((latest, track) =>
		{
			return track.createdDate > latest.createdDate ? track : latest;
		}, a.tracks[0]).createdDate;
		const mostRecentB = b.tracks.reduce((latest, track) =>
		{
			return track.createdDate > latest.createdDate ? track : latest;
		}, b.tracks[0]).createdDate;
		return mostRecentB - mostRecentA;
	});
};

export const getRecentTracksFromUser = async function (limit = 10)
{
	await validateSession();
	const user = await getUserFromCookie();
	const tracksCollection = await getCollection("tracks");

	const tracks = await tracksCollection.aggregate([
		{
			$match: { author: new ObjectId(user.userId) }
		},
		{
			$lookup: {
				from: "tasks",
				localField: "taskId",
				foreignField: "_id",
				as: "taskInfo"
			}
		},
		{
			$unwind: {
				path: "$taskInfo",
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$project: {
				_id: { $toString: "$_id" },
				time: 1,
				taskName: "$taskInfo.name",
				author: { $toString: "$author" },
				createdDate: 1
			}
		},
		{
			$sort: { createdDate: -1 }
		},
		{
			$limit: limit
		}
	]).toArray();

	return tracks;
};

export const getAllTracksAndSumTime = async function ()
{
	await validateSession();
	const user = await getUserFromCookie(); // Fetch the authenticated user
	const tracksCollection = await getCollection("tracks"); // Get the tracks collection

	const result = await tracksCollection.aggregate([
		{
			$match: { author: new ObjectId(user.userId) } // Match only tracks belonging to the user
		},
		{
			$group: {
				_id: "$author", // Group all tracks by the user
				totalTracks: { $sum: 1 }, // Count the total number of tracks
				totalTime: { $sum: "$time" }, // Sum up the "time" field
				tracks: {
					$push: {
						_id: { $toString: "$_id" },
						time: "$time",
						taskId: { $toString: "$taskId" },
						categoryId: { $toString: "$categoryId" },
						createdDate: "$createdDate"
					}
				}
			}
		},
		{
			$project: {
				_id: 0, // Exclude the group ID from the final output
				userId: { $toString: "$_id" },
				totalTracks: 1,
				totalTime: 1,
				tracks: 1
			}
		}
	]).toArray();

	return result[0]; // Return the aggregated result for the user
};



export const deleteTrack = async function (trackId)
{
	await validateSession();
	const tracksCollection = await getCollection("tracks");
	const result = await tracksCollection.deleteOne({ _id: new ObjectId(trackId) });

	if (result.deletedCount === 0)
	{
		return { success: false, errors: { trackId: "Track not found" } };
	}

	return { success: true };
};
