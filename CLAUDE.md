# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React TypeScript web application that displays map data from Google Spreadsheets using Leaflet maps. The app allows users to configure a Google Sheets connection and visualizes the data as markers on an interactive map.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit
```

## Architecture

### Core Components
- **App.tsx**: Main application component managing state and data flow
- **MapView.tsx**: Interactive map component using react-leaflet
- **ConfigForm.tsx**: Form for Google Sheets configuration

### Services
- **googleSheets.ts**: Handles fetching data from Google Sheets API

### Types
- **types/index.ts**: TypeScript interfaces for MapDataPoint and SheetConfig

## Google Sheets Integration

The application expects spreadsheet data in this format:
- Column A: Name
- Column B: Latitude  
- Column C: Longitude
- Column D: Description (optional)
- Column E: Category (optional)

## Required Setup

To use this application, users need:
1. A public Google Sheet with location data
2. A Google Sheets API key from Google Cloud Console
3. The Google Sheet must be publicly accessible or shared appropriately