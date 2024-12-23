import { getCollection } from "../../../lib/db";
import CategoryForm from "../../../components/CategoryForm";
import { ObjectId } from "mongodb";

async function getDoc(id) {
  const categoriesCollection = await getCollection("categories");
  const result = await categoriesCollection.findOne({ _id: new ObjectId(id) });

  return {
    _id: result._id.toString(),
    name: result.name,
    author: result.author.toString(),
  };
}

export default async function Page(props) {
  const doc = await getDoc(props.params?.id);

  return (
    <div>
      <h2>Edit Category</h2>
      <CategoryForm category={doc} actionToPerform="edit" />
    </div>
  );
}
