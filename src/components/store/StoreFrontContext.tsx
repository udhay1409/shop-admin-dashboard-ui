
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { getStoreFrontSettings, getFeaturedProducts } from '@/services/frontStoreService';
import { StoreSettings } from '@/services/settingsService';
import { Product } from '@/types/product';
import { useToast } from '@/components/ui/use-toast';

interface StoreFrontContextType {
  storeSettings: StoreSettings | null;
  featuredProducts: Product[];
  loading: boolean;
  error: Error | null;
}

const StoreFrontContext = createContext<StoreFrontContextType | undefined>(undefined);

export const StoreFrontProvider = ({ children }: { children: ReactNode }) => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadStoreData() {
      setLoading(true);
      try {
        // Load store settings
        const settings = await getStoreFrontSettings();
        if (settings) {
          setStoreSettings(settings);
        } else {
          // If no settings found, use defaults
          setStoreSettings({
            storeName: "Fashiona",
            storeUrl: "https://example.com",
            description: "A premium fashion e-commerce store",
            contactEmail: "contact@example.com",
            contactPhone: "1234567890",
            businessType: "retail",
            storeOpen: true,
          });
        }

        // Load featured products
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);

      } catch (err) {
        console.error('Error loading store front data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load store data'));
        toast({
          title: 'Error loading store data',
          description: 'There was a problem loading the store data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    loadStoreData();
  }, [toast]);

  return (
    <StoreFrontContext.Provider value={{ storeSettings, featuredProducts, loading, error }}>
      {children}
    </StoreFrontContext.Provider>
  );
};

export const useStoreFront = () => {
  const context = useContext(StoreFrontContext);
  if (context === undefined) {
    throw new Error('useStoreFront must be used within a StoreFrontProvider');
  }
  return context;
};
