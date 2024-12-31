'use client';

import React, { useState, useEffect } from 'react';
import TrackForm from './TrackForm';
import TracksTable from '../components/TracksTable';
import RecentTracksList from '../components/RecentTracksList';
import TracksGraph from '../components/TracksGraph';
import { getAllTracksAndSumTime } from '../actions/trackController'; // Adjust the import path as needed
import TasksTimeTable from './TasksTimeTable';

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
                console.error('Failed to fetch total time:', error);
                setTotalTime(0);
            }
        };

        fetchTotalTime();
    }, [refreshKey]);

    const handleFormSuccess = () => {
        setRefreshKey(prevKey => prevKey + 1); // Trigger re-fetch after form submission
    };

    return (
        <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
            <div className="">
                <h1 className="text-md font-bold">Welcome back, {user.name}!</h1>
                <small className="text-sm text-gray-500">
                    tracking since{' '}
                    {user.createdDate
                        ? new Date(user.createdDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                          })
                        : 'N/A'}
                </small>
            </div>
            <div className="">
                <p className="text-md text-gray-600">
                    You have tracked a total of{' '}
                    {totalTime !== null ? `${(totalTime / 60).toFixed(2)} hours` : 'Loading...'}
                </p>
            </div>
            <div className="mt-10">
                <p className="max-w-xs mx-auto mb-3">Create a new track:</p>
                <TrackForm onSuccess={handleFormSuccess} actionToPerform="create" />
            </div>
            <div className="mt-10">
                <TracksGraph isHorizontal={false} />
            </div>
            <div className="mt-10">
                <RecentTracksList key={refreshKey} />
            </div>
            <div className="mt-10">
                <TasksTimeTable key={refreshKey} />
            </div>
            <div className="mt-10">
                <TracksTable key={refreshKey} />
            </div>
        </div>
    );
}
