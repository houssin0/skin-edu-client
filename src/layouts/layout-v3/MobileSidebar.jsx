import { Box, Grid, styled } from "@mui/material";
import Scrollbar from "components/ScrollBar";
import LayoutDrawer from "layouts/layout-parts/LayoutDrawer";
import MultiLevelMenu from "./MultiLevelMenu";

const TOP_HEADER_AREA = 70;

const NavWrapper = styled(Box)(() => ({
  paddingLeft: 16,
  paddingRight: 16,
  height: "100%"
}));

const StyledLogo = styled(Box)(() => ({
  paddingLeft: 8,
  fontWeight: 700,
  fontSize: 20
}));

const MobileSidebar = (props) => {
  const { sidebarCompact, showMobileSideBar, setShowMobileSideBar } = props;

  return (
    <LayoutDrawer open={showMobileSideBar} onClose={setShowMobileSideBar}>
      <Box p={2} maxHeight={TOP_HEADER_AREA}>
        <Grid container alignItems="center">
          <Grid item>
            <img src="/static/logo/SkinEdu.png" alt="logo" width={18} />
          </Grid>
          <Grid item>
            <StyledLogo>SkinEdu</StyledLogo>
          </Grid>
        </Grid>
      </Box>

      <Scrollbar autoHide clickOnTrack={false} sx={{ overflowX: "hidden", maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)` }}>
        <NavWrapper compact={sidebarCompact}>
          <MultiLevelMenu sidebarCompact={false} />
        </NavWrapper>
      </Scrollbar>
    </LayoutDrawer>
  );
};

export default MobileSidebar;
