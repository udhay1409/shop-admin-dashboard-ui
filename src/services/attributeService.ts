
import { supabase } from "@/integrations/supabase/client";
import { ProductAttribute, ProductAttributeValue, ProductAttributeWithValues } from "@/types/attribute";

export async function getAttributes(): Promise<ProductAttribute[]> {
  const { data, error } = await supabase
    .from('product_attributes')
    .select('*');
  
  if (error) {
    console.error('Error fetching attributes:', error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    displayName: item.display_name,
    createdAt: item.created_at,
  }));
}

export async function createAttribute(attribute: Pick<ProductAttribute, 'name' | 'displayName'>): Promise<ProductAttribute> {
  const { data, error } = await supabase
    .from('product_attributes')
    .insert({
      name: attribute.name,
      display_name: attribute.displayName,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating attribute:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    displayName: data.display_name,
    createdAt: data.created_at,
  };
}

export async function updateAttribute(id: string, attribute: Partial<Pick<ProductAttribute, 'name' | 'displayName'>>): Promise<ProductAttribute> {
  const updateData: any = {};
  if (attribute.name !== undefined) updateData.name = attribute.name;
  if (attribute.displayName !== undefined) updateData.display_name = attribute.displayName;

  const { data, error } = await supabase
    .from('product_attributes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating attribute:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    displayName: data.display_name,
    createdAt: data.created_at,
  };
}

export async function deleteAttribute(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('product_attributes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting attribute:', error);
    throw error;
  }

  return true;
}

export async function getProductAttributes(productId: string): Promise<ProductAttributeWithValues[]> {
  // First get all attribute values for this product
  const { data: attributeValues, error: valuesError } = await supabase
    .from('product_attribute_values')
    .select(`
      attribute_id,
      value,
      product_attributes (
        id, 
        name,
        display_name,
        created_at
      )
    `)
    .eq('product_id', productId);
  
  if (valuesError) {
    console.error('Error fetching product attributes:', valuesError);
    throw valuesError;
  }

  // Group values by attribute
  const attributesMap = new Map<string, ProductAttributeWithValues>();
  
  attributeValues.forEach(item => {
    const attribute = item.product_attributes;
    if (!attribute) return;
    
    const attributeId = attribute.id;
    if (!attributesMap.has(attributeId)) {
      attributesMap.set(attributeId, {
        id: attributeId,
        name: attribute.name,
        displayName: attribute.display_name,
        createdAt: attribute.created_at,
        values: [],
      });
    }
    
    attributesMap.get(attributeId)!.values.push(item.value);
  });

  return Array.from(attributesMap.values());
}

export async function setProductAttributes(
  productId: string, 
  attributes: Array<{ attributeId: string, values: string[] }>
): Promise<boolean> {
  // Start a transaction
  const { error: deleteError } = await supabase
    .from('product_attribute_values')
    .delete()
    .eq('product_id', productId);
  
  if (deleteError) {
    console.error('Error deleting existing attribute values:', deleteError);
    throw deleteError;
  }

  // Insert new values
  const valuesToInsert = attributes.flatMap(attr => 
    attr.values.map(value => ({
      product_id: productId,
      attribute_id: attr.attributeId,
      value,
    }))
  );

  if (valuesToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('product_attribute_values')
      .insert(valuesToInsert);
    
    if (insertError) {
      console.error('Error inserting attribute values:', insertError);
      throw insertError;
    }
  }

  return true;
}
