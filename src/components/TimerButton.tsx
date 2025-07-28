import { useStore } from '../store';
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';

export const TimerButton = ({ activityId }: { activityId: string }) => {
  const { activities, runningTimers, startTimer, stopTimer } = useStore();
  const activity = activities.find((a) => a.id === activityId);
  const isRunning = !!runningTimers[activityId];

  const handleClick = () => {
    if (isRunning) {
      stopTimer(activityId);
    } else {
      startTimer(activityId, `Working on ${activity?.name}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        isRunning
          ? 'bg-red-100 text-red-800 hover:bg-red-200'
          : 'bg-green-100 text-green-800 hover:bg-green-200'
      }`}
    >
      {isRunning ? (
        <>
          <StopIcon className="h-4 w-4" />
          Stop
        </>
      ) : (
        <>
          <PlayIcon className="h-4 w-4" />
          Start
        </>
      )}
    </button>
  );
};