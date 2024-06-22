import { Box, Grid, useTheme, Typography } from "@mui/material";
import DoneIcon from "icons/DoneIcon";
import HourGlassIcon from "icons/HourGlassIcon";
import UserAddIcon from "icons/UserAddIcon";
import UserBigIcon from "icons/UserBigIcon";
import ThemeIcon from "icons/ThemeIcon";
import User from "icons/User";
import LeadCard from "page-sections/dashboards/CRM/LeadCard";
import LeadVSCustomer from "page-sections/dashboards/CRM/LeadVSCustomer";
import LongCard from "page-sections/dashboards/CRM/LongCard";
import ProjectStatus from "page-sections/dashboards/CRM/ProjectStatus";
import ensamLogo from "./ensamcasa.png";
import facultemedcin from "./facultemedcin.jpg";
import idms from "./idms.png";

const CRM = () => {
  const theme = useTheme();

  const list1 = [
    {
      id: 1,
      amount: 80,
      Icon: ThemeIcon,
      title: "Quiz Completed",
      color: theme.palette.primary.main
    },
    {
      id: 2,
      amount: 150,
      Icon: User,
      title: "Teachers",
      color: theme.palette.info.main
    },
    {
      id: 3,
      amount: 22,
      Icon: User,
      title: "Students",
      color: theme.palette.text.disabled
    }
  ];

  const list2 = [
    {
      id: 1,
      amount: 150,
      Icon: UserAddIcon,
      title: "New Users",
      color: theme.palette.primary.main
    },
    {
      id: 2,
      amount: 200,
      Icon: UserBigIcon,
      title: "Online Users",
      color: theme.palette.warning.main
    },
    {
      id: 3,
      amount: 350,
      Icon: DoneIcon,
      title: "Approved Users",
      color: theme.palette.info.main
    },
    {
      id: 4,
      amount: 20,
      Icon: HourGlassIcon,
      title: "Not Approved",
      color: theme.palette.error.main
    }
  ];

  return (
    <Box pt={2} pb={4}>
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
      
      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <LeadCard />
        </Grid>
        
        <Grid item md={8} xs={12}>
          <LongCard list={list2} />
        </Grid>

        <Grid item md={8} xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LeadVSCustomer />
            </Grid>

            <Grid item xs={12}>
              <LongCard list={list1} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={4} xs={12}>
          <ProjectStatus />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CRM;
