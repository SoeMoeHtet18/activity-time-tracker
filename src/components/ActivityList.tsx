import { useState } from 'react';
import { useStore } from '../store';
import { TimerButton } from './TimerButton';
import {
  PlusCircleIcon,
  TrashIcon,
  PencilIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

export const ActivityList = () => {
  const { activities, addActivity, updateActivity, deleteActivity } = useStore();
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityColor, setNewActivityColor] = useState('#3b82f6');
  const [newActivityProject, setNewActivityProject] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editProject, setEditProject] = useState('');

  const handleAddActivity = () => {
    if (!newActivityName.trim()) return;
    addActivity({
      name: newActivityName.trim(),
      color: newActivityColor,
      project: newActivityProject.trim() || undefined,
    });
    setNewActivityName('');
    setNewActivityColor('#3b82f6');
    setNewActivityProject('');
  };

  const startEdit = (activity: any) => {
    setEditingId(activity.id);
    setEditName(activity.name);
    setEditColor(activity.color);
    setEditProject(activity.project || '');
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    updateActivity(editingId, {
      name: editName.trim(),
      color: editColor,
      project: editProject.trim() || undefined,
    });
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Activities</h2>

      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newActivityName}
            onChange={(e) => setNewActivityName(e.target.value)}
            placeholder="Activity name"
            className="flex-1 px-3 py-2 border rounded"
          />
          <input
            type="color"
            value={newActivityColor}
            onChange={(e) => setNewActivityColor(e.target.value)}
            className="w-10 h-10 cursor-pointer rounded-full"
          />
        </div>
        <input
          type="text"
          value={newActivityProject}
          onChange={(e) => setNewActivityProject(e.target.value)}
          placeholder="Project (optional)"
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={handleAddActivity}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Activity
        </button>
      </div>

      <div className="space-y-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border rounded p-2 hover:bg-gray-50 transition-colors"
          >
            {editingId === activity.id ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded"
                  />
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-8 h-8 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={editProject}
                  onChange={(e) => setEditProject(e.target.value)}
                  placeholder="Project (optional)"
                  className="w-full px-2 py-1 border rounded"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-2 py-1 text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: activity.color }}
                  />
                  <div>
                    <div className="font-medium">{activity.name}</div>
                    {activity.project && (
                      <div className="text-xs text-gray-500">{activity.project}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TimerButton activityId={activity.id} />
                  <button
                    onClick={() => startEdit(activity)}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};