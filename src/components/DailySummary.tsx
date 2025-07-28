import { useStore } from '../store';
import { format, isToday, isYesterday } from 'date-fns';

export const DailySummary = ({ date }: { date?: Date }) => {
  const { getDailySummary, activities } = useStore();
  const summary = getDailySummary(date);
  const displayDate = date
    ? isToday(date)
      ? 'Today'
      : isYesterday(date)
      ? 'Yesterday'
      : format(date, 'MMMM d, yyyy')
    : 'Today';

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-3">{displayDate}'s Activity</h3>

      <div className="space-y-3">
        {Object.entries(summary.byActivity).map(([activityId, minutes]) => {
          const activity = activities.find((a) => a.id === activityId);
          const hours = Math.floor(minutes / 60);
          const mins = Math.round(minutes % 60);

          return (
            <div key={activityId} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activity?.color || '#ccc' }}
                />
                <span>{activity?.name}</span>
                {activity?.project && (
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {activity.project}
                  </span>
                )}
              </div>
              <span className="font-mono">
                {hours > 0 && `${hours}h `}
                {mins}m
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t flex justify-between font-medium">
        <span>Total</span>
        <span className="font-mono">
          {Math.floor(summary.totalMinutes / 60)}h {Math.round(summary.totalMinutes % 60)}m
        </span>
      </div>
    </div>
  );
};