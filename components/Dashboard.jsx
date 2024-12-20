"use client";

import React, { useState, useEffect } from "react";
import NewTackForm from "../components/NewTrackForm";
import TracksTable from "../components/TracksTable";
import RecentTracksList from "../components/RecentTracksList";
import { getAllTracksAndSumTime } from "../actions/trackController"; // Adjust the import path as needed
import TasksTimeTable from "./TasksTimeTable";

export default function InteractivePage({ user }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalTime, setTotalTime] = useState(null);

  // Fetch total time on page load
  useEffect(() => {
    const fetchTotalTime = async () => {
      try {
        const result = await getAllTracksAndSumTime();
        setTotalTime(result.totalTime || 0); // Default to 0 if no tracks
      } catch (error) {
        console.error("Failed to fetch total time:", error);
        setTotalTime(0);
      }
    };

    fetchTotalTime();
  }, [refreshKey]);

  const handleFormSuccess = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Trigger re-fetch after form submission
  };

  return (
    <>
      <h1>Welcome back, {user.name}!</h1>
      <small>
        tracking since{" "}
        {user.createdDate
          ? new Date(user.createdDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "N/A"}
      </small>
      <br />
      <small>
        {totalTime !== null
          ? `${(totalTime / 60).toFixed(2)} hours tracked`
          : "Loading..."}
      </small>
      <div className="mt-5">
        <NewTackForm onSuccess={handleFormSuccess} />
      </div>
      <div>
        <p>Recent tracks:</p>
        <RecentTracksList key={refreshKey} />
      </div>
      <div className="mt-5">
        <p>Category Times:</p>
        <TracksTable key={refreshKey} />
      </div>
      <div className="mt-5">
        <p>Recent Tasks Total Time:</p>
        <TasksTimeTable key={refreshKey} />
      </div>
    </>
  );
}
