import Link from 'next/link';
import { getUserFromCookie } from '../lib/getUser';
import { logout } from '../actions/userController';

export default async function Header() {
    const user = await getUserFromCookie();

    return (
        <header className="bg-black text-gray-300 shadow-md">
            <div className="navbar">
                <div className="container mx-auto">
                    <div className="flex-1">
                        <Link href={'/'} className="btn btn-ghost text-xl text-blue-500">
                            time.tracker
                        </Link>
                    </div>
                    <div className="flex flex-1 justify-end px-2">
                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link href="/tracks" className="btn btn-ghost">
                                        Tracks
                                    </Link>
                                    <Link href="/tasks" className="btn btn-ghost">
                                        Tasks
                                    </Link>
                                    <Link href="/categories" className="btn btn-ghost">
                                        Categories
                                    </Link>
                                    <form action={logout}>
                                        <button className="btn btn-ghost">Log Out</button>
                                    </form>
                                </>
                            ) : (
                                <Link href="/login" className="btn btn-ghost">
                                    Log In
                                </Link>
                            )}
                        </div>
                        <div className="flex md:hidden items-stretch">
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu dropdown-content bg-black text-gray-300 rounded-box z-[1] mt-4 w-52 p-2 shadow"
                                >
                                    {user ? (
                                        <>
                                            <li>
                                                <Link href="/tracks">Tracks</Link>
                                            </li>
                                            <li>
                                                <Link href="/tasks">Tasks</Link>
                                            </li>
                                            <li>
                                                <Link href="/categories">Categories</Link>
                                            </li>
                                            <li>
                                                <form action={logout}>
                                                    <button>Log Out</button>
                                                </form>
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <Link href="/login">Log In</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
