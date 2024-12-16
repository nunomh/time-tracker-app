import NewTackForm from "../components/NewTrackForm";
import RegisterForm from "../components/RegisterForm";
import TracksTable from "../components/TracksTable";
import RecentTracksList from "../components/RecentTracksList";
import { getUserFromCookie } from "../lib/getUser";

export default async function Page() {
  const user = await getUserFromCookie();

  return (
    <>
      {user && (
        <>
          <h1>Welcome back, {user.name}!</h1>
          <div>
            <p> Create a new track:</p>
            <NewTackForm />
          </div>
          <div>
            <p>Recent tracks:</p>
            <RecentTracksList />
          </div>
          <div className="mt-5">
            <p>Total Category time:</p>
            <TracksTable />
          </div>
        </>
      )}
      {!user && (
        <>
          <p className="text-center text-2xl text-gray-600 mb-5">
            Don&rsquo;t have an account? <strong>Create One</strong>
          </p>
          <RegisterForm />
        </>
      )}
    </>
  );
}
