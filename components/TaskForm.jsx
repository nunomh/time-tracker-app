'use client';

import { redirect } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { createTask, editTask } from '../actions/tasksController';
import { getCategoriesFromUser } from '../actions/categoryController';

export default function TaskForm({ actionToPerform, onSuccess, task }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const result = await getCategoriesFromUser();
      setCategories(result);
    }
    fetchCategories();
  }, []);

  let currentAction;
  if (actionToPerform === 'create') {
    currentAction = createTask;
  } else if (actionToPerform === 'edit') {
    currentAction = editTask;
  }

  const [formState, formAction] = React.useActionState(async (prevState, formData) => {
    const result = await currentAction(prevState, formData);
    if (actionToPerform === 'create') {
      if (result.success) {
        onSuccess(); // Notify parent about the successful submission
      }
      return result;
    } else if (actionToPerform === 'edit') {
      return redirect('/tasks');
    }
  }, {});

  return (
    <>
      <form action={formAction} className="max-w-xs mx-auto">
        <div className="mb-3">
          <input
            name="task"
            autoComplete="off"
            type="text"
            placeholder="Task"
            className="input input-bordered w-full max-w-xs"
            defaultValue={task?.name}
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
              <span>{formState.errors?.task}</span>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="category">Choose a category:</label>
          <select id="category" name="category">
            {categories.map(category => (
              <option key={category._id} value={category._id} defaultValue={task?.category?._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <input type="hidden" name="task_id" defaultValue={task?._id.toString()} />
        <button className="btn btn-primary">Submit</button>
      </form>
    </>
  );
}
