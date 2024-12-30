import { getCollection } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import { validateSession } from '../../../lib/getUser';
import TrackForm from '../../../components/TrackForm';

async function getDoc(id) {
  const tracksCollection = await getCollection('tracks');
  const result = await tracksCollection.findOne({ _id: new ObjectId(id) });
  console.log(result);
  return {
    _id: result._id.toString(),
    name: result.name,
    author: result.author.toString(),
    categoryId: result.categoryId.toString(),
  };
}

export default async function Page({ params }) {
  await validateSession();

  const { id } = await params;
  const doc = await getDoc(id);

  return (
    <div>
      <h2>Edit Track</h2>
      <TrackForm track={doc} actionToPerform="edit" />
    </div>
  );
}
