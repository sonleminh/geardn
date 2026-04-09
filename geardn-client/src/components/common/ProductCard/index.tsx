import StarRateIcon from "@mui/icons-material/StarRate";
import { Box, Typography } from "@mui/material";

import { IProduct } from "@/interfaces/IProduct";
import { truncateTextByLine } from "@/utils/css-helper.util";
import { formatPrice } from "@/utils/format-price";
import { getTagStyle } from "@/utils/getTagStyle";

import AppLink from "../AppLink";
import SkeletonImage from "../SkeletonImage";
import React from "react";

const ProductCard = ({ data }: { data: IProduct }) => {
  const fallbackImage = "/icon.png";
  const productImageUrl = data?.images?.[0] || fallbackImage;

  return (
    <AppLink href={`/${data?.category?.slug}/${data?.slug}`}>
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid rgba(234, 236, 240, 1)",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          ":hover": {
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1)",
            "& .product-img-inner": {
              transform: "scale(1.05)",
            },
          },
        }}
      >
        <Box
          className="product-img"
          sx={{
            position: "relative",
            width: "100%",
            height: {
              xs: "180px",
              sm: "220px",
              md: "230px",
              lg: "250px",
              xl: "285px",
            },
            overflow: "hidden",
            "& img": {
              objectFit: "cover",
              transition: "transform 0.5s ease",
            },
          }}
        >
          <SkeletonImage
            src={productImageUrl}
            alt={data?.name || "Sản phẩm GearDN"}
            fill
            className="product-img-inner"
            sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
          />
        </Box>

        <Box
          sx={{
            p: "12px",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Typography
            component="h3"
            sx={{
              minHeight: { xs: "40px", md: "44px" },
              mb: 1,
              fontSize: { xs: 13, md: 14 },
              fontWeight: 500,
              ...truncateTextByLine(2),
            }}
          >
            {data?.name}
          </Typography>

          {data?.tags && data.tags.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px", mb: 1 }}>
              {data.tags.map((tag) => {
                const style = getTagStyle(tag.value);
                return (
                  <Typography
                    key={tag.value || tag.label}
                    component="span"
                    sx={{
                      padding: "2px 4px",
                      bgcolor: style.bgcolor,
                      color: style.color,
                      lineHeight: "16px",
                      fontSize: "10px",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      border: `1px solid ${style.borderColor}`,
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

          <Box sx={{ mt: "auto" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.5,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center" }}
                aria-label="Đánh giá 5 sao"
              >
                <StarRateIcon
                  sx={{ mr: 0.5, color: "#F19B4C", fontSize: 18 }}
                />
                <Typography sx={{ fontSize: { xs: 12, md: 13 } }}>
                  5.0{" "}
                  <Typography
                    component={"span"}
                    sx={{
                      display: { xs: "none", md: "inline-block" },
                      fontSize: 13,
                    }}
                  >
                    (2)
                  </Typography>
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: { xs: 14, md: 16 },
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              {formatPrice(data?.priceMin) ?? "Đang cập nhật"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </AppLink>
  );
};

export default React.memo(ProductCard);
