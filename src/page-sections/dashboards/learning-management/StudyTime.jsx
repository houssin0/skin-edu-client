import { Card, styled, useTheme } from "@mui/material";
import { H5 } from "components/Typography";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { chartBarOptions } from "../chart-options";

// Styled components
export const StyledChart = styled(Chart)(({ theme }) => ({
  minHeight: "250px !important",
  "& .apexcharts-tooltip *": {
    fontWeight: 500,
    fontFamily: theme.typography.fontFamily
  },
  "& .apexcharts-tooltip": {
    boxShadow: "none",
    borderRadius: 8,
    alignItems: "center",
    border: `1px solid ${theme.palette.primary[100]}`
  },
  "& .apexcharts-tooltip.apexcharts-theme-light": {
    border: `1px solid ${theme.palette.primary[100]}`
  },
  "& .apexcharts-tooltip-text-y-value": {
    fontWeight: 700
  },
  "& .apexcharts-legend.apx-legend-position-bottom.apexcharts-align-center": {
    justifyContent: "space-evenly"
  },
  "& .apexcharts-legend-marker": {
    borderRadius: "50% !important",
    marginRight: 5
  }
}));

const StudyTime = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [chartSeries, setChartSeries] = useState([]);
  const chartCategories = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const options = chartBarOptions(theme, chartCategories);
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/quiz-results', {
          headers: {
            'Authorization': accessToken
          }
        });
    
        if (response.ok) {
          const results = await response.json();
          const updatedSeries = results.map(result => ({
            name: result.quizTitle,
            data: [result.score] // Always wrap data in an array
          }));
          setChartSeries(updatedSeries);
        } else {
          console.error('Failed to fetch quiz results:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizResults();
  }, []);
  

  return (
    <Card sx={{ padding: 3, height: "100%" }}>
      <H5 mb={1}>{t("Study Time Last Week")}</H5>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <StyledChart type="bar" options={{ ...options, colors: generateColors(chartSeries.length) }} series={chartSeries} height={260} />
      )}
    </Card>
  );
};

const generateColors = (count) => {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#33FFF3", "#FF8333",
    "#33FF83", "#FF3380", "#8033FF", "#FF3357", "#3380FF", "#FF5733", "#57FF33"
  ];

  // If the count of series is more than the length of the colors array, loop through the colors
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

export default StudyTime;
