
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useProductAttributes } from '@/hooks/useProductAttributes';
import { ProductAttribute, ProductAttributeWithValues } from '@/types/attribute';
import { Combobox } from '@/components/ui/combobox';

interface AttributeManagerProps {
  productId?: string;
  onAttributesChange?: (attributes: Array<{ attributeId: string, values: string[] }>) => void;
  initialAttributes?: ProductAttributeWithValues[];
}

export function AttributeManager({ productId, onAttributesChange, initialAttributes }: AttributeManagerProps) {
  const { attributes, loading, createAttribute } = useProductAttributes();
  const [selectedAttributes, setSelectedAttributes] = useState<Map<string, string[]>>(new Map());
  const [newAttribute, setNewAttribute] = useState('');
  const [newAttributeDisplay, setNewAttributeDisplay] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingAttribute, setEditingAttribute] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from props only once
  useEffect(() => {
    if (initialAttributes && initialAttributes.length > 0 && !isInitialized) {
      const initialMap = new Map<string, string[]>();
      initialAttributes.forEach(attr => {
        initialMap.set(attr.id, attr.values);
      });
      setSelectedAttributes(initialMap);
      setIsInitialized(true);
    }
  }, [initialAttributes, isInitialized]);

  // Notify parent component when attributes change
  const notifyParent = useCallback(() => {
    if (onAttributesChange) {
      const attributesArray = Array.from(selectedAttributes.entries()).map(([attributeId, values]) => ({
        attributeId,
        values
      }));
      onAttributesChange(attributesArray);
    }
  }, [selectedAttributes, onAttributesChange]);

  // Only call notifyParent when selectedAttributes changes
  useEffect(() => {
    if (isInitialized) {
      notifyParent();
    }
  }, [selectedAttributes, notifyParent, isInitialized]);

  const handleAddAttribute = (attributeId: string) => {
    if (!selectedAttributes.has(attributeId)) {
      setSelectedAttributes(prev => new Map(prev).set(attributeId, []));
      setEditingAttribute(attributeId);
    }
  };

  const handleRemoveAttribute = (attributeId: string) => {
    setSelectedAttributes(prev => {
      const updated = new Map(prev);
      updated.delete(attributeId);
      return updated;
    });
  };

  const handleAddValue = (attributeId: string) => {
    if (newValue.trim() && selectedAttributes.has(attributeId)) {
      setSelectedAttributes(prev => {
        const updated = new Map(prev);
        const currentValues = updated.get(attributeId) || [];
        if (!currentValues.includes(newValue.trim())) {
          updated.set(attributeId, [...currentValues, newValue.trim()]);
        }
        return updated;
      });
      setNewValue('');
    }
  };

  const handleRemoveValue = (attributeId: string, value: string) => {
    setSelectedAttributes(prev => {
      const updated = new Map(prev);
      const currentValues = updated.get(attributeId) || [];
      updated.set(attributeId, currentValues.filter(v => v !== value));
      return updated;
    });
  };

  const handleCreateAttribute = async () => {
    if (newAttribute.trim() && newAttributeDisplay.trim()) {
      try {
        const attribute = await createAttribute({
          name: newAttribute.trim(),
          displayName: newAttributeDisplay.trim()
        });
        setNewAttribute('');
        setNewAttributeDisplay('');
        handleAddAttribute(attribute.id);
      } catch (error) {
        console.error('Failed to create attribute:', error);
      }
    }
  };

  const getAvailableAttributes = () => {
    // Ensure we're working with an array, even if attributes is undefined
    const safeAttributes = Array.isArray(attributes) ? attributes : [];
    return safeAttributes.filter(attr => !selectedAttributes.has(attr.id));
  };

  // Generate combobox items safely
  const comboboxItems = getAvailableAttributes().map(attr => ({ 
    value: attr.id, 
    label: attr.displayName 
  }));

  return (
    <div className="space-y-6">
      <div className="border rounded-md p-4 space-y-4">
        <h3 className="text-lg font-medium">Product Attributes</h3>
        
        {/* Selected attributes */}
        <div className="space-y-4">
          {Array.from(selectedAttributes.entries()).map(([attributeId, values]) => {
            const attribute = Array.isArray(attributes) ? attributes.find(a => a.id === attributeId) : undefined;
            return attribute ? (
              <div key={attributeId} className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{attribute.displayName}</div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveAttribute(attributeId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {values.map(value => (
                    <Badge key={value} variant="secondary" className="px-2 py-1">
                      {value}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-1 h-4 w-4 p-0 hover:bg-slate-300 hover:text-slate-700"
                        onClick={() => handleRemoveValue(attributeId, value)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                {editingAttribute === attributeId ? (
                  <div className="flex gap-2">
                    <Input
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Add new value"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddValue(attributeId)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingAttribute(null)}
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingAttribute(attributeId)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Value
                  </Button>
                )}
              </div>
            ) : null;
          })}
        </div>
        
        {/* Add existing attribute */}
        <div className="border-t pt-4 mt-4">
          <Label>Add Existing Attribute</Label>
          <div className="flex gap-2 mt-1">
            <Combobox
              items={comboboxItems}
              className="flex-1"
              placeholder="Select attribute..."
              onValueChange={(value) => value && handleAddAttribute(value)}
              disabled={loading || comboboxItems.length === 0}
            />
          </div>
        </div>
        
        {/* Create new attribute */}
        <div className="border-t pt-4 mt-4">
          <Label>Create New Attribute</Label>
          <div className="grid grid-cols-1 gap-2 mt-1">
            <Input
              placeholder="Internal name (e.g. color)"
              value={newAttribute}
              onChange={(e) => setNewAttribute(e.target.value)}
            />
            <Input
              placeholder="Display name (e.g. Color)"
              value={newAttributeDisplay}
              onChange={(e) => setNewAttributeDisplay(e.target.value)}
            />
            <Button 
              variant="outline" 
              onClick={handleCreateAttribute} 
              disabled={!newAttribute.trim() || !newAttributeDisplay.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Attribute
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
