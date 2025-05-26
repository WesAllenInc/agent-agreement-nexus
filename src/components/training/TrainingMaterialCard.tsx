import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Video, FileQuestion, CheckCircle, Clock } from 'lucide-react';

export interface TrainingMaterialCardProps {
  title: string;
  description?: string;
  type: 'pdf' | 'video' | 'quiz';
  completed?: boolean;
  inProgress?: boolean;
  onStart?: () => void;
  onReview?: () => void;
}

export const TrainingMaterialCard: React.FC<TrainingMaterialCardProps> = ({
  title,
  description,
  type,
  completed,
  inProgress,
  onStart,
  onReview,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 mr-1" />;
      case 'video':
        return <Video className="h-5 w-5 mr-1" />;
      case 'quiz':
        return <FileQuestion className="h-5 w-5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        {getIcon()}
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {completed ? (
          <Badge className="bg-green-100 text-green-800 ml-auto flex items-center"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
        ) : inProgress ? (
          <Badge className="bg-amber-100 text-amber-800 ml-auto flex items-center"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>
        ) : null}
      </CardHeader>
      <CardContent>
        {description && <p className="text-muted-foreground mb-2">{description}</p>}
        <div className="flex gap-2">
          {completed ? (
            <Button size="sm" variant="outline" onClick={onReview}>Review</Button>
          ) : (
            <Button size="sm" onClick={onStart}>Start</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
