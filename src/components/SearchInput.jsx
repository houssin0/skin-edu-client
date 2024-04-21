// searchinput.jsx
import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchInput = ({ images, onSearch }) => {
  const handleInputChange = (event) => {
    const value = event.target.value;
    onSearch(value); // Pass the search term to the parent component
  };

  return (
    <Autocomplete
      options={images}
      getOptionLabel={(image) => image.title}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          variant="outlined"
          placeholder="Search image..."
          style={{ minWidth: 200 }}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          onChange={handleInputChange}
        />
      )}
    />
  );
};

export default SearchInput;
