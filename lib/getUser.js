import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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