import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { H1, Paragraph } from "components/Typography";
import React from "react";
import { lightTheme } from "../../constants";


const ContentSlider = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Box sx={{ textAlign: "center" }}>
      <H1 sx={{ mb: 3, fontSize:"3rem", fontFamily: "Space Grotesk", lineHeight: 1.2 }}>Be a part of India's <br/> Favorite <br /> Marketplace</H1>
      <Paragraph sx={{fontSize: "1.2rem", fontFamily: "Proxima Nova", color: "black" }} >Do you sell products Made in INDIA? Want to <br /> be a part of India's Favorite Marketplace? <br /> Register now and be a part of Terrykart.com</Paragraph>
    </Box>
    </Box>
  )
};

export default ContentSlider;
