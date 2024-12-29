import { getCollection } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import { validateSession } from '../../../lib/getUser';
import TaskForm from '../../../components/TaskForm';

async function getDoc(id) {
  const tasksCollection = await getCollection('tasks');
  const result = await tasksCollection.findOne({ _id: new ObjectId(id) });

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
      <h2>Edit Task</h2>
      <TaskForm task={doc} actionToPerform="edit" />
    </div>
  );
}
