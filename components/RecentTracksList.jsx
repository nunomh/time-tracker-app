'use client';

import React, { useState, useEffect } from 'react';
import { getRecentTracksFromUser } from '../actions/trackController';

export default function RecentTracksList() {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function fetchTracks() {
            const result = await getRecentTracksFromUser(8);
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
        <div className="mx-auto max-w-screen-md mt-10">
            <h1 className="text-md font-bold text-center mb-10">Recent Tracks</h1>
            <table className="table-auto w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-4">Task Name</th>
                        <th className="p-4">Time</th>
                        <th className="p-4">Created Date</th>
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
                            <tr key={track._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                <td className="p-4">{track.taskName}</td>
                                <td className="p-4">{(track.time / 60).toFixed(2)} hours</td>
                                <td className="p-4">
                                    {track.createdDate
                                        ? `${new Date(track.createdDate).toLocaleDateString('en-GB', {
                                              day: '2-digit',
                                              month: '2-digit',
                                              year: 'numeric',
                                          })}, ${new Date(track.createdDate).toLocaleTimeString('en-GB', {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                              second: '2-digit',
                                          })}`
                                        : 'N/A'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
