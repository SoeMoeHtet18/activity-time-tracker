import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { formatISO, isSameDay, parseISO } from 'date-fns';
import { Activity, TimeEntry, Settings } from './types';

interface StoreState {
  activities: Activity[];
  timeEntries: TimeEntry[];
  runningTimers: Record<string, TimeEntry>;
  settings: Settings;
  
  // Activity methods
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  
  // Timer methods
  startTimer: (activityId: string,  description?: string) => void;
  stopTimer: (activityId: string) => TimeEntry | undefined;
  stopAllTimers: () => void;
  
  // Time entry methods
  addManualEntry: (params: {
    activityId: string;
    durationMinutes: number;
    date?: Date;
    description?: string;
  }) => void;
  deleteEntry: (id: string) => void;
  
  // Reporting
  getDailySummary: (date?: Date) => {
    date: string;
    totalMinutes: number;
    byActivity: Record<string, number>;
    byProject: Record<string, number>;
  };
  
  // Settings
  updateSettings: (updates: Partial<Settings>) => void;
  
  // Slack integration
  sendSlackNotification: (message: string) => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      activities: [],
      timeEntries: [],
      runningTimers: {},
      settings: {},
      
      // Activity CRUD
      addActivity: (activity) => {
        const newActivity = {
          ...activity,
          id: Date.now().toString(),
        };
        set((state) => ({ activities: [...state.activities, newActivity] }));
      },
      
      updateActivity: (id, updates) => {
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id ? { ...activity, ...updates } : activity
          ),
        }));
      },
      
      deleteActivity: (id) => {
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id),
          timeEntries: state.timeEntries.filter((entry) => entry.activityId !== id),
          runningTimers: Object.fromEntries(
            Object.entries(state.runningTimers).filter(([_, entry]) => entry.activityId !== id)
          ),
        }));
      },
      
      // Timer controls
      startTimer: (activityId, description) => {
        const { runningTimers } = get();
        
        // Stop any existing timer for this activity
        if (runningTimers[activityId]) {
          get().stopTimer(activityId);
        }
        
        const newEntry: TimeEntry = {
          id: `running-${activityId}-${Date.now()}`,
          activityId,
          startTime: formatISO(new Date()),
          description,
        };
        
        set((state) => ({
          runningTimers: {
            ...state.runningTimers,
            [activityId]: newEntry,
          },
        }));
      },
      
      stopTimer: (activityId) => {
        const { runningTimers } = get();
        const entry = runningTimers[activityId];
        if (!entry) return;
        
        const completedEntry: TimeEntry = {
          ...entry,
          id: Date.now().toString(),
          endTime: formatISO(new Date()),
        };
        
        set((state) => ({
          runningTimers: Object.fromEntries(
            Object.entries(state.runningTimers).filter(([id]) => id !== activityId)
          ),
          timeEntries: [...state.timeEntries, completedEntry],
        }));
        
        return completedEntry;
      },
      
      stopAllTimers: () => {
        const { runningTimers } = get();
        Object.keys(runningTimers).forEach((activityId) => {
          get().stopTimer(activityId);
        });
      },
      
      // Time entries
      addManualEntry: ({ activityId, durationMinutes, date = new Date(), description }) => {
        const endTime = date;
        const startTime = new Date(endTime.getTime() - durationMinutes * 60000);
        
        const newEntry: TimeEntry = {
          id: Date.now().toString(),
          activityId,
          startTime: formatISO(startTime),
          endTime: formatISO(endTime),
          description,
          isManual: true,
        };
        
        set((state) => ({
          timeEntries: [...state.timeEntries, newEntry],
        }));
      },
      
      deleteEntry: (id) => {
        set((state) => ({
          timeEntries: state.timeEntries.filter((entry) => entry.id !== id),
        }));
      },
      
      // Reporting
      getDailySummary: (date = new Date()) => {
        const { timeEntries, activities } = get();
        const dateStr = formatISO(date, { representation: 'date' });
        
        const dailyEntries = timeEntries.filter((entry) => {
          return entry.endTime && isSameDay(parseISO(entry.endTime), date);
        });
        
        const byActivity: Record<string, number> = {};
        const byProject: Record<string, number> = {};
        let totalMinutes = 0;
        
        dailyEntries.forEach((entry) => {
          const activity = activities.find((a) => a.id === entry.activityId);
          const start = parseISO(entry.startTime);
          const end = parseISO(entry.endTime!);
          const minutes = (end.getTime() - start.getTime()) / 1000 / 60;
          
          // Track by activity
          byActivity[entry.activityId] = (byActivity[entry.activityId] || 0) + minutes;
          
          // Track by project if available
          if (activity?.project) {
            byProject[activity.project] = (byProject[activity.project] || 0) + minutes;
          }
          
          totalMinutes += minutes;
        });
        
        return {
          date: dateStr,
          totalMinutes,
          byActivity,
          byProject,
        };
      },
      
      // Settings
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
      
      // Slack integration
      sendSlackNotification: async (message) => {
        const { settings } = get();
        if (!settings.slackWebhook) return;
        
        try {
          await fetch(settings.slackWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message }),
          });
        } catch (error) {
          console.error('Failed to send Slack notification:', error);
        }
      },
    }),
    {
      name: 'slack-time-tracker-storage',
      partialize: (state) => ({
        activities: state.activities,
        timeEntries: state.timeEntries,
        settings: state.settings,
      }),
    }
  )
);