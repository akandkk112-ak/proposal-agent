import React from "react";

export default function InspectorPanel() {
  return (
    <aside className="w-[320px] border-l border-gray-200 bg-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-headline-sm text-slate-900">Inspector</h3>
        <p className="text-body-sm text-gray-500">Adjust document properties</p>
      </div>
      <div className="flex-1 p-6 space-y-6">
        {/* Content will be dynamic based on active block */}
        <div className="p-4 rounded-lg bg-slate-50 border border-gray-200">
          <p className="text-body-sm text-gray-400 italic">Select a block to view settings</p>
        </div>
      </div>

    </aside>
  );
}
