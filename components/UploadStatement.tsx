"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadStatement({ onUpload }: { onUpload: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;

    setLoading(true);
    const file = e.target.files[0];

    const session = await supabase.auth.getSession();
    const token = session.data?.session?.access_token;

    if (!token) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-statement`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      alert("Statement uploaded successfully!");
      onUpload();
    } else {
      const err = await res.json();
      alert("Error: " + err.detail);
    }
    setLoading(false);
  }

  return (
    <div>
      <label className="btn-primary cursor-pointer">
        {loading ? "Uploading..." : "Upload Bank Statement"}
        <input type="file" className="hidden" accept=".csv,.xlsx" onChange={handleUpload} />
      </label>
    </div>
  );
}
