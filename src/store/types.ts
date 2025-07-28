export interface Activity {
  id: string;
  name: string;
  color: string;
  project?: string;
  description?: string;
}

export interface TimeEntry {
  id: string;
  activityId: string;
  startTime: string;
  endTime?: string;
  timerDuration?: number; 
  description?: string;
  isManual?: boolean;
}

export interface Settings {
  slackWebhook?: string;
  dailyReportTime?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}