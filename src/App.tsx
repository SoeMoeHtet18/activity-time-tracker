import { TimerBar } from './components/TimerBar';
import { DailySummary } from './components/DailySummary';
import { ActivityList } from './components/ActivityList';
import { TimeEntries } from './components/TimeEntries';
import { useStore } from './store';
import { useEffect } from 'react';

function App() {
  const { stopAllTimers } = useStore();

  // Stop all timers when window closes
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopAllTimers();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [stopAllTimers]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Time Tracker</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ActivityList />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <DailySummary />
            <TimeEntries />
          </div>
        </div>
      </div>
      
      <TimerBar />
    </div>
  );
}

export default App;