import axios from 'axios';
import type { MapDataPoint } from '../types';

export const fetchSheetData = async (sheetId: string): Promise<MapDataPoint[]> => {
  try {
    // Use CSV export URL - no API key needed for public sheets
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    
    const response = await axios.get(url);
    const csvData = response.data;
    
    // Parse CSV data properly handling quoted fields
    const parseCSV = (text: string) => {
      const rows: string[][] = [];
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        const row: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];
          
          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              // Handle escaped quotes ("")
              current += '"';
              i++; // Skip next quote
            } else {
              // Toggle quote state
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            // End of field
            row.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        
        // Add last field
        row.push(current.trim());
        rows.push(row);
      }
      
      return rows;
    };
    
    const rows = parseCSV(csvData);
    
    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row and map data
    const dataRows = rows.slice(1).filter((row: string[]) => row.length >= 5 && row[0]);
    
    return dataRows.map((row: string[]) => ({
      id: row[0] || '',
      name: row[1] || '',
      url: row[2] || '',
      latitude: parseFloat(row[3]) || 0,
      longitude: parseFloat(row[4]) || 0,
      category: row[5] || '',
      subcategory: row[6] || '',
      description: row[7] || ''
    })).filter((point: MapDataPoint) => point.latitude !== 0 && point.longitude !== 0);
    
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw new Error('Failed to fetch data from Google Sheets. Make sure the sheet is publicly accessible.');
  }
};