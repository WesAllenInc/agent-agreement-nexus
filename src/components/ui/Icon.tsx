import React from 'react';
import { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

const icons: Record<string, React.ComponentType<LucideProps>> = {
  // Add mappings for custom icons or lucide-react icons you want to use
  // Example: check: require('lucide-react').Check,
};

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = icons[name];
  if (!IconComponent) return <span style={{ color: '#ccc' }}>?</span>;
  return <IconComponent {...props} />;
};

export default Icon;
