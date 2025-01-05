'use client';

import React, { useState, useEffect } from 'react';
import { getTasksFromUser, deactivateTask, finishTask, getFinishedTasksFromUser } from '../../actions/tasksController';
import TaskForm from '../../components/TaskForm';
import Link from 'next/link';

export default function Page() {
    const [tasks, setTasks] = useState([]);
    const [finishedTasks, setFinishedTasks] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        async function fetchTasks() {
            const result = await getTasksFromUser();
            setTasks(result);
        }
        fetchTasks();
    }, [refreshKey]);

    useEffect(() => {
        async function fetchFinishedTasks() {
            const result = await getFinishedTasksFromUser();
            setFinishedTasks(result);
        }
        fetchFinishedTasks();
    }, [refreshKey]);

    const handleFormSuccess = () => {
        setRefreshKey(prevKey => prevKey + 1); // Trigger re-fetch after form submission
    };

    const handleDeactivateTaskSuccess = () => {
        setRefreshKey(prevKey => prevKey + 1); // Trigger re-fetch after deactivate
    };

    const handleFinishTaskSuccess = () => {
        setRefreshKey(prevKey => prevKey + 1); // Trigger re-fetch after deactivate
    };

    return (
        <>
            <div className="mx-auto max-w-screen-md mt-10">
                <h2 className="text-center text-2xl text-gray-600 mb-5">Tasks</h2>

                <TaskForm actionToPerform="create" onSuccess={handleFormSuccess} />

                <div className="mx-auto max-w-screen-md mt-10">
                    <h1 className="text-md font-bold text-center mb-10">Active Tasks</h1>
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
                                    <tr key={task._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                        <td>{task.name}</td>
                                        <td>{task.categoryName}</td>
                                        <td>
                                            <Link href={`/tasks/${task._id}`}>Edit</Link>
                                            <form action={finishTask} onSubmit={handleFinishTaskSuccess}>
                                                <input
                                                    name="task_id"
                                                    type="hidden"
                                                    defaultValue={task._id.toString()}
                                                />
                                                <button type="submit">Finish</button>
                                            </form>{' '}
                                            <form action={deactivateTask} onSubmit={handleDeactivateTaskSuccess}>
                                                <input
                                                    name="task_id"
                                                    type="hidden"
                                                    defaultValue={task._id.toString()}
                                                />
                                                <button type="submit">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mx-auto max-w-screen-md mt-10">
                    <h1 className="text-md font-bold text-center mb-10">Finished Tasks</h1>
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="bg-gray-200">
                                <th>Task</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finishedTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-4 text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                finishedTasks.map((task, index) => (
                                    <tr key={task._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                        <td>{task.name}</td>
                                        <td>{task.categoryName}</td>
                                        <td>
                                            <Link href={`/tasks/${task._id}`}>Edit</Link> |
                                            {/* <form action={finishTask} onSubmit={handleFinishTaskSuccess}>
                      <input name="task_id" type="hidden" defaultValue={task._id.toString()} />
                      <button type="submit">Finish</button>
                    </form> */}
                                            <form action={deactivateTask} onSubmit={handleDeactivateTaskSuccess}>
                                                <input
                                                    name="task_id"
                                                    type="hidden"
                                                    defaultValue={task._id.toString()}
                                                />
                                                <button type="submit">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
