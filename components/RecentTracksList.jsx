"use client";

import React, { useState, useEffect } from "react";
import { getRecentTracksFromUser } from "../actions/trackController";

export default function RecentTracksList() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchTracks() {
      const result = await getRecentTracksFromUser();
      if (isMounted) {
        setTracks(result);
      }
    }
    fetchTracks();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ padding: "8px", textAlign: "left" }}>Task Name</th>
          <th style={{ padding: "8px", textAlign: "left" }}>Time</th>
          <th style={{ padding: "8px", textAlign: "left" }}>Created Date</th>
        </tr>
      </thead>
      <tbody>
        {tracks.map((track) => (
          <tr key={track.trackId}>
            <td style={{ padding: "8px" }}>{track.taskName}</td>
            <td style={{ padding: "8px" }}>
              {(track.time / 60).toFixed(2)} hours
            </td>
            <td style={{ padding: "8px" }}>
              {track.createdDate
                ? new Date(track.createdDate).toLocaleString()
                : "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
