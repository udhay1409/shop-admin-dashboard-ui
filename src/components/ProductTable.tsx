
import React from 'react';

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
    <div className="table-container">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">Name</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Units Sold</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b last:border-0">
              <td className="py-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 mr-3">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <span>{product.name}</span>
                </div>
              </td>
              <td className="py-3">{product.price}</td>
              <td className="py-3">{product.unitsSold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
