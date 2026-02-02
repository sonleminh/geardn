import { memo } from "react";
import { Box } from "@mui/material";

const HtmlRenderBox = ({ html }: { html: string | TrustedHTML }) => {
  return (
    <Box
      sx={{
        maxHeight: "100%",
        maxWidth: "100%",
        "*:has(table)": {
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
        },

        "figure.image": {
          textAlign: "center",
        },

        "& table, th, td": {
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        },

        "& img": {
          maxWidth: "100%",
          height: "auto",
        },
      }}
      dangerouslySetInnerHTML={{
        __html: html ? String(html) : "Đang cập nhật...",
      }}
    />
  );
};

export default memo(HtmlRenderBox);
