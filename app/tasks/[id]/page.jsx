import { getCollection } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import { validateSession } from '../../../lib/getUser';

export default async function Page({ params }) {
  await validateSession();
}
