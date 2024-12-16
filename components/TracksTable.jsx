"use client";

import React, { useState, useEffect } from "react";
import { getTracks } from "../actions/trackController";

export default function TracksTable() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    async function fetchTracks() {
      const result = await getTracks();
      setTracks(result);
    }
    fetchTracks();
  }, []);

  return (
    <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ padding: "8px", textAlign: "left" }}>Category Name</th>
          <th style={{ padding: "8px", textAlign: "left" }}>Time</th>
        </tr>
      </thead>
      <tbody>
        {tracks.map((track) => (
          <tr key={track.categoryId}>
            <td style={{ padding: "8px" }}>{track.categoryName}</td>
            <td style={{ padding: "8px" }}>
              {(track.totalTime / 60).toFixed(2)} hours
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
