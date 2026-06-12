'use client';

import { useState } from 'react';

export default function PDFUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch('http://localhost:8000/upload/pdf', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Document Upload</h1>
      <p className="text-zinc-400 mb-8">Upload PDFs for RAG + Knowledge Graph processing</p>

      <div className="border border-dashed border-zinc-700 rounded-3xl p-12 text-center">
        <input 
          type="file" 
          accept=".pdf" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-6"
        />
        <button 
          onClick={upload} 
          disabled={!file || loading}
          className="px-8 py-3 bg-white text-black rounded-2xl font-medium disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Upload & Index'}
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="font-medium mb-4">Document Processed</div>
          <div className="space-y-2 text-sm">
            <div><span className="text-zinc-500">Filename:</span> {result.filename}</div>
            <div><span className="text-zinc-500">Size:</span> {result.size} bytes</div>
            <div className="text-emerald-400">{result.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}