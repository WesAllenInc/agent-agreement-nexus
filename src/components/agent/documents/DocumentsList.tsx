
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  title: string;
  status: string;
  created_at: string;
  signed_at: string | null;
}

interface DocumentsListProps {
  documents: Document[];
}

export default function DocumentsList({ documents }: DocumentsListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No documents found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>{doc.title}</TableCell>
            <TableCell>
              <Badge 
                variant={doc.status === 'signed' ? 'secondary' : 'default'}
              >
                {doc.status}
              </Badge>
            </TableCell>
            <TableCell>
              {format(new Date(doc.created_at), 'MMM d, yyyy')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
