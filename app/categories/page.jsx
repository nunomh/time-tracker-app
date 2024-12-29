'use client';

import React, { useState, useEffect } from 'react';
import { deactivateCategory, getCategoriesFromUser } from '../../actions/categoryController';
import Link from 'next/link';
import CategoryForm from '../../components/CategoryForm';

export default function Page() {
  const [categories, setCategories] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchCategories() {
      const result = await getCategoriesFromUser();
      setCategories(result);
    }
    fetchCategories();
  }, [refreshKey]);

  const handleFormSuccess = () => {
    setRefreshKey(prevKey => prevKey + 1); // Trigger re-fetch after form submission
  };

  const handleDeactivateCategorySuccess = () => {
    setRefreshKey(prevKey => prevKey + 1); // Trigger re-fetch after deactivate
  };

  return (
    <>
      <h2 className="text-center text-2xl text-gray-600 mb-5">Categories</h2>

      <CategoryForm actionToPerform="create" onSuccess={handleFormSuccess} />

      <div className="mx-auto max-w-screen-md mt-10">
        <h1 className="text-md font-bold text-center mb-10">Categories</h1>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr key={category._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                  <td>{category.name}</td>
                  <td>
                    <Link href={`/categories/${category._id}`}>Edit</Link> |
                    <form action={deactivateCategory} onSubmit={handleDeactivateCategorySuccess}>
                      <input name="category_id" type="hidden" defaultValue={category._id.toString()} />
                      <button type="submit">Delete</button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
