'use client';

import { redirect } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import React, { useState, useEffect } from 'react';

import { createTrack, editTrack } from '../actions/trackController';
import { getTasksFromUser } from '../actions/tasksController';

export default function TrackForm({ actionToPerform, onSuccess, track }) {
    const [tasks, setTasks] = useState([]);

    const [selectedTask, setSelectedTask] = useState(`${track?.taskId}:${track?.categoryId}` || '');

    useEffect(() => {
        async function fetchTasks() {
            const result = await getTasksFromUser();
            setTasks(result);
        }
        fetchTasks();
    }, []);

    let currentAction;
    if (actionToPerform === 'create') {
        currentAction = createTrack;
    } else if (actionToPerform === 'edit') {
        currentAction = editTrack;
    }

    const [formState, formAction] = React.useActionState(async (prevState, formData) => {
        const result = await currentAction(prevState, formData);
        if (actionToPerform === 'create') {
            if (result.success) {
                onSuccess(); // Notify parent about the successful submission
            }
            return result;
        } else if (actionToPerform === 'edit') {
            return redirect('/tracks');
        }
    }, {});

    return (
        <form action={formAction} className="max-w-xs mx-auto">
            <div className="mb-3">
                <input
                    name="time"
                    autoComplete="off"
                    type="number"
                    placeholder="Time in minutes"
                    className="input input-bordered w-full max-w-xs"
                    defaultValue={track?.time}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="task">Choose a task:</label>
                <select
                    id="task"
                    name="task"
                    value={selectedTask} // Controlled value
                    onChange={e => setSelectedTask(e.target.value)} // Update state on change
                >
                    {tasks.length > 0 &&
                        tasks.map(task => (
                            <option key={task._id} value={`${task._id}:${task.categoryId}`}>
                                {task.name}
                            </option>
                        ))}
                    {tasks.length === 0 && <option>Loading tasks...</option>}
                </select>
            </div>
            <input type="hidden" name="track_id" defaultValue={track?._id.toString()} />
            <button className="mb-3 btn btn-primary">Submit</button>
        </form>
    );
}
