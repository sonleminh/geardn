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
    cartItemId?: number,
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
    item?.quantity ? item.quantity.toString() : "1",
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
        item.cartItemId,
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
    <Grid2 container alignItems="center" sx={{ py: { xs: 1.5, sm: 2 } }}>
      <Grid2 size={{ xs: 1.2, md: 1 }} textAlign="center">
        <Checkbox
          size="small"
          checked={checked}
          onClick={(e) => onSelect(e, item.skuId)}
          sx={{
            color: "text.primary",
            "&.Mui-checked": { color: "text.primary" },
          }}
        />
      </Grid2>

      <Grid2 size={{ xs: 10.8, md: 5 }}>
        <Box display="flex" gap={1.2}>
          <Box
            sx={{
              position: "relative",
              width: { xs: 80, sm: 80 },
              height: { xs: 80, sm: 80 },
              flexShrink: 0,
              border: "1px solid #f5f5f5",
              borderRadius: 1,
              overflow: "hidden",
              ".product-image": { objectFit: "cover" },
            }}
          >
            <SkeletonImage
              src={item?.imageUrl}
              alt={item?.productName}
              fill
              className="product-image"
            />
            {stock && stock < 10 && (
              <Typography
                sx={{
                  position: "absolute",
                  bottom: 0,
                  display: "inline-block",
                  width: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.4)",
                  color: "#fff",
                  fontSize: 10,
                  textAlign: "center",
                }}
              >
                Chỉ còn {stock}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  mb: 0.2,
                  fontSize: 14,
                  lineHeight: "18px",
                  ...truncateTextByLine(1),
                  pr: 1,
                }}
              >
                {item?.productName}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {item?.attributes?.length ? (
                <Box
                  sx={{
                    bgcolor: "#f5f5f5",
                    px: 1,
                    py: 0.2,
                    mt: 0.5,
                    borderRadius: 1,
                    border: "1px solid #e9e9e9",
                    width: "fit-content",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: 12 }}>
                    {item?.attributes
                      ?.map((attr) => attr?.attributeValue)
                      .join(", ")}
                  </Typography>
                </Box>
              ) : null}
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ButtonBase
                    onClick={() =>
                      onUpdateQty(
                        item.skuId,
                        item.productName,
                        item.quantity - 1,
                        item.quantity,
                        item.cartItemId,
                      )
                    }
                    sx={{
                      width: 24,
                      height: 24,
                      "&:hover": { bgcolor: "grey.50" },
                    }}
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
                        width: "24px",
                      },
                    }}
                    sx={{
                      height: 24,
                      bgcolor: "#f5f5f5",
                      fontSize: "12px",
                      borderRadius: 1,
                    }}
                  />
                  <ButtonBase
                    onClick={() =>
                      onUpdateQty(
                        item.skuId,
                        item.productName,
                        item.quantity + 1,
                        item.quantity,
                        item.cartItemId,
                      )
                    }
                    sx={{
                      width: 28,
                      height: 24,
                      "&:hover": { bgcolor: "grey.50" },
                    }}
                  >
                    +
                  </ButtonBase>
                </Box>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1, minHeight: { xs: 7, md: 0 } }} />{" "}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Typography
                sx={{
                  color: "#000",
                  fontSize: { xs: 14, md: 15 },
                  fontWeight: { xs: 600, md: 500 },
                }}
              >
                {formatPrice(item?.sellingPrice)}
              </Typography>
              <Typography
                onClick={() => onRemove(item.skuId, item.cartItemId)}
                sx={{
                  display: { xs: "block", md: "none" },
                  mr: 1,
                  fontSize: 12,
                  color: "text.secondary",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Xóa
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid2>

      <Grid2
        size={{ xs: 0, md: 2 }}
        sx={{ display: { xs: "none", md: "block" } }}
        textAlign="center"
      >
        <Typography fontSize={14}>{formatPrice(item?.sellingPrice)}</Typography>
      </Grid2>

      <Grid2
        size={{ xs: 0, md: 2 }}
        sx={{ display: { xs: "none", md: "grid" } }}
      >
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
                  item.cartItemId,
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
                  item.cartItemId,
                )
              }
              sx={{ px: 1.5, py: 0.5, "&:hover": { bgcolor: "grey.50" } }}
            >
              +
            </ButtonBase>
          </Box>
          {stock < 10 && (
            <Typography sx={{ mt: 0.5, fontSize: 11, color: "orange" }}>
              Còn {stock} sản phẩm
            </Typography>
          )}
        </Box>
      </Grid2>

      <Grid2
        size={{ xs: 0, md: 2 }}
        sx={{ display: { xs: "none", md: "grid" } }}
        textAlign="center"
      >
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
  return (
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.checked === nextProps.checked &&
    prevProps.stock === nextProps.stock
  );
});
