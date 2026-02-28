import StarRateIcon from "@mui/icons-material/StarRate";
import { Box, Typography } from "@mui/material";

import { IProduct } from "@/interfaces/IProduct";
import { truncateTextByLine } from "@/utils/css-helper.util";
import { formatPrice } from "@/utils/format-price";

import AppLink from "../AppLink";
import SkeletonImage from "../SkeletonImage";
import { getTagStyle } from "@/utils/getTagStyle";

const ProductCard = ({ data }: { data: IProduct }) => {
  return (
    <AppLink href={`${data?.category?.slug}/${data?.slug}`}>
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid rgba(234, 236, 240, 1)",
          borderRadius: "8px",
          overflow: "hidden",
          ":hover": {
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1)",
            "& img": {
              transform: "scale(1.05)",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: "250px" },
            overflow: "hidden",
            "& img": {
              objectFit: "cover",
              transition: "all 0.5s ease",
            },
          }}
          className="product-img"
        >
          <SkeletonImage src={data?.images[0]} alt="geardn" fill />
        </Box>

        <Box sx={{ p: "12px" }}>
          <Typography
            sx={{
              height: { xs: "auto", md: 42 },
              mb: 1,
              fontSize: { xs: 13, md: 14 },
              fontWeight: 500,
              ...truncateTextByLine(2),
            }}
          >
            {data?.name}
          </Typography>
          {data?.tags && data.tags.length > 0 && (
            <Box
              sx={{
                display: "flex",
                mb: 1,
              }}
            >
              {data.tags.map((tag, index) => {
                const style = getTagStyle(tag.value);
                return (
                  <Typography
                    key={index}
                    component="span"
                    sx={{
                      padding: "2px 4px",
                      marginLeft: index > 0 ? "4px" : 0,
                      bgcolor: style.bgcolor,
                      color: style.color,
                      lineHeight: "16px",
                      fontSize: "10px",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: style.borderColor,
                      borderRadius: "2px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    }}
                  >
                    {tag.label}
                  </Typography>
                );
              })}
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StarRateIcon sx={{ mr: 0.5, color: "#F19B4C", fontSize: 18 }} />
              <Typography sx={{ fontSize: { xs: 12, md: 13 } }}>
                5.0{" "}
                <Typography
                  component={"span"}
                  sx={{
                    display: { xs: "none", md: "inline-block" },
                    fontSize: 13,
                  }}
                >
                  (2 reviews)
                </Typography>
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: { xs: 14, md: 16 }, fontWeight: 600 }}
              >
                {formatPrice(data?.priceMin) ?? "Đang cập nhật"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppLink>
  );
};

export default ProductCard;
