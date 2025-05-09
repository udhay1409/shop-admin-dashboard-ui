
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
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
      <h3 className="text-lg font-medium mb-4 text-gray-800">{title}</h3>
      <div className="overflow-x-auto">
        <table className="table-enhanced">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Units Sold</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 mr-3 shadow-sm">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-gray-700">{product.name}</span>
                  </div>
                </td>
                <td className="text-gray-700">{product.price}</td>
                <td>
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-2">{product.unitsSold}</span>
                    {product.unitsSold > 50 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Popular
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
