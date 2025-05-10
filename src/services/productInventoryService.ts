
import { Product } from '@/types/product';

// Initial mock product data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 129.99,
    stock: 45,
    status: 'Active',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    description: 'High-quality wireless headphones with noise cancellation',
    sku: 'WH-2025-001',
    createdAt: new Date(2023, 4, 15).toISOString(),
    updatedAt: new Date(2023, 6, 10).toISOString(),
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 249.99,
    stock: 28,
    status: 'Active',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=300&fit=crop',
    description: 'Latest smartwatch with health monitoring features',
    sku: 'SW-2025-002',
    createdAt: new Date(2023, 3, 10).toISOString(),
    updatedAt: new Date(2023, 5, 20).toISOString(),
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    price: 24.99,
    stock: 120,
    status: 'Active',
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    description: 'Comfortable cotton t-shirt, available in multiple colors',
    sku: 'CT-2025-003',
    createdAt: new Date(2023, 2, 25).toISOString(),
    updatedAt: new Date(2023, 4, 5).toISOString(),
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    price: 19.99,
    stock: 75,
    status: 'Draft',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
    description: 'Eco-friendly stainless steel water bottle, keeps drinks cold for 24 hours',
    sku: 'WB-2025-004',
    createdAt: new Date(2023, 1, 8).toISOString(),
    updatedAt: new Date(2023, 3, 12).toISOString(),
  },
  {
    id: '5',
    name: 'Face Moisturizer',
    price: 34.99,
    stock: 60,
    status: 'Inactive',
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=300&h=300&fit=crop',
    description: 'Hydrating face moisturizer for all skin types',
    sku: 'FM-2025-005',
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString(),
  }
];

// Warehouse locations
export interface WarehouseLocation {
  id: string;
  name: string;
  address: string;
  totalItems: number;
  itemsLowStock: number;
}

export interface ProductInventoryItem {
  productId: string;
  locationId: string;
  quantity: number;
  lowStockThreshold: number;
  lastRestocked: string;
}

// Mock warehouse locations
const WAREHOUSE_LOCATIONS: WarehouseLocation[] = [
  {
    id: '1',
    name: 'Main Warehouse',
    address: '123 Warehouse St, New York, NY 10001',
    totalItems: 4500,
    itemsLowStock: 42,
  },
  {
    id: '2',
    name: 'East Coast Distribution',
    address: '456 East Ave, Boston, MA 02108',
    totalItems: 3200,
    itemsLowStock: 28,
  },
  {
    id: '3',
    name: 'West Coast Center',
    address: '789 Pacific Rd, Los Angeles, CA 90012',
    totalItems: 2800,
    itemsLowStock: 35,
  }
];

// Mock inventory allocation data - which products are in which locations
const PRODUCT_INVENTORY: ProductInventoryItem[] = [
  {
    productId: '1',
    locationId: '1',
    quantity: 25,
    lowStockThreshold: 10,
    lastRestocked: '2025-05-01',
  },
  {
    productId: '1',
    locationId: '2',
    quantity: 20,
    lowStockThreshold: 10,
    lastRestocked: '2025-04-28',
  },
  {
    productId: '2',
    locationId: '1',
    quantity: 15,
    lowStockThreshold: 8,
    lastRestocked: '2025-04-27',
  },
  {
    productId: '2',
    locationId: '3',
    quantity: 13,
    lowStockThreshold: 7,
    lastRestocked: '2025-05-02',
  },
  {
    productId: '3',
    locationId: '2',
    quantity: 70,
    lowStockThreshold: 15,
    lastRestocked: '2025-05-03',
  },
  {
    productId: '3',
    locationId: '3',
    quantity: 50,
    lowStockThreshold: 15,
    lastRestocked: '2025-04-30',
  },
  {
    productId: '4',
    locationId: '1',
    quantity: 25,
    lowStockThreshold: 10,
    lastRestocked: '2025-04-20',
  },
  {
    productId: '5',
    locationId: '2',
    quantity: 8,
    lowStockThreshold: 10,
    lastRestocked: '2025-04-15',
  }
];

class ProductInventoryService {
  private products: Product[] = [...MOCK_PRODUCTS];
  private locations: WarehouseLocation[] = [...WAREHOUSE_LOCATIONS];
  private productInventory: ProductInventoryItem[] = [...PRODUCT_INVENTORY];

  // Event listeners
  private listeners: Array<() => void> = [];

  // Get all products
  getProducts(): Product[] {
    return this.products;
  }

  // Get a single product by ID
  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  // Add a new product
  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      id: Math.random().toString(36).substring(2, 9),
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.push(newProduct);
    this.notifyListeners();
    return newProduct;
  }

  // Update an existing product
  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    const updatedProduct = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.products[index] = updatedProduct;
    this.notifyListeners();
    return updatedProduct;
  }

  // Delete a product
  deleteProduct(id: string): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    
    // Also remove from inventory
    this.productInventory = this.productInventory.filter(item => item.productId !== id);
    
    const deleted = this.products.length < initialLength;
    if (deleted) {
      this.notifyListeners();
    }
    return deleted;
  }

  // Get warehouse locations
  getLocations(): WarehouseLocation[] {
    return this.locations;
  }

  // Get inventory for a specific product
  getProductInventory(productId: string): ProductInventoryItem[] {
    return this.productInventory.filter(item => item.productId === productId);
  }

  // Get all inventory items
  getAllInventory(): Array<ProductInventoryItem & { product: Product }> {
    return this.productInventory.map(item => {
      const product = this.getProductById(item.productId);
      if (!product) throw new Error(`Product not found for ID: ${item.productId}`);
      return { ...item, product };
    });
  }

  // Update product stock in a specific location
  updateProductStock(productId: string, locationId: string, quantity: number): void {
    // Find the inventory item
    const index = this.productInventory.findIndex(
      item => item.productId === productId && item.locationId === locationId
    );

    if (index !== -1) {
      // Update existing inventory record
      this.productInventory[index] = {
        ...this.productInventory[index],
        quantity,
        lastRestocked: new Date().toISOString().split('T')[0],
      };
    } else {
      // Create new inventory record if it doesn't exist
      const product = this.getProductById(productId);
      if (!product) return;
      
      this.productInventory.push({
        productId,
        locationId,
        quantity,
        lowStockThreshold: Math.max(5, Math.floor(quantity * 0.2)), // Default threshold is 20% of quantity or 5, whichever is higher
        lastRestocked: new Date().toISOString().split('T')[0],
      });
    }

    // Update total stock in the product itself
    const totalStock = this.productInventory
      .filter(item => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);

    const productIndex = this.products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      this.products[productIndex] = {
        ...this.products[productIndex],
        stock: totalStock,
        updatedAt: new Date().toISOString(),
      };
    }

    this.notifyListeners();
  }

  // Add a listener for changes
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of a change
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// Create a singleton instance
export const productInventoryService = new ProductInventoryService();
