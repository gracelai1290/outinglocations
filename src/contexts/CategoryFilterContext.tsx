import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchSheetData } from '../services/googleSheets';
import type { MapDataPoint } from '../types';

interface CategoryFilterContextType {
  selectedCategories: Set<string>;
  setSelectedCategories: (categories: Set<string>) => void;
  allCategories: string[];
  mapData: MapDataPoint[];
  filteredData: MapDataPoint[];
  toggleCategory: (category: string) => void;
  selectAllCategories: () => void;
  clearAllCategories: () => void;
}

const CategoryFilterContext = createContext<CategoryFilterContextType | undefined>(undefined);

export const useCategoryFilter = () => {
  const context = useContext(CategoryFilterContext);
  if (!context) {
    throw new Error('useCategoryFilter must be used within a CategoryFilterProvider');
  }
  return context;
};

interface CategoryFilterProviderProps {
  children: ReactNode;
}

export const CategoryFilterProvider = ({ children }: CategoryFilterProviderProps) => {
  const [mapData, setMapData] = useState<MapDataPoint[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const SHEET_ID = '1PvOBObJktZaGqF9DdTqPUPD3yT_ygOy5u6LB-rzYuWk';

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSheetData(SHEET_ID);
        setMapData(data);
        // Initialize all categories as selected
        const categories = Array.from(new Set(data.map(point => point.category)));
        setSelectedCategories(new Set(categories));
      } catch (err) {
        console.error('Failed to load data for category filter');
      }
    };
    loadData();
  }, []);

  const allCategories = Array.from(new Set(mapData.map(point => point.category)));
  
  const filteredData = mapData.filter(point => selectedCategories.has(point.category));

  const toggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const selectAllCategories = () => {
    setSelectedCategories(new Set(allCategories));
  };

  const clearAllCategories = () => {
    setSelectedCategories(new Set());
  };

  return (
    <CategoryFilterContext.Provider value={{
      selectedCategories,
      setSelectedCategories,
      allCategories,
      mapData,
      filteredData,
      toggleCategory,
      selectAllCategories,
      clearAllCategories
    }}>
      {children}
    </CategoryFilterContext.Provider>
  );
};