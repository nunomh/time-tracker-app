import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-100 shadow-md">
      <div className="navbar bg-base-100">
        <div className="container mx-auto">
          <div className="flex-1">
            <Link href={"/"} className="btn btn-ghost text-xl">
              Time Tracker
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a>Settings</a>
              </li>
              <li>
                <Link href="/login">Log In</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
