"use client";

import { redirect } from "next/navigation";
import React, { useState, useEffect } from "react";
import { createCategory, editCategory } from "../actions/categoryController";

export default function CategoryForm({ actionToPerform, onSuccess, category }) {
  let currentAction;
  if (actionToPerform === "create") {
    currentAction = createCategory;
  } else if (actionToPerform === "edit") {
    currentAction = editCategory;
  }

  const [formState, formAction] = React.useActionState(
    async (prevState, formData) => {
      const result = await currentAction(prevState, formData);
      if (actionToPerform === "create") {
        if (result.success && onSuccess) {
          onSuccess(); // Notify parent about the successful submission
        }
        return result;
      } else if (actionToPerform === "edit") {
        return redirect("/categories");
      }
    },
    {}
  );

  return (
    <>
      <form action={formAction} className="max-w-xs mx-auto">
        <div className="mb-3">
          <input
            name="category"
            autoComplete="off"
            type="text"
            placeholder="Category"
            className="input input-bordered w-full max-w-xs"
            defaultValue={category?.name}
          />
          {formState.errors?.category && (
            <div role="alert" className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{formState.errors?.category}</span>
            </div>
          )}
        </div>
        <input
          type="hidden"
          name="category_id"
          defaultValue={category?._id.toString()}
        />
        <button className="btn btn-primary">Submit</button>
      </form>
    </>
  );
}
