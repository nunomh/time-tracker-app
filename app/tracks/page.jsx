'use client';

import React, { useState, useEffect } from 'react';
import { getRecentTracksFromUser, deleteTrack } from '../../actions/trackController';
import Link from 'next/link';

export default function Page() {
    const [tracks, setTracks] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    useEffect(() => {
        let isMounted = true;

        async function fetchTracks() {
            const result = await getRecentTracksFromUser(999);
            if (isMounted) {
                setTracks(result);
            }
        }
        fetchTracks();

        return () => {
            isMounted = false;
        };
    }, [refreshKey]);

    const handleDeleteTrackSuccess = () => {
        setRefreshKey(prevKey => prevKey + 1); // Trigger re-fetch after deactivate
    };

    const handlePageChange = newPage => {
        setCurrentPage(newPage);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTracks = tracks.slice(startIndex, startIndex + itemsPerPage);

    const totalPages = Math.ceil(tracks.length / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const pageLinks = pages.map((page, index) => {
        if (index === 0 || index === pages.length - 1 || Math.abs(page - currentPage) <= 1) {
            return (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`mx-1 px-3 py-1 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    {page}
                </button>
            );
        } else if (index === 1 || index === pages.length - 2) {
            return (
                <span key={page} className="mx-1 px-3 py-1 bg-gray-200">
                    ...
                </span>
            );
        } else {
            return null;
        }
    });

    return (
        <div className="mx-auto max-w-screen-md mt-10">
            <h1 className="text-md font-bold text-center mb-10">Tracks</h1>
            <table className="table-auto w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-4">Task Name</th>
                        <th className="p-4">Time</th>
                        <th className="p-4">Created Date</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTracks.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-4 text-center">
                                Loading...
                            </td>
                        </tr>
                    ) : (
                        paginatedTracks.map((track, index) => (
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
                                <td>
                                    <Link href={`/tracks/${track._id}`}>Edit</Link>
                                    <form action={deleteTrack} onSubmit={handleDeleteTrackSuccess}>
                                        <input name="track_id" type="hidden" defaultValue={track._id.toString()} />
                                        <button type="submit">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="flex justify-center mt-4">{pageLinks}</div>
        </div>
    );
}
