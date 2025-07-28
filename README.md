A time tracking application built with React, TypeScript, and Zustand for personal productivity tracking.

Features

🕒 Timer Tracking:
Start/stop timers for different activities
Multiple concurrent timers
Visual countdown for timed activities (00:00:00 format)
Timer bar showing all running timers
📝 Manual Time Entry:
Add past time entries manually
Set custom durations and dates
Add descriptions to entries
📊 Activity Management:
Create, edit, and delete activities
Assign colors and projects to activities
Set default timer durations
📈 Reporting:
Daily time summaries
Breakdown by activity and project
Total time calculations
💾 Data Persistence:
All data saved locally
Persists between sessions
No external dependencies
Installation

Clone the repository:
bash
git clone https://github.com/SoeMoeHtet18/activity-time-tracker.git
cd activity-time-tracker
Install dependencies:
bash
npm install
Start the development server:
bash
npm start
Open http://localhost:3000 in your browser.
Usage

Tracking Time

Start a timer:
Click the "Start" button next to an activity
For activities with default durations, the timer will count down
For indefinite activities, the timer will count up
Stop a timer:
Click the "Stop" button in the timer bar or activity list
The time entry will be automatically recorded
View running timers:
All active timers appear in the bottom timer bar
Shows elapsed time or remaining time for countdowns
Manual Entries

Click "Add Manual Entry" in the Time Entries section
Select an activity
Enter duration (in minutes)
Set date and time (defaults to current time)
Add an optional description
Click "Add Entry"
Managing Activities

Add new activity:
Enter name in "Activity name" field
Choose a color
Optionally set a project and default duration
Click "Add Activity"
Edit activity:
Click the pencil icon on an activity
Make changes to name, color, project, or duration
Click "Save"
Delete activity:
Click the trash icon on an activity
All related time entries will also be deleted
Data Storage

All data is stored locally in your browser's localStorage. This means:

Your data persists between sessions
It's private to your device
No internet connection required
To reset all data, clear your browser's localStorage for this app
Keyboard Shortcuts

Esc: Close any open modals
Enter: Submit forms
Technologies Used

Frontend: React with TypeScript
State Management: Zustand with persist middleware
Styling: Tailwind CSS
Icons: Heroicons
Date Handling: date-fns
