import { Box, Grid, Typography } from "@mui/material";
// import Acquisitions from "page-sections/dashboards/job-management/Acquisitions";
// import Application from "page-sections/dashboards/job-management/Application";
// import Candidates from "page-sections/dashboards/job-management/Candidates";
// import CommonCard from "page-sections/dashboards/job-management/CommonCard";
// import JobList from "page-sections/dashboards/job-management/JobList";
// import ProfileCard from "page-sections/dashboards/job-management/ProfileCard";
// import RecentJob from "page-sections/dashboards/job-management/RecentJob";
import UpgradeCard from "page-sections/dashboards/learning-management/UpgradeCard";
import ensamLogo from "./ensamcasa.png";
import facultemedcin from "./facultemedcin.jpg";
import idms from "./idms.png";

const JobManagement = () => {
  // const theme = useTheme(); 
  // const cardList = [{
  //   id: 1,
  //   trend: 14,
  //   amount: 272,
  //   progress: 70,
  //   title: "Total Applications",
  //   color: theme.palette.primary.main
  // }, {
  //   id: 2,
  //   trend: 6,
  //   amount: 20,
  //   progress: 50,
  //   title: "Shortlisted",
  //   color: theme.palette.info.main
  // }];
  return <Box pt={2} pb={4}>
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
          <UpgradeCard />
        </Grid>
            {/* {cardList.map(item => <Grid item md={6} xs={12} key={item.id}>
                <CommonCard card={item} />
              </Grid>)}

            <Grid item md={8} xs={6}>
              <RecentJob />
            </Grid>
 <Grid item md={4} xs={6}>
          <Candidates />
        </Grid> */}
          </Grid>

{/*         

        <Grid item md={12} xs={4}>
          <Application />
        </Grid>
      </Grid> */}
    </Box>;
};

export default JobManagement;