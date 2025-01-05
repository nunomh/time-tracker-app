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
            setFormSubmitting(false);
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
        setFormSubmitting(true);
        const result = await currentAction(prevState, formData);
        setFormSubmitting(false);
        if (actionToPerform === 'create') {
            if (result.success) {
                onSuccess(); // Notify parent about the successful submission
            }
            return result;
        } else if (actionToPerform === 'edit') {
            return redirect('/tracks');
        }
    }, {});

    const [formSubmitting, setFormSubmitting] = useState(true);

    return (
        <>
            <p className="mx-auto max-w-[80%] md:max-w-3xl mb-3">Create a new track:</p>
            <form
                action={formAction}
                className="mx-auto max-w-[80%] md:max-w-3xl space-y-4 p-4 rounded-lg border-2 border-gray-300 sm:flex sm:justify-center sm:space-x-4 sm:space-y-0"
            >
                <div className="mb-3 sm:mb-0">
                    {/* <label htmlFor="time">Time in minutes:</label> */}
                    <input
                        id="time"
                        name="time"
                        autoComplete="off"
                        type="number"
                        placeholder="Time in minutes"
                        className="input input-bordered w-full max-w-xs"
                        defaultValue={track?.time}
                        disabled={formSubmitting}
                    />
                </div>
                <div className="mb-3 sm:mb-0">
                    {/* <label htmlFor="task">Choose a task:</label> */}
                    <select
                        id="task"
                        name="task"
                        value={selectedTask} // Controlled value
                        onChange={e => setSelectedTask(e.target.value)} // Update state on change
                        disabled={formSubmitting}
                        className="select select-bordered w-full max-w-xs"
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
                <div className="mb-3 sm:mb-0">
                    <input type="hidden" name="track_id" defaultValue={track?._id.toString()} />
                    <button className="btn btn-primary w-full max-w-xs" disabled={formSubmitting}>
                        {formSubmitting ? 'Loading...' : 'Submit'}
                    </button>
                </div>
            </form>
        </>
    );
}
