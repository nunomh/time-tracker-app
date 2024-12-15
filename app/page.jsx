import NewTackForm from "../components/NewTrackForm";
import RegisterForm from "../components/RegisterForm";
import TracksTable from "../components/TracksTable";
import { getUserFromCookie } from "../lib/getUser";

export default async function Page() {
  const user = await getUserFromCookie();
  console.log(user);

  return (
    <>
      {user && (
        <>
          <h1>Welcome, {user.name}!</h1>
          <div>
            <p> Create a new track:</p>
            <NewTackForm />
          </div>
          <div>
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
