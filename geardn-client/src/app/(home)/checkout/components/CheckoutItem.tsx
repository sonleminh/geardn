import { Box, Typography } from "@mui/material";

import SkeletonImage from "@/components/common/SkeletonImage";

import { formatPrice } from "@/utils/format-price";

import { truncateTextByLine } from "@/utils/css-helper.util";
import "react-datepicker/dist/react-datepicker.css";
import { ICartStoreItem } from "@/interfaces/ICart";

interface Props {
  item: ICartStoreItem;
  index: number;
}

const CheckoutItem = ({ item, index }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pt: 2,
        pb: 3,
        borderTop: index !== 0 ? "1px solid #f3f4f6" : "none",
      }}
      key={item.skuId}
    >
      <Box sx={{ display: "flex", alignItems: "center", flex: 7 }}>
        <Box
          sx={{
            position: "relative",
            width: { xs: 60, md: 60 },
            height: { xs: 60, md: 60 },
            mr: { xs: 1, md: 2 },
            borderRadius: "4px",
            border: "1px solid #d1d5db",
            overflow: "hidden",
            flexShrink: 0,
            ".cart-item": { objectFit: "cover" },
          }}
        >
          <SkeletonImage
            src={item?.imageUrl}
            alt={item?.productName}
            fill
            className="cart-item"
          />
        </Box>
        <Box>
          <Typography
            sx={{
              maxHeight: "32px",
              mb: 0.5,
              fontSize: { xs: 13, md: 14 },
              lineHeight: "16px",
              ...truncateTextByLine(2),
            }}
          >
            {item.productName}
          </Typography>
          {item?.attributes?.length > 0 && (
            <Typography
              sx={{
                display: "inline-block",
                px: "6px",
                py: "2px",
                bgcolor: "#f3f4f6",
                fontSize: 11,
                borderRadius: 0.5,
              }}
            >
              {item?.attributes?.map((item) => item?.attributeValue).join(", ")}
            </Typography>
          )}
        </Box>
      </Box>
      <Typography
        sx={{
          flex: 2,
          width: 120,
          textAlign: "center",
          fontSize: { xs: 13, md: 14 },
        }}
      >
        {formatPrice(item?.sellingPrice)}
      </Typography>
      <Typography
        sx={{
          flex: { xs: 1, md: 2 },
          width: 88,
          fontSize: { xs: 13, md: 14 },
          textAlign: "center",
        }}
      >
        {item?.quantity}
      </Typography>
      <Typography
        sx={{
          display: { xs: "none", md: "block" },
          flex: 2,
          width: 120,
          textAlign: "center",
          fontSize: 14,
        }}
      >
        {formatPrice(item?.sellingPrice * item.quantity)}
      </Typography>
    </Box>
  );
};

export default CheckoutItem;
