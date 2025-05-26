import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TrainingModule, { TrainingModuleData } from './TrainingModule';

describe('TrainingModule', () => {
  const modules: TrainingModuleData[] = [
    { id: '1', title: 'Module 1', completed: false, progress: 50 },
    { id: '2', title: 'Module 2', completed: true, progress: 100 },
  ];

  it('renders modules', () => {
    render(<TrainingModule modules={modules} />);
    expect(screen.getByText('Module 1')).toBeInTheDocument();
    expect(screen.getByText('Module 2')).toBeInTheDocument();
  });

  it('shows correct button label', () => {
    render(<TrainingModule modules={modules} />);
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('calls action handlers', () => {
    const onStart = jest.fn();
    const onContinue = jest.fn();
    render(<TrainingModule modules={modules} onStart={onStart} onContinue={onContinue} />);
    fireEvent.click(screen.getByText('Start'));
    fireEvent.click(screen.getByText('Review'));
    expect(onStart).toHaveBeenCalledWith('1');
    expect(onContinue).toHaveBeenCalledWith('2');
  });
});
