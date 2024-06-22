// import { NewReleases } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import ensamLogo from "./dashboards/ensamcasa.png";
import facultemedcin from "./dashboards/facultemedcin.jpg";
import idms from "./dashboards/idms.png";

const About = () => {
  return <Box py={4}>
      <Box textAlign="center" maxWidth={700} margin="auto">
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <Grid item>
          <img src={ensamLogo} alt="ENSAM Casablanca" width={100} />
        </Grid>
        <Grid item>
          <img src={idms} alt="IDMS Logo" width={100} />
        </Grid>
        <Grid item>
          <img src={facultemedcin} alt="CHU Ibn Rochd" width={100} />
        </Grid>
      </Grid>
      <Box textAlign="center" mt={2}>
        <Typography variant="h5">E-Learning en Dermatologie</Typography>
        <Typography variant="h6">Supervised by:</Typography>
        <Typography variant="h7">Mme. Zaz </Typography>
        <Typography variant="h7"> - Mr. HOUSBANE</Typography>
      </Box>
      </Box>
    </Box>;
};

export default About;