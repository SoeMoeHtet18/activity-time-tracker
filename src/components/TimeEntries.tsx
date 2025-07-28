import { useStore } from '../store';
import { format, parseISO } from 'date-fns';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ManualEntryForm } from './ManualEntryForm';

export const TimeEntries = () => {
  const { timeEntries, activities, deleteEntry } = useStore();
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});
  const [showManualEntry, setShowManualEntry] = useState(false);

  const toggleEntry = (id: string) => {
    setExpandedEntries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (timeEntries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Time Entries</h2>
        <p className="text-gray-500">No time entries recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Time Entries</h2>
            <button
            onClick={() => setShowManualEntry(true)}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
            >
                <PlusIcon className="h-4 w-4" />
                Add Manual Entry
            </button>
        </div>      
        <div className="space-y-2">
            {timeEntries.slice().reverse().map((entry) => {
            const activity = activities.find((a) => a.id === entry.activityId);
            const startDate = parseISO(entry.startTime);
            const endDate = entry.endTime ? parseISO(entry.endTime) : new Date();
            const duration = (endDate.getTime() - startDate.getTime()) / 1000 / 60; // in minutes
            const isExpanded = expandedEntries[entry.id];

            return (
                <div key={entry.id} className={`border rounded p-3 ${entry.isManual ? 'bg-blue-50' : ''}`}>
                <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleEntry(entry.id)}
                >
                    <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: activity?.color || '#ccc' }}
                    />
                    <span className="font-medium">{activity?.name || 'Unknown'}</span>
                    {activity?.project && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {activity.project}
                        </span>
                    )}
                    </div>
                    <div className="flex items-center gap-4">
                    <span className="font-mono text-sm">
                        {duration.toFixed(1)} min
                    </span>
                    <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                        }`}
                    />
                    </div>
                </div>
                
                {isExpanded && (
                    <div className="mt-2 pt-2 border-t space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Started:</span>
                        <span>{format(startDate, 'MMM d, h:mm a')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Ended:</span>
                        <span>{format(endDate, 'MMM d, h:mm a')}</span>
                    </div>
                    {entry.description && (
                        <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Note:</span> {entry.description}
                        </div>
                    )}
                    <div className="flex justify-end mt-2">
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteEntry(entry.id);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                )}
                </div>
            );
            })}
        </div>
        {showManualEntry && (
            <ManualEntryForm onClose={() => setShowManualEntry(false)} />
        )}
    </div>
  );
};