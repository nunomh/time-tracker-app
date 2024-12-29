"use server"

import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db.js";
import { getUserFromCookie, validateSession } from "../lib/getUser";
import { getCategoryById } from "./categoryController.js";

export const createTask = async function (prevState, formData)
{
	await validateSession();
	const user = await getUserFromCookie();

	const errors = {};

	const myTask = {
		name: formData.get("task"),
		categoryId: new ObjectId(formData.get("category")),
		author: new ObjectId(user.userId),
		active: true,
		finished: false,
		createdDate: new Date(),
		updatedDate: new Date(),
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

export const getTasksFromUser = async function ()
{
	await validateSession();
	const user = await getUserFromCookie();
	const tasksCollection = await getCollection("tasks");
	const categoriesCollection = await getCollection("categories");

	const tasks = await tasksCollection.aggregate([
		{
			$match: { author: new ObjectId(user.userId), active: { $in: [true, undefined] }, finished: { $in: [false, undefined] } }
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

export const getFinishedTasksFromUser = async function ()
{
	await validateSession();
	const user = await getUserFromCookie();
	const tasksCollection = await getCollection("tasks");
	const categoriesCollection = await getCollection("categories");

	const tasks = await tasksCollection.aggregate([
		{
			$match: { author: new ObjectId(user.userId), active: { $in: [true, undefined] }, finished: true }
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

export const editTask = async function (prevState, formData)
{
	await validateSession();
	const user = await getUserFromCookie();
	const tasksCollection = await getCollection("tasks");
	const categoriesCollection = await getCollection("categories");

	const errors = {};

	const myTask = {
		name: formData.get("task"),
		categoryId: new ObjectId(formData.get("category")),
		author: new ObjectId(user.userId),
		modifiedDate: new Date()
	}

	if (typeof myTask.name != "string") myTask.name = "";

	myTask.name = myTask.name.trim();

	if (myTask.name == "") errors.task = "You must enter a value";


	if (errors.task)
	{
		return { errors, success: false }
	}

	let taskId = formData.get("task_id");
	if (typeof taskId != "string") taskId = "";

	taskId = new ObjectId(taskId);

	await tasksCollection.updateOne({ _id: taskId, author: new ObjectId(user.userId) }, { $set: { name: myTask.name, categoryId: myTask.categoryId } });

	return { success: true }
}

export const deactivateTask = async function (formData)
{
	await validateSession();
	const user = await getUserFromCookie();
	const errors = {};

	const tasksCollection = await getCollection("tasks");

	let taskId = formData.get("task_id");
	if (typeof taskId != "string") taskId = "";

	// make sure the user is the author of the task being edited

	const task = await tasksCollection.findOne({ _id: ObjectId.createFromHexString(taskId), author: ObjectId.createFromHexString(user.userId) });

	if (!task) return { errors: { task: "You are not the author of this task" }, success: false };

	await tasksCollection.updateOne({ _id: ObjectId.createFromHexString(taskId) }, { $set: { active: false, updatedDate: new Date() } });

	return { success: true }
}

export const finishTask = async function (formData)
{
	await validateSession();
	const user = await getUserFromCookie();
	const errors = {};

	const tasksCollection = await getCollection("tasks");

	let taskId = formData.get("task_id");
	if (typeof taskId != "string") taskId = "";

	// make sure the user is the author of the task being edited

	const task = await tasksCollection.findOne({ _id: ObjectId.createFromHexString(taskId), author: ObjectId.createFromHexString(user.userId) });

	if (!task) return { errors: { task: "You are not the author of this task" }, success: false };

	await tasksCollection.updateOne({ _id: ObjectId.createFromHexString(taskId) }, { $set: { finished: true, updatedDate: new Date() } });

	return { success: true }
}