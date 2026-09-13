import { schedules } from '../data/store';
import { Clock, Calendar, Sun, Moon, Sunrise, Sunset, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Scheduler() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-hypr-text">Scheduler</h2>
          <p className="text-sm text-hypr-text-muted mt-1">Automate wallpaper changes based on time</p>
        </div>
        <button className="px-4 py-2 bg-hypr-accent hover:bg-hypr-accent-dim text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus size={16} />
          New Schedule
        </button>
      </div>

      {/* Timeline Visualization */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <h3 className="font-semibold text-hypr-text mb-4 flex items-center gap-2">
          <Clock size={16} className="text-hypr-accent" />
          24-Hour Timeline
        </h3>
        <div className="relative h-16 bg-hypr-surface-2 rounded-lg overflow-hidden">
          {/* Hour markers */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="flex-1 border-r border-hypr-border/30 relative">
                {i % 3 === 0 && (
                  <span className="absolute bottom-1 left-0.5 text-[9px] text-hypr-text-muted">
                    {i.toString().padStart(2, '0')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Schedule blocks */}
          {/* Night Mode: 20:00 - 07:00 */}
          <div
            className="absolute top-2 h-5 bg-hypr-accent/30 border border-hypr-accent/50 rounded flex items-center px-2"
            style={{ left: `${(20 / 24) * 100}%`, width: `${(4 / 24) * 100}%` }}
          >
            <Moon size={10} className="text-hypr-accent-light" />
          </div>
          <div
            className="absolute top-2 h-5 bg-hypr-accent/30 border border-hypr-accent/50 rounded flex items-center px-2"
            style={{ left: '0%', width: `${(7 / 24) * 100}%` }}
          >
            <Moon size={10} className="text-hypr-accent-light" />
          </div>

          {/* Morning Nature: 07:00 - 12:00 */}
          <div
            className="absolute top-9 h-5 bg-hypr-green/30 border border-hypr-green/50 rounded flex items-center px-2"
            style={{ left: `${(7 / 24) * 100}%`, width: `${(5 / 24) * 100}%` }}
          >
            <Sunrise size={10} className="text-hypr-green" />
            <span className="text-[9px] text-hypr-green ml-1">Morning Nature</span>
          </div>

          {/* Current time indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-hypr-red z-10"
            style={{ left: `${(new Date().getHours() + new Date().getMinutes() / 60) / 24 * 100}%` }}
          >
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-hypr-red rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-hypr-accent/40 border border-hypr-accent/60"></div>
            <span className="text-xs text-hypr-text-dim">Night Mode</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-hypr-green/40 border border-hypr-green/60"></div>
            <span className="text-xs text-hypr-text-dim">Morning Nature</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-hypr-red"></div>
            <span className="text-xs text-hypr-text-dim">Current Time</span>
          </div>
        </div>
      </div>

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {schedules.map(schedule => (
          <div key={schedule.id} className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${schedule.isActive ? 'bg-hypr-green/10' : 'bg-hypr-surface-2'}`}>
                  {schedule.timeRange.start >= '18' || schedule.timeRange.start < '06' ? (
                    <Moon size={18} className={schedule.isActive ? 'text-hypr-green' : 'text-hypr-text-muted'} />
                  ) : (
                    <Sun size={18} className={schedule.isActive ? 'text-hypr-green' : 'text-hypr-text-muted'} />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-hypr-text">{schedule.name}</h4>
                  <p className="text-xs text-hypr-text-muted">
                    {schedule.playlist?.name || 'No playlist assigned'}
                  </p>
                </div>
              </div>
              <button className={`transition-colors ${schedule.isActive ? 'text-hypr-green' : 'text-hypr-text-muted'}`}>
                {schedule.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>

            {/* Time Range */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-hypr-surface-2 rounded-lg">
                <Clock size={12} className="text-hypr-text-muted" />
                <span className="text-xs font-mono text-hypr-text">{schedule.timeRange.start}</span>
              </div>
              <span className="text-hypr-text-muted">→</span>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-hypr-surface-2 rounded-lg">
                <Clock size={12} className="text-hypr-text-muted" />
                <span className="text-xs font-mono text-hypr-text">{schedule.timeRange.end}</span>
              </div>
            </div>

            {/* Days of Week */}
            <div className="flex items-center gap-1.5 mb-3">
              <Calendar size={12} className="text-hypr-text-muted" />
              <div className="flex gap-1">
                {daysOfWeek.map((day, index) => (
                  <span
                    key={day}
                    className={`w-7 h-7 flex items-center justify-center rounded text-[10px] font-medium ${
                      schedule.daysOfWeek.includes(index)
                        ? 'bg-hypr-accent/20 text-hypr-accent-light border border-hypr-accent/30'
                        : 'bg-hypr-surface-2 text-hypr-text-muted border border-hypr-border/50'
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {/* Cron Expression */}
            <div className="code-block p-2">
              <code className="text-xs text-hypr-cyan">
                <span className="text-hypr-text-muted">cron: </span>{schedule.cronExpression}
              </code>
            </div>
          </div>
        ))}

        {/* Add New Schedule Card */}
        <div className="bg-hypr-surface border border-dashed border-hypr-border rounded-xl p-5 flex flex-col items-center justify-center min-h-[180px] hover:border-hypr-accent/30 transition-colors cursor-pointer">
          <Plus size={32} className="text-hypr-text-muted mb-2" />
          <p className="text-sm text-hypr-text-muted">Add New Schedule</p>
          <p className="text-xs text-hypr-text-muted mt-1">Time-based wallpaper automation</p>
        </div>
      </div>

      {/* Systemd Timer Info */}
      <div className="bg-hypr-surface border border-hypr-border rounded-xl p-5">
        <h3 className="font-semibold text-hypr-text mb-3 flex items-center gap-2">
          <Sunset size={16} className="text-hypr-yellow" />
          Systemd Timer Configuration
        </h3>
        <p className="text-sm text-hypr-text-dim mb-3">
          Schedules are managed via systemd user timers for reliability:
        </p>
        <div className="code-block p-4">
          <code className="text-xs leading-relaxed">
            <span className="text-hypr-text-muted"># ~/.config/systemd/user/hyprwall-scheduler.service</span><br/>
            <span className="text-hypr-accent">[Unit]</span><br/>
            <span className="text-hypr-text">Description=HyprWall Scheduler</span><br/>
            <span className="text-hypr-text">After=graphical-session.target</span><br/><br/>
            <span className="text-hypr-accent">[Service]</span><br/>
            <span className="text-hypr-text">Type=oneshot</span><br/>
            <span className="text-hypr-text">ExecStart=/usr/local/bin/hyprwall apply-schedule</span><br/><br/>
            <span className="text-hypr-text-muted"># ~/.config/systemd/user/hyprwall-scheduler.timer</span><br/>
            <span className="text-hypr-accent">[Timer]</span><br/>
            <span className="text-hypr-text">OnCalendar=*:0/5</span><br/>
            <span className="text-hypr-text">Persistent=true</span><br/><br/>
            <span className="text-hypr-accent">[Install]</span><br/>
            <span className="text-hypr-text">WantedBy=timers.target</span>
          </code>
        </div>
      </div>
    </div>
  );
}
