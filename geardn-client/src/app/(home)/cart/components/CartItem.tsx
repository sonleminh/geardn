"use client";

import SkeletonImage from "@/components/common/SkeletonImage";
import { ICartStoreItem } from "@/interfaces/ICart";
import {
  Box,
  Checkbox,
  Grid2,
  Typography,
  ButtonBase,
  InputBase,
} from "@mui/material";
import { truncateTextByLine } from "@/utils/css-helper.util";
import React, { useEffect, useState } from "react";
import { formatPrice } from "@/utils/format-price";

interface Props {
  item: ICartStoreItem;
  checked: boolean;
  stock: number;
  onUpdateQty: (
    skuId: number,
    name: string,
    newQty: number,
    oldQty: number,
    cartItemId?: number
  ) => void;
  onRemove: (skuId: number, cartItemId?: number) => void;
  onSelect: (event: React.MouseEvent<unknown>, id: number) => void;
}

function CartItem({
  item,
  checked,
  stock,
  onUpdateQty,
  onRemove,
  onSelect,
}: Props) {
  const [localQty, setLocalQty] = useState(
    item?.quantity ? item.quantity.toString() : "1"
  );

  useEffect(() => {
    if (item?.quantity !== undefined) {
      setLocalQty(item.quantity.toString());
    }
  }, [item.quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return;

    setLocalQty(value);
  };
  const commitChange = () => {
    const newQty = parseInt(localQty, 10);

    if (localQty === "" || isNaN(newQty) || newQty <= 0) {
      setLocalQty(item.quantity.toString());
      return;
    }

    if (newQty !== item.quantity) {
      onUpdateQty(
        item.skuId,
        item.productName,
        newQty,
        item.quantity,
        item.cartItemId
      );
    }
  };

  const handleBlur = () => {
    commitChange();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };
  return (
    <Grid2 container spacing={2} alignItems="center" sx={{ p: 2 }}>
      <Grid2 size={1} textAlign="center">
        <Checkbox
          checked={checked}
          onClick={(e) => onSelect(e, item.skuId)}
          sx={{
            color: "text.primary",
            "&.Mui-checked": {
              color: "text.primary",
            },
          }}
        />
      </Grid2>

      <Grid2 size={5}>
        <Box display="flex" gap={2} alignItems="center">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                position: "relative",
                width: 60,
                height: 60,
                mr: 2,
                flexShrink: 0,
                ".product-image": { objectFit: "cover" },
              }}
            >
              <SkeletonImage
                src={item?.imageUrl}
                alt={item?.productName}
                fill
                className="product-image"
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  maxHeight: "32px",
                  mb: 0.5,
                  fontSize: 14,
                  lineHeight: "16px",
                  ...truncateTextByLine(2),
                }}
              >
                {item?.productName}
              </Typography>
              {item?.attributes?.length ? (
                <Typography
                  sx={{
                    display: "inline-block",
                    px: "6px",
                    py: "2px",
                    bgcolor: "#f3f4f6",
                    fontSize: 11,
                    borderRadius: 0.5,
                    width: "fit-content",
                  }}
                >
                  {item?.attributes
                    ?.map((item) => item?.attributeValue)
                    .join(", ")}
                </Typography>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Grid2>

      <Grid2 size={2} textAlign="center">
        <Typography fontSize={14}>{formatPrice(item?.sellingPrice)}</Typography>
      </Grid2>

      <Grid2 size={2}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: 1,
              borderColor: "grey.300",
              borderRadius: 1,
            }}
          >
            <ButtonBase
              onClick={() =>
                onUpdateQty(
                  item.skuId,
                  item.productName,
                  item.quantity - 1,
                  item.quantity,
                  item.cartItemId
                )
              }
              sx={{ px: 1.5, py: 0.5, "&:hover": { bgcolor: "grey.50" } }}
            >
              -
            </ButtonBase>
            <InputBase
              value={localQty}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              inputProps={{
                style: {
                  textAlign: "center",
                  padding: 0,
                  width: "36px",
                  fontSize: "14px",
                },
              }}
              sx={{
                px: 1,
                py: 0.5,
                borderLeft: 1,
                borderRight: 1,
                borderColor: "grey.300",
                bgcolor: "white",
              }}
            />
            <ButtonBase
              onClick={() =>
                onUpdateQty(
                  item.skuId,
                  item.productName,
                  item.quantity + 1,
                  item.quantity,
                  item.cartItemId
                )
              }
              sx={{ px: 1.5, py: 0.5, "&:hover": { bgcolor: "grey.50" } }}
            >
              +
            </ButtonBase>
          </Box>
          {stock < 10 && (
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 11,
                color: "orange",
              }}
            >
              Còn {stock} sản phẩm
            </Typography>
          )}
        </Box>
      </Grid2>

      <Grid2 size={2} textAlign="center">
        <Typography
          variant="body2"
          onClick={() => onRemove(item.skuId, item.cartItemId)}
          sx={{
            cursor: "pointer",
            transition: "color 0.2s",
            "&:hover": { color: "error.main" },
          }}
        >
          Xóa
        </Typography>
      </Grid2>
    </Grid2>
  );
}

export default React.memo(CartItem, (prevProps, nextProps) => {
  // Only re-render this specific row IF its quantity changed OR its checkbox changed.
  // Otherwise, ignore the parent's re-render entirely!
  return (
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.checked === nextProps.checked &&
    prevProps.stock === nextProps.stock
  );
});
