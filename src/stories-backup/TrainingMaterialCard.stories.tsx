import React from 'react';
import { TrainingMaterialCard } from '../components/training/TrainingMaterialCard';

export default {
  title: 'Training/TrainingMaterialCard',
  component: TrainingMaterialCard,
};

export const Default = () => (
  <TrainingMaterialCard
    title="Sample PDF Material"
    description="A sample PDF training material."
    type="pdf"
    completed={false}
    inProgress={false}
    onStart={() => alert('Start clicked')}
    onReview={() => alert('Review clicked')}
  />
);

export const Completed = () => (
  <TrainingMaterialCard
    title="Completed Video"
    description="A completed video training material."
    type="video"
    completed={true}
    inProgress={false}
    onStart={() => {}}
    onReview={() => alert('Review clicked')}
  />
);

export const InProgress = () => (
  <TrainingMaterialCard
    title="Quiz In Progress"
    description="A quiz currently in progress."
    type="quiz"
    completed={false}
    inProgress={true}
    onStart={() => alert('Start clicked')}
    onReview={() => {}}
  />
);
