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
    <>
      <div className="mx-auto max-w-screen-md mt-10">
        <h1 className="text-md font-bold text-center mb-10">
          Categories Total Time
        </h1>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4">Category Name</th>
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
                  key={track.categoryId}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="p-4">{track.categoryName}</td>
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
