import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OnboardItem {
  id: string;
  userName: string;
  mobileNumber: string;
  date: string;
  location: string;
}

interface RecentOnboardTableProps {
  data: OnboardItem[];
}

export default function RecentOnboardTable({ data }: RecentOnboardTableProps) {
  return (
    <article className="bg-white border border-border-stroke rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8FAFC]">
            <TableHead className="text-sm text-inactive-text font-semibold px-5 py-4">
              User Name
            </TableHead>
            <TableHead className="text-sm text-inactive-text font-semibold px-5 py-4">
              Mobile Number
            </TableHead>
            <TableHead className="text-sm text-inactive-text font-semibold px-5 py-4">
              Date
            </TableHead>
            <TableHead className="text-sm text-inactive-text font-semibold px-5 py-4">
              Location
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} className="border-t border-border-stroke">
              <TableCell className="text-sm font-medium text-heading-color px-5 py-4">
                {row.userName}
              </TableCell>
              <TableCell className="text-sm font-medium text-heading-color px-5 py-4">
                {row.mobileNumber}
              </TableCell>
              <TableCell className="text-sm font-medium text-heading-color px-5 py-4">
                {row.date}
              </TableCell>
              <TableCell className="text-sm font-medium text-heading-color px-5 py-4">
                {row.location}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
}
