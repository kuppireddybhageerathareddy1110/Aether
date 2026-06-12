'use client';

import { useState } from 'react';

const timeline = [
  { type: "journal", date: "Jun 11", title: "Discovered strong correlation between mood and graph centrality", mood: "Inspired" },
  { type: "graph", date: "Jun 10", title: "Generated knowledge graph for 14 papers", nodes: 87 },
  { type: "qa", date: "Jun 9", title: "Generated 23 test cases for new feature", confidence: 0.94 },
  { type: "journal", date: "Jun 8", title: "Felt frustrated with current XAI explanations", mood: "Frustrated" },
  { type: "upload", date: "Jun 7", title: "Uploaded 3 new papers on Graph Neural Networks", docs: 3 },
];

export default function ResearchTimeline() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Research Timeline</h1>
      <p className="text-xl text-zinc-400 mb-10">Unified view of your entire research journey</p>

      <div className="space-y-4">
        {timeline.map((item, i) => (
          <div key={i} className="flex gap-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-7">
            <div className="w-20 text-xs text-zinc-500 font-mono pt-1">{item.date}</div>
            <div className="flex-1">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs mt-2 flex gap-3 text-zinc-400">
                {item.type === "journal" && <span>Mood: {item.mood}</span>}
                {item.type === "graph" && <span>{item.nodes} nodes</span>}
                {item.type === "qa" && <span>Confidence {item.confidence}</span>}
                {item.type === "upload" && <span>{item.docs} documents</span>}
              </div>
            </div>
            <div className="text-xs px-4 py-1 rounded-full bg-zinc-800 h-fit">{item.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}