import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface InvitationFormProps {
  onSubmit: (email: string) => void;
  loading?: boolean;
}

const InvitationForm: React.FC<InvitationFormProps> = ({ onSubmit, loading }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onSubmit(email);
  };

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="invite-email">Invitee Email</label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter email address"
          required
        />
        <Button type="submit" disabled={loading} style={{ marginTop: 16, width: '100%' }}>
          {loading ? 'Sending...' : 'Send Invitation'}
        </Button>
      </form>
    </Card>
  );
};

export default InvitationForm;
