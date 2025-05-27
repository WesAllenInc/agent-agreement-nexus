import React from 'react';
import { CertificateBadge } from '../components/training/CertificateBadge';

export default {
  title: 'Training/CertificateBadge',
  component: CertificateBadge,
};

export const Available = () => (
  <CertificateBadge available={true} url="/certificates/sample.pdf" />
);

export const NotAvailable = () => (
  <CertificateBadge available={false} />
);
