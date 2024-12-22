"use client";

import React, { useState, useEffect } from "react";
import { createTask } from "../../actions/tasksController";
import { getCategoriesFromUser } from "../../actions/categoryController";
import { getTasksFromUser } from "../../actions/tasksController";

export default function Page() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const result = await getTasksFromUser();
      setTasks(result);
    }
    fetchTasks();
  }, []);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const result = await getCategoriesFromUser();
      setCategories(result);
    }
    fetchCategories();
  }, []);

  const [formState, formAction] = React.useActionState(
    async (prevState, formData) => {
      const result = await createTask(prevState, formData);
      if (result.success) {
        const updatedTasks = await getTasksFromUser();
        setTasks(updatedTasks);
      }
      return result;
    },
    {}
  );

  return (
    <>
      <h2 className="text-center text-2xl text-gray-600 mb-5">Tasks</h2>
      <form action={formAction} className="max-w-xs mx-auto">
        <div className="mb-3">
          <input
            name="task"
            autoComplete="off"
            type="text"
            placeholder="Task"
            className="input input-bordered w-full max-w-xs"
          />
          {formState.errors?.task && (
            <div role="alert" className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{formState.errors?.category}</span>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="category">Choose a category:</label>
          <select id="category" name="category">
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>

      <div className="mx-auto max-w-screen-md mt-10">
        <h1 className="text-md font-bold text-center mb-10">Tasks</h1>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th>Task</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr
                  key={task._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td>{task.name}</td>
                  <td>{task.categoryName}</td>
                  <td>edit | delete</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
