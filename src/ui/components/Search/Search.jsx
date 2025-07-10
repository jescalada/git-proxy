import React from 'react';
import { TextField } from '@mui/material';
import './Search.css';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

export default function Search({ onSearch }) {
  const handleSearchChange = (event) => {
    const query = event.target.value;
    onSearch(query);
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <TextField
        label='Search'
        variant='outlined'
        fullWidth
        margin='normal'
        onChange={handleSearchChange}
        placeholder='Search...'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}
