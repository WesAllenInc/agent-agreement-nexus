import React from 'react';
import { Table } from '../ui/table';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export interface Agreement {
  id: string;
  title: string;
  status: string;
  date: string;
}

interface AgreementTableProps {
  agreements: Agreement[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const AgreementTable: React.FC<AgreementTableProps> = ({ agreements, onView, onEdit, onDelete }) => {
  return (
    <Card>
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agreements.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>No agreements found.</td>
            </tr>
          ) : (
            agreements.map((agreement) => (
              <tr key={agreement.id}>
                <td>{agreement.title}</td>
                <td>{agreement.status}</td>
                <td>{agreement.date}</td>
                <td>
                  <Button size="sm" variant="outline" onClick={() => onView?.(agreement.id)}>View</Button>{' '}
                  <Button size="sm" variant="secondary" onClick={() => onEdit?.(agreement.id)}>Edit</Button>{' '}
                  <Button size="sm" variant="destructive" onClick={() => onDelete?.(agreement.id)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  );
};

export default AgreementTable;
