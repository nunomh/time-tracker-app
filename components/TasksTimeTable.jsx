"use client";

import React, { useState, useEffect } from "react";
import { getTasksTimeTable } from "../actions/trackController";

export default function TasksTimeTable() {
  const [tracks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const result = await getTasksTimeTable();
      console.log(result);
      setTasks(result);
    }
    fetchTasks();
  }, []);

  return (
    <>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px", textAlign: "left" }}>Task Name</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => (
            <tr key={track.taskId}>
              <td style={{ padding: "8px" }}>{track.taskName}</td>
              <td style={{ padding: "8px" }}>
                {(track.totalTime / 60).toFixed(2)} hours
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
