
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Category } from '@/types/category';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  categories, 
  onEdit, 
  onDelete,
  onAdd
}) => {
  return (
    <div className="rounded-md border">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-medium">Categories</h2>
        <Button onClick={onAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No categories found. Create your first category.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {category.color && (
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    {category.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      category.status === "Active" 
                        ? "default" 
                        : category.status === "Draft"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {category.status}
                  </Badge>
                </TableCell>
                <TableCell>{category.productsCount}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(category.updatedAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => onEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => onDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default CategoryList;
