import React from 'react';
import { TrainingModuleList } from '../components/training/TrainingModuleList';

export default {
  title: 'Training/TrainingModuleList',
  component: TrainingModuleList,
};

const modules = [
  {
    id: 'module1',
    title: 'Module 1',
    description: 'Description for Module 1',
    materials: [
      {
        title: 'Material A',
        description: 'PDF Material',
        type: 'pdf',
        completed: false,
        inProgress: true,
        onStart: () => alert('Start Material A'),
        onReview: () => alert('Review Material A'),
      },
      {
        title: 'Material B',
        description: 'Video Material',
        type: 'video',
        completed: true,
        inProgress: false,
        onStart: () => {},
        onReview: () => alert('Review Material B'),
      },
    ],
  },
  {
    id: 'module2',
    title: 'Module 2',
    description: 'Description for Module 2',
    materials: [
      {
        title: 'Material C',
        description: 'Quiz Material',
        type: 'quiz',
        completed: false,
        inProgress: false,
        onStart: () => alert('Start Material C'),
        onReview: () => {},
      },
    ],
  },
];

export const Default = () => (
  <TrainingModuleList modules={modules} />
);
