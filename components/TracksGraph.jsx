'use client';

import React, { useState, useEffect } from 'react';
import { getRecentTracksFromUser } from '../actions/trackController';

export default function Page({ isHorizontal = true }) {
    const [tracks, setTracks] = useState([]);
    const [windowWidth, setWindowWidth] = useState(undefined);

    useEffect(() => {
        let isMounted = true;

        async function fetchTracks() {
            const result = await getRecentTracksFromUser('all');
            if (isMounted) {
                setTracks(result);
            }
        }
        fetchTracks();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const today = new Date();
    const showTracks = windowWidth < 768 ? 5 : 15;
    const lastXDays = Array.from(
        { length: showTracks },
        (_, i) => new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
    ).reverse();
    const tracksPerDay = lastXDays.map(date => {
        const dateString = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const count = tracks.filter(
            track =>
                track.createdDate &&
                new Date(track.createdDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }) === dateString
        ).length;
        return { date, count };
    });

    return (
        <div className="mx-auto max-w-screen-md mt-10">
            <div>
                <h2 className="text-md font-bold text-center mb-4">
                    Number of tracks per day within the last {showTracks} days
                </h2>
                <div className={`flex ${isHorizontal ? 'flex-col' : 'flex justify-center'}`}>
                    {tracksPerDay.map(({ date, count }, index) => (
                        <div key={index} className="flex flex-col items-center mr-2">
                            <div
                                className="bg-gray-200"
                                style={{
                                    width: isHorizontal ? `${count * 12}px` : '12px',
                                    height: isHorizontal ? '12px' : `${count * 12}px`,
                                }}
                            />
                            <div className="text-sm ml-2">
                                {count} tracks on{' '}
                                {date.toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
