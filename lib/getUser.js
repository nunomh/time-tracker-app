import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function getUserFromCookie()
{
    const cookieStore = await cookies();
    const cookie = cookieStore.get('timetrackerapp')?.value;
    if (cookie)
    {
        try
        {
            const decoded = jwt.verify(cookie, process.env.JWTSECRET);
            return decoded;
        } catch (error)
        {
            return null;
        }
    } else
    {
        return null;
    }
}

export async function validateSession()
{
    const cookieStore = await cookies();
    const cookie = cookieStore.get('timetrackerapp')?.value;
    if (cookie)
    {
        try
        {
            const decoded = jwt.verify(cookie, process.env.JWTSECRET);
            return decoded;
        } catch (error)
        {
            redirect("/");
            return null;
        }
    } else
    {
        redirect("/");
        return null;
    }
}

