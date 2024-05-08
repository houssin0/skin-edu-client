import { Box, Grid, styled } from "@mui/material";
import DiseaseCard from "./disease-card";
import React, { useState, useEffect } from "react";

// Styled component for the container box
const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// Styled component for the grid container
const StyledGridContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const DiseaseGrid = () => {
  const [diseaseList, setDiseaseList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/diseases');
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

  return (
    <StyledContainer>
      <StyledGridContainer container spacing={3}>
        {diseaseList.map((disease, index) => (
          <Grid item xs={12} sm={6} md={4} key={disease.id}>
            <DiseaseCard disease={disease} />
          </Grid>
        ))}
      </StyledGridContainer>
    </StyledContainer>
  );
};

export default DiseaseGrid;
