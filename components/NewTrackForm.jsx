"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createTrack } from "../actions/trackController";
import React from "react";

export default function NewTackForm() {
  const [formState, formAction] = React.useActionState(createTrack, {});

  return (
    <form action={formAction} className="max-w-xs mx-auto">
      <div className="mb-3">
        <input
          name="time"
          autoComplete="off"
          type="text"
          placeholder="Time in minutes"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="mb-3"></div>
      <button className="btn btn-primary">Create Track</button>
    </form>
  );
}
