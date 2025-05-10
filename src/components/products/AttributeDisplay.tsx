
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProductAttributeWithValues } from '@/types/attribute';

interface AttributeDisplayProps {
  attributes: ProductAttributeWithValues[];
  showLabels?: boolean;
  className?: string;
}

export function AttributeDisplay({ attributes, showLabels = true, className = '' }: AttributeDisplayProps) {
  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {attributes.map(attribute => (
        <div key={attribute.id} className="flex flex-wrap gap-1 items-center">
          {showLabels && (
            <span className="text-sm font-medium text-muted-foreground mr-1">
              {attribute.displayName}:
            </span>
          )}
          <div className="flex flex-wrap gap-1">
            {attribute.values.map((value, idx) => (
              <Badge key={`${attribute.id}-${idx}`} variant="outline">
                {value}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
