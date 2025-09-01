import { useState } from 'react';

interface NavigationProps {
  onSearch?: (searchTerm: string) => void;
}

export const Navigation = ({ onSearch }: NavigationProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value); // Real-time search
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: '#007bff',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      borderBottom: '1px solid #dee2e6',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Left: Title */}
      <h1 style={{ 
        margin: 0, 
        fontSize: '24px', 
        color: 'white',
        fontWeight: 'bold',
        minWidth: 'fit-content'
      }}>
        SVMBC Scout Outings
      </h1>

      {/* Right: Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search locations..."
            style={{
              padding: '8px 40px 8px 12px',
              borderRadius: '20px',
              border: '1px solid #ced4da',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              width: '300px',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.backgroundColor = 'white';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ced4da';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#6c757d',
              padding: '4px'
            }}
          >
            🔍
          </button>
        </div>
      </form>
    </nav>
  );
};