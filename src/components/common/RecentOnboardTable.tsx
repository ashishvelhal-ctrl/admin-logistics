interface OnboardItem {
  id: string;
  userName: string;
  mobileNumber: string;
  date: string;
  location: string;
}

interface RecentOnboardTableProps {
  data: OnboardItem[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function RecentOnboardTable({ data }: RecentOnboardTableProps) {
  return (
    <article className="bg-white border border-border-stroke rounded-xl overflow-hidden">
      <header className="px-4 py-3 border-b border-border-stroke bg-[#F5F8F7]">
        <h2 className="text-2xl font-bold text-heading-color">
          Recent Onboard
        </h2>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="bg-[#F8FAFC] text-left">
              <th className="px-4 py-3 text-xs text-inactive-text font-semibold">
                User Name
              </th>
              <th className="px-4 py-3 text-xs text-inactive-text font-semibold">
                Mobile Number
              </th>
              <th className="px-4 py-3 text-xs text-inactive-text font-semibold">
                Date
              </th>
              <th className="px-4 py-3 text-xs text-inactive-text font-semibold">
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t border-border-stroke">
                <td className="px-4 py-3 text-xs font-medium text-heading-color">
                  {row.userName}
                </td>
                <td className="px-4 py-3 text-xs font-medium text-heading-color">
                  {row.mobileNumber}
                </td>
                <td className="px-4 py-3 text-xs font-medium text-heading-color">
                  {row.date}
                </td>
                <td className="px-4 py-3 text-xs font-medium text-heading-color">
                  {row.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
