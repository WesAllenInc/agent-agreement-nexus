import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { TrainingMaterialCard, TrainingMaterialCardProps } from './TrainingMaterialCard';

export interface TrainingModuleListProps {
  modules: Array<{
    id: string;
    title: string;
    description?: string;
    materials: TrainingMaterialCardProps[];
  }>;
  onMaterialStart?: (moduleId: string, materialId: string) => void;
  onMaterialReview?: (moduleId: string, materialId: string) => void;
}

export const TrainingModuleList: React.FC<TrainingModuleListProps> = ({ modules, onMaterialStart, onMaterialReview }) => {
  return (
    <Accordion type="multiple" className="w-full">
      {modules.map((module) => (
        <AccordionItem key={module.id} value={module.id}>
          <AccordionTrigger>
            <CardHeader>
              <CardTitle>{module.title}</CardTitle>
              {module.description && <p className="text-muted-foreground mt-1">{module.description}</p>}
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="space-y-4">
              {module.materials.map((material) => (
                <TrainingMaterialCard
                  key={material.title}
                  {...material}
                  onStart={() => onMaterialStart?.(module.id, material.title)}
                  onReview={() => onMaterialReview?.(module.id, material.title)}
                />
              ))}
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
