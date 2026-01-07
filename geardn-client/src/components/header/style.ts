import { keyframes, SxProps, Theme } from "@mui/material";

export const HeaderStyle: (
  isExpanded: boolean,
  pathname: string
) => SxProps<Theme> = (isExpanded: boolean, pathname: string) => ({
  position: { xs: "unset", md: "fixed" },
  left: { xs: "0", md: "50%" },
  transform: { xs: "translateX(0)", md: "translateX(-50%)" },
  zIndex: 69,
  width: isExpanded || pathname !== "/" ? "100%" : { xs: "100%", md: "1070px" },
  height: { xs: 68, md: 80 },
  bgcolor: isExpanded || pathname !== "/" ? "#fff" : { xs: "#fff", md: "none" },
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  animation: isExpanded ? `${slideDown} 0.2s ease-out` : "none",
  ".header-main": {
    position: "fixed",
    top: 0,
    left: { xs: "0", md: "50%" },
    transform: { xs: "translateX(0)", md: "translateX(-50%)" },
    zIndex: 69,

    display: "block",
    width: { xs: "100%", lg: 1200, xl: 1200 },
    height: { xs: 68, md: 80 },
    px: { xs: 0.5, md: 3 },

    bgcolor: "white",
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
    ".header-logo": {
      position: "relative",
      width: "145px",
      height: { xs: "60.5px" },
      borderRadius: 2,
      overflow: "hidden",
      "& img": {
        objectFit: "cover",
      },
    },
    ".user-avatar": {
      position: "relative",
      minWidth: "30px",
      height: { xs: "30px" },
      borderRadius: "50%",
      overflow: "hidden",
      "& img": {
        objectFit: "cover",
      },
    },
  },
});

const slideDown = keyframes`
 from {
    transform: translate(-50%,-100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%,0);
    opacity: 1;
  }
`;
