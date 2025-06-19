"use client";
import React from "react";

interface Props {
  name: string;
  setName: (value: string) => void;
}

export default function NameInput({ name, setName }: Props) {
  return (
    <div className="form-control mb-3">
      <label className="label">Integration Name</label>
      <input
        className="input input-bordered"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
