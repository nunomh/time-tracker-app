"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createTrack } from "../actions/trackController";
import React, { useState, useEffect } from "react";
import { getTasksFromUser } from "../actions/tasksController";

export default function NewTackForm({ onSuccess }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const result = await getTasksFromUser();
      setTasks(result);
    }
    fetchTasks();
  }, []);

  const [formState, formAction] = React.useActionState(
    async (prevState, formData) => {
      const result = await createTrack(prevState, formData);
      if (result.success && onSuccess) {
        onSuccess(); // Notify parent about the successful submission
      }
      return result;
    },
    {}
  );

  return (
    <form action={formAction} className="max-w-xs mx-auto">
      <p className="mb-3">Create a new track:</p>
      <div className="mb-3">
        <input
          name="time"
          autoComplete="off"
          type="number"
          placeholder="Time in minutes"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="task">Choose a task:</label>
        <select id="task" name="task">
          {tasks.length > 0 &&
            tasks.map((task) => (
              <option key={task._id} value={`${task._id}:${task.categoryId}`}>
                {task.name}
              </option>
            ))}
          {tasks.length === 0 && <option>Loading tasks...</option>}
        </select>
      </div>
      <button className="mb-3 btn btn-primary">Create Track</button>
    </form>
  );
}
