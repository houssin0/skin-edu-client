import { AppBar, Box, IconButton, styled, Toolbar, useMediaQuery } from "@mui/material";
import { SettingsContext } from "contexts/settingsContext";
// import MenuLeft from "icons/MenuLeft";
// import MenuLeftRight from "icons/MenuLeftRight";
// import SearchIcon from "icons/SearchIcon";
import ThemeIcon from "icons/ThemeIcon";
import { Fragment, useContext } from "react";
import LanguagePopover from "./popovers/LanguagePopover";
// import NotificationsPopover from "./popovers/NotificationsPopover";
import ProfilePopover from "./popovers/ProfilePopover";
// import ServicePopover from "./popovers/ServicePopover";
// import SearchBar from "./SearchBar"; // ------------------------------------------------

// ------------------------------------------------
// custom styled components
const DashboardHeaderRoot = styled(AppBar)(({
  theme
}) => ({ 
  zIndex: 11,
  boxShadow: "none",
  paddingTop: "1rem",
  paddingBottom: "1rem",
  backdropFilter: "blur(6px)",
  backgroundColor: "transparent",
  color: theme.palette.text.primary
}));
const StyledToolBar = styled(Toolbar)(() => ({
  "@media (min-width: 0px)": {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: "auto"
  }
}));
const StyledIconButton = styled(IconButton)(({
  theme
}) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  }
}));
const ToggleIcon = styled(Box)(({
  theme,
  width
}) => ({
  height: 3,
  margin: "5px",
  marginLeft: 0,
  width: width || 25,
  borderRadius: "10px",
  transition: "width 0.3s",
  backgroundColor: theme.palette.primary.main
}));

const DashboardHeader = props => {
  const {
    setShowMobileSideBar
  } = props;
  // const [openSearchBar, setSearchBar] = useState(false);
  const {
    settings,
    saveSettings
  } = useContext(SettingsContext);
  const upSm = useMediaQuery(theme => theme.breakpoints.up("sm"));
  const downMd = useMediaQuery(theme => theme.breakpoints.down(1200));

  // const handleChangeDirection = value => {
  //   saveSettings({ ...settings,
  //     direction: value
  //   });
  // };

  const handleChangeTheme = value => {
    saveSettings({ ...settings,
      theme: value
    });
  };

  return <DashboardHeaderRoot position="sticky">
      <StyledToolBar>
        {downMd && <Box sx={{
        cursor: "pointer"
      }} onClick={setShowMobileSideBar}>
            <ToggleIcon />
            <ToggleIcon width={18} />
            <ToggleIcon width={9} />
          </Box>}

        {/* <ClickAwayListener onClickAway={() => setSearchBar(false)}>
          <Box>
            {!openSearchBar && <StyledIconButton onClick={() => setSearchBar(true)}>
                <SearchIcon sx={{
              color: "text.disabled"
            }} />
              </StyledIconButton>}

            <SearchBar open={openSearchBar} handleClose={() => setSearchBar(false)} />
          </Box>
        </ClickAwayListener> */}

        <Box flexGrow={1} ml={1} />

        {/* {settings.direction === "rtl" ? <StyledIconButton onClick={() => handleChangeDirection("ltr")}>
            <MenuLeft sx={{
          color: "text.disabled"
        }} />
          </StyledIconButton> : <StyledIconButton onClick={() => handleChangeDirection("rtl")}>
            <MenuLeftRight sx={{
          color: "text.disabled"
        }} />
          </StyledIconButton>} */}

        {settings.theme === "light" ? <StyledIconButton onClick={() => handleChangeTheme("dark")}>
            <ThemeIcon />
          </StyledIconButton> : <StyledIconButton onClick={() => handleChangeTheme("light")}>
            <ThemeIcon />
          </StyledIconButton>}

        {upSm && <Fragment>
            <LanguagePopover />
            {/* <NotificationsPopover /> */}
            {/* <ServicePopover /> */}
          </Fragment>}
        <ProfilePopover />
      </StyledToolBar>
    </DashboardHeaderRoot>;
};

export default DashboardHeader;