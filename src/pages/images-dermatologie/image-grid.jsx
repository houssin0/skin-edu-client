import React, { useState, useContext, useEffect } from "react";
import { Box, Button, Grid, styled, MenuItem, Menu, Pagination } from "@mui/material";
import FlexBox from "components/flexbox/FlexBox";
import ImageCard from "./image-card";
import { useNavigate, useLocation } from "react-router-dom";
import SearchInput from "../../components/input-fields/SearchInput"; // Import the SearchInput component
import AuthContext from "contexts/JWTAuth";
import Add from "icons/Add";
import { useTranslation } from "react-i18next"; 
 
const StyledFlexBox = styled(FlexBox)(({ theme }) => ({
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: 20,
  [theme.breakpoints.down(500)]: {
    width: "100%",
    "& .MuiInputBase-root": { maxWidth: "100%" },
    "& .MuiButton-root": {
      width: "100%",
      marginTop: 15,
    },
  },
}));

const ImageGrid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState("Filter");
  const [sortOption, setSortOption] = useState("Sort");
  const [imageList, setImageList] = useState([]);
  const [diseaseTitles, setDiseaseTitles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const imagesPerPage = 40;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/images', {
          headers: {
            'Authorization': accessToken
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setImageList(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDiseaseTitles = async () => {
      try {
        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/diseases-titles');
        if (!response.ok) {
          throw new Error('Failed to fetch disease titles');
        }
        const data = await response.json();
        setDiseaseTitles(data);
      } catch (error) {
        console.error('Error fetching disease titles:', error);
      }
    };
    fetchDiseaseTitles();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const option = params.get('option') || 'Sort';
    const disease = params.get('disease') || 'Filter';
    const page = parseInt(params.get('page'), 10) || 1;
    const query = params.get('query') || '';
    setSortOption(option);
    setSelectedDisease(disease);
    setCurrentPage(page);
    setSearchQuery(query);
  }, [location.search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setFilterAnchorEl(null);
    setSortAnchorEl(null);
  };

  const handleDiseaseSelect = (disease) => {
    setSelectedDisease(disease);
    setFilterAnchorEl(null);
    const params = new URLSearchParams(location.search);
    if (disease !== "Filter") {
      params.set('disease', disease);
    } else {
      params.delete('disease');
    }
    params.set('page', 1); // Reset to first page
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleSort = (option) => {
    setSortOption(option);
    setSortAnchorEl(null);
    const params = new URLSearchParams(location.search);
    if (option !== "None") {
      params.set('option', option);
    } else {
      params.delete('option');
    }
    params.set('page', 1); // Reset to first page
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    const params = new URLSearchParams(location.search);
    if (value === 1) {
      params.delete('page');
    } else {
      params.set('page', value);
    }
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const params = new URLSearchParams(location.search);
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
      params.set('page', 1); // Reset to first page when search query is cleared
    }
    navigate(`?${params.toString()}`, { replace: true });
  };
  

  const sortedImages = imageList.sort((a, b) => {
    switch (sortOption) {
      case "Name":
        return a.title.localeCompare(b.title);
      case "Newest First":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "Oldest First":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      default:
        return 0;
    }
  });

  const filteredImages = sortedImages.filter((image) =>
    (selectedDisease === "Filter" || image.diseaseTitle === selectedDisease) &&
    image.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);

  return (
    <Box pt={2} pb={4}>
      <StyledFlexBox>
        <Box>
          <SearchInput
            placeholder="Search by image title"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Box>
        <Box>
          <Button variant="outlined" onClick={handleFilterClick}>
            {selectedDisease}
          </Button>
          <Menu
            id="filter-menu"
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleDiseaseSelect("Filter")}>All</MenuItem>
            {diseaseTitles.map((title) => (
              <MenuItem key={title} onClick={() => handleDiseaseSelect(title)}>{title}</MenuItem>
            ))}
          </Menu>
        </Box>
        <Box>
          <Button variant="outlined" onClick={handleSortClick}>
            {sortOption}
          </Button>
          <Menu
            id="sort-menu"
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleSort("None")}>None</MenuItem>
            <MenuItem onClick={() => handleSort("Name")}>Name</MenuItem>
            <MenuItem onClick={() => handleSort("Newest First")}>Newest First</MenuItem>
            <MenuItem onClick={() => handleSort("Oldest First")}>Oldest First</MenuItem>
          </Menu>
        </Box>
        <Box>
          {(user.userType === 'admin' || user.userType === 'med_teacher') &&
            <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/add-image")}>
               {t("Add New Image")}
            </Button>
          }

        </Box>
      </StyledFlexBox>

      <Grid container spacing={3}>
        {currentImages.map((image, index) => (
          <Grid item xs={12} sm={6} md={3} key={image.id}>
            <ImageCard image={image} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredImages.length / imagesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ImageGrid;
