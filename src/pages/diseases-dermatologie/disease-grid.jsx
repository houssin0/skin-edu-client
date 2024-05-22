import { Box, Button, Grid, styled } from "@mui/material";
import DiseaseCard from "./disease-card";
import React, { useState, useContext, useEffect } from "react";
import AuthContext from "contexts/JWTAuth";
import FlexBox from "components/flexbox/FlexBox";
import { useNavigate } from "react-router-dom";
import SearchInput from "components/input-fields/SearchInput";
import Add from "icons/Add";
import { useTranslation } from "react-i18next"; // styled components

// Styled component for the container box
const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledFlexBox = styled(FlexBox)(({ theme }) => ({
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: 20,
  [theme.breakpoints.down(500)]: {
    width: "100%",
    "& .MuiButton-root": {
      width: "100%",
      marginTop: 15,
    },
  },
}));

// Styled component for the grid container
const StyledGridContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const DiseaseGrid = () => {
  const [diseaseList, setDiseaseList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/diseases', {
          headers: {
            'Authorization': accessToken // Include the accessToken in the Authorization header
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch diseases');
        }
        const data = await response.json();
        setDiseaseList(data);
      } catch (error) {
        console.error('Error fetching diseases:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDiseases = diseaseList.filter(disease => 
    disease.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StyledContainer>
      <StyledFlexBox>
        <SearchInput 
          placeholder="Search diseases..." 
          value={searchQuery} 
          onChange={handleSearchChange} 
        />
        <Box>
          {(user.userType === 'admin' || user.userType === 'med_teacher') &&
            <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/add-disease")}>
              {t("Add New Disease")}
            </Button>
          }
        </Box>
      </StyledFlexBox>
      <StyledGridContainer container spacing={3}>
        {filteredDiseases.map((disease, index) => (
          <Grid item xs={12} sm={6} md={4} key={disease.id}>
            <DiseaseCard disease={disease} />
          </Grid>
        ))}
      </StyledGridContainer>
    </StyledContainer>
  );
};

export default DiseaseGrid;
