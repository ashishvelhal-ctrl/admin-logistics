
interface StatusPieChartProps {
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  totalMembers: number;
}

export default function StatusPieChart({
  completedCount,
  inProgressCount,
  pendingCount,
  totalMembers,
}: StatusPieChartProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 100 100" className="h-full w-full transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="20"
          />
          {completedCount > 0 && (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10b981"
              strokeWidth="20"
              strokeDasharray={`${(completedCount / totalMembers) * 251.2} 251.2`}
              className="transition-all duration-300"
            />
          )}
          {inProgressCount > 0 && (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="20"
              strokeDasharray={`${(inProgressCount / totalMembers) * 251.2} 251.2`}
              strokeDashoffset={`${(completedCount / totalMembers) * 251.2}`}
              className="transition-all duration-300"
            />
          )}
          {pendingCount > 0 && (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#64748b"
              strokeWidth="20"
              strokeDasharray={`${(pendingCount / totalMembers) * 251.2} 251.2`}
              strokeDashoffset={`${((completedCount + inProgressCount) / totalMembers) * 251.2}`}
              className="transition-all duration-300"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-heading-color">
              {totalMembers}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {completedCount > 0 && (
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <div className="mt-1 text-xs font-medium text-heading-color">Completed</div>
            <div className="text-xs text-muted-foreground">{completedCount}</div>
          </div>
        )}
        {inProgressCount > 0 && (
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <div className="mt-1 text-xs font-medium text-heading-color">In Progress</div>
            <div className="text-xs text-muted-foreground">{inProgressCount}</div>
          </div>
        )}
        {pendingCount > 0 && (
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-slate-500"></div>
            <div className="mt-1 text-xs font-medium text-heading-color">Pending</div>
            <div className="text-xs text-muted-foreground">{pendingCount}</div>
          </div>
        )}
      </div>
    </div>
  );
}
