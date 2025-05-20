import React from 'react';
import NotificationTester from '@/test/run-notification-test';
import MainLayout from '@/components/layout/MainLayout';

export default function TestNotificationsPage() {
  return (
    <MainLayout>
      <NotificationTester />
    </MainLayout>
  );
}
