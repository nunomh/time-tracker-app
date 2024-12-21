"use client";

import React, { useState, useEffect } from "react";
import { getTasksTimeTable } from "../actions/trackController";

export default function TasksTimeTable() {
  const [tracks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const result = await getTasksTimeTable();
      setTasks(result);
    }
    fetchTasks();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-screen-md mt-10">
        <h1 className="text-md font-bold text-center mb-10">
          Recent Tasks Total Time
        </h1>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4">Task Name</th>
              <th className="p-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {tracks.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              tracks.map((track, index) => (
                <tr
                  key={track.taskId}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="p-4">{track.taskName}</td>
                  <td className="p-4">
                    {(track.totalTime / 60).toFixed(2)} hours
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
