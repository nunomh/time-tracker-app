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
                    {/* <div className="flex-none">
                        <ul className="menu menu-horizontal px-1 text-base font-medium">
                            {user && (
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
                            )}
                            {!user && (
                                <li>
                                    <Link href="/login">Log In</Link>
                                </li>
                            )}
                        </ul>
                    </div> */}
                    <div className="flex flex-1 justify-end px-2">
                        <div className="flex items-stretch">
                            {/* <a className="btn btn-ghost rounded-btn">Button</a> */}
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
                                    Dropdown
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow"
                                >
                                    {user && (
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
                                    )}
                                    {!user && (
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
