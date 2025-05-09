
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export interface Product {
  id: string;
  name: string;
  price: string;
  unitsSold: number;
  image: string;
}

interface ProductTableProps {
  title: string;
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ title, products }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <button className="text-[#EC008C] text-sm font-medium hover:underline">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Units Sold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-pink-50 transition-colors">
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 mr-3 shadow-sm border border-gray-200">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-gray-700">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700">{product.price}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-2">{product.unitsSold}</span>
                    {product.unitsSold > 50 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Popular
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductTable;
