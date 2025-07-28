import { useStore } from '../store';
import { StopIcon } from '@heroicons/react/24/solid';
import { useEffect, useState, memo } from 'react';
import { format, addMinutes, differenceInSeconds } from 'date-fns';

interface TimerDisplayProps {
  startTime: string;
  durationMinutes?: number;
  isRunning: boolean;
}

const TimerDisplay = memo(({ startTime, durationMinutes, isRunning }: TimerDisplayProps) => {
  const [display, setDisplay] = useState('00:00:00');
  const [isCountdown, setIsCountdown] = useState(false);

  useEffect(() => {
    const updateDisplay = () => {
      const now = new Date();
      const startDate = new Date(startTime);

      if (durationMinutes) {
        // Countdown mode
        const endDate = addMinutes(startDate, durationMinutes);
        const secondsRemaining = differenceInSeconds(endDate, now);

        if (secondsRemaining <= 0) {
          setDisplay('00:00:00');
          setIsCountdown(false);
          return;
        }

        setIsCountdown(true);
        const hours = Math.floor(secondsRemaining / 3600);
        const minutes = Math.floor((secondsRemaining % 3600) / 60);
        const seconds = secondsRemaining % 60;
        setDisplay(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } else {
        // Elapsed time mode
        setIsCountdown(false);
        const secondsElapsed = differenceInSeconds(now, startDate);
        const hours = Math.floor(secondsElapsed / 3600);
        const minutes = Math.floor((secondsElapsed % 3600) / 60);
        const seconds = secondsElapsed % 60;
        setDisplay(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    };

    // Update immediately
    updateDisplay();

    // Then set interval
    const interval = setInterval(updateDisplay, 1000);
    return () => clearInterval(interval);
  }, [startTime, durationMinutes]);

  return (
    <div className="flex items-center gap-1">
      <span
        className={`text-sm font-mono ${
          isCountdown
            ? 'text-orange-600'
            : 'text-gray-500'
        }`}
      >
        {display}
      </span>
      {isCountdown && isRunning && (
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
      )}
    </div>
  );
});

export const TimerBar = () => {
  const { runningTimers, activities, stopTimer, stopAllTimers } = useStore();
  const runningCount = Object.keys(runningTimers).length;

  if (runningCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 overflow-x-auto py-1">
            {Object.entries(runningTimers).map(([activityId, entry]) => {
              const activity = activities.find((a) => a.id === activityId);
              return (
                <div
                  key={activityId}
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: activity?.color || '#999' }}
                  />
                  <span className="font-medium">{activity?.name}</span>
                  <TimerDisplay 
                    startTime={entry.startTime}
                    durationMinutes={entry.timerDuration}
                    isRunning={true}
                  />
                  <button
                    onClick={() => stopTimer(activityId)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <StopIcon className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
          {runningCount > 1 && (
            <button
              onClick={stopAllTimers}
              className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100"
            >
              Stop All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};