"use client";

import { useEffect, useMemo, useState } from "react";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StarRateIcon from "@mui/icons-material/StarRate";
import {
  Box,
  Button,
  ButtonGroup,
  Grid2,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import AppLink from "@/components/common/AppLink";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import HtmlRenderBox from "@/components/common/HtmlRenderBox";

import { attributeLabels } from "@/constants/attributeLabels";
import { formatPrice } from "@/utils/format-price";

import { useSession } from "@/hooks/useSession";
import { IProduct } from "@/interfaces/IProduct";
import { AppError } from "@/lib/errors/app-error";
import { useAddCartItem } from "@/queries/cart";
import { useGetProduct } from "@/queries/product";
import { useCartStore } from "@/stores/cart-store";
import { useNotificationStore } from "@/stores/notification-store";
import { BaseResponse } from "@/types/response.type";
import { useRouter } from "next/navigation";
import ProductImageGallery from "./components/ProductGallery";
import { useProductSkuSelection } from "./hooks/useProductSkuSelection";
import { truncateTextByLine } from "@/utils/css-helper.util";

const ProductDetailClient = ({
  initialProduct,
}: {
  initialProduct: BaseResponse<IProduct>;
}) => {
  const router = useRouter();
  const { data: user } = useSession();
  const { cartItems, addToCart, syncCart, setLastBuyNowItemId } =
    useCartStore();
  const { showNotification } = useNotificationStore();

  const { data } = useGetProduct(initialProduct);
  const { mutateAsync: onAddToCart } = useAddCartItem();

  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const product = data?.data;

  const {
    selectedAttributes,
    selectedSku,
    count,
    setCount,
    attributeOptions,
    attributesStatusMap,
    handleAttributeChange,
    totalStock,
  } = useProductSkuSelection(product);

  useEffect(() => {
    router.prefetch("/cart");
  }, [router]);

  const handleAddToCartProcess = async (isBuyNow: boolean = false) => {
    if (!selectedSku)
      return showNotification("Vui lòng chọn phân loại hàng", "error");
    const oldCartItems = [...cartItems];
    const cartItemPayload = {
      productId: selectedSku?.productId,
      skuId: selectedSku.id,
      productName: product?.name ?? "",
      imageUrl: (selectedSku.imageUrl || product?.images?.[0]) ?? "",
      sellingPrice: selectedSku.sellingPrice,
      quantity: count ?? 1,
      attributes: selectedSku.productSkuAttributes.map((attr) => ({
        attribute: attr.attributeValue.attribute.name,
        attributeValue: attr.attributeValue.value,
      })),
    };

    const itemInCart = cartItems.find((i) => i.skuId === selectedSku.id);
    const currentQtyInCart = !user ? itemInCart?.quantity || 0 : 0;
    const isCurrentQtyExceedStock =
      currentQtyInCart + (count ?? 1) > (selectedSkuStock ?? 0);
    if (selectedSkuStock && isCurrentQtyExceedStock && !isBuyNow) {
      return showNotification(`Số lượng vượt quá tồn kho...`, "error");
    }

    try {
      if (isBuyNow) setIsBuyingNow(true);

      if (user) {
        addToCart(cartItemPayload);
        await onAddToCart({
          productId: selectedSku.productId,
          skuId: selectedSku.id,
          quantity: count ?? 1,
        });
      }

      if (isBuyNow) {
        if (!isCurrentQtyExceedStock) {
          addToCart(cartItemPayload);
        }

        setLastBuyNowItemId(selectedSku.id);
        router.push("/cart");
      } else {
        showNotification("Thêm vào giỏ hàng thành công", "success");
        if (isBuyNow) setIsBuyingNow(false);
      }
    } catch (error) {
      setIsBuyingNow(false);
      syncCart(oldCartItems);
      showNotification(AppError.fromUnknown(error).message, "error");
    }
  };

  const handleCountChange = (value: number | null) => {
    if (value && value >= 0) {
      setCount(value);
    }
  };

  const breadcrumbsOptions = [
    { href: "/", label: "Trang chủ" },
    {
      href: `/${product?.category?.slug}`,
      label: product?.category?.name as string,
    },
    { href: "", label: product?.name as string },
  ];

  const selectedSkuStock = useMemo(() => {
    return selectedSku?.stocks?.reduce(
      (acc: number, stock: { id: number; quantity: number }) =>
        acc + stock.quantity,
      0
    );
  }, [selectedSku]);

  if (!product) {
    return (
      <Box sx={{ p: 5, display: "flex", justifyContent: "center" }}>
        <Typography>Đang tải dữ liệu sản phẩm...</Typography>
      </Box>
    );
  }

  return (
    <Box pt={2} pb={4}>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs options={breadcrumbsOptions} />
      </Box>
      <Box
        sx={{
          px: { xs: 0.5, md: 3 },
          mb: { xs: 4, md: 2 },
          bgcolor: "#fff",
          borderRadius: 1,
        }}
      >
        <Grid2 container columnSpacing={4}>
          <Grid2 size={{ xs: 12, md: 5 }} sx={{ py: 3 }}>
            <ProductImageGallery product={product} selectedSku={selectedSku} />
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 7 }}
            sx={{
              pl: { xs: 0, md: 3 },
              borderLeft: { xs: "none", md: "1px solid #eee" },
            }}
          >
            <Box sx={{ pt: 3 }}>
              <Typography
                sx={{ mb: 1, fontSize: { xs: 18, md: 24 }, fontWeight: 600 }}
              >
                {product?.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mr: 1,
                    fontSize: { xs: 14, md: 16 },
                  }}
                >
                  5.0{" "}
                  <StarRateIcon
                    sx={{ color: "#F19B4C", fontSize: { xs: 16, md: 20 } }}
                  />
                </Typography>
                <AppLink href={"/"} sx={{ fontSize: { xs: 12, md: 14 } }}>
                  Xem đánh giá
                </AppLink>
              </Box>
              <Typography
                sx={{ mb: 2, fontSize: { xs: 20, md: 24 }, fontWeight: 600 }}
              >
                {product?.skus?.length && selectedSku !== null ? (
                  formatPrice(selectedSku?.sellingPrice ?? 0)
                ) : (
                  <>
                    {formatPrice(product?.priceMin ?? 0)}
                    {product?.skus?.length > 1 && (
                      <>- {formatPrice(product?.priceMax ?? 0)}</>
                    )}
                  </>
                )}
              </Typography>
              {Object.entries(attributeOptions).map(([type, values]) => (
                <Box
                  key={type}
                  sx={{ display: "flex", alignItems: "baseline", mb: 1 }}
                >
                  <Typography
                    component={"h3"}
                    sx={{
                      width: { xs: 80, md: 90 },
                      flexShrink: 0,
                      fontSize: 14,
                      color: "#757575",
                    }}
                  >
                    {attributeLabels[type]}:
                  </Typography>
                  <ToggleButtonGroup
                    sx={{
                      flexWrap: "wrap",
                      "& .MuiButtonBase-root": {
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        borderRadius: "2px",
                      },
                      "& .MuiToggleButton-root.Mui-disabled": {
                        border: "1px solid rgba(0,0,0,.12)",
                      },
                    }}
                    value={selectedAttributes[type]}
                    exclusive
                    rel=""
                    onChange={(e, newValue) =>
                      handleAttributeChange(type, newValue)
                    }
                  >
                    {values.map((value) => (
                      <ToggleButton
                        sx={{
                          minWidth: 69,
                          maxWidth: 400,
                          height: { xs: "36px", md: "40px" },
                          px: { xs: 0.5, md: 1.5 },
                          mt: { xs: 0.5, md: 1 },
                          mr: { xs: 1, md: 1.5 },
                          color: "rgba(0,0,0,.8)",
                          fontSize: "14px",
                          textTransform: "capitalize",
                          cursor: "pointer",
                          ...truncateTextByLine(1),
                        }}
                        size="small"
                        key={value}
                        value={value}
                        disabled={attributesStatusMap[`${type}-${value}`]}
                      >
                        {value}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              ))}

              <Grid2 container mt={{ xs: 3, md: 4 }} mb={{ xs: 2, md: 3 }}>
                <Grid2 size={{ xs: 2.5, md: 2 }}>
                  <Typography sx={{ fontSize: 14, color: "#757575" }}>
                    Số lượng:
                  </Typography>
                </Grid2>
                <Grid2 size={{ xs: 9.5, md: 10 }} display={"flex"}>
                  <ButtonGroup
                    variant="outlined"
                    size="small"
                    sx={{ mr: 2, height: 32 }}
                  >
                    <Button
                      onClick={() => handleCountChange((count ?? 0) - 1)}
                      disabled={!selectedSku || count === 1}
                    >
                      -
                    </Button>
                    <TextField
                      sx={{
                        width: "48px",
                        ".MuiInputBase-root": {
                          height: 32,
                          borderRadius: 0,
                          ".MuiInputBase-input": {
                            p: 0,
                            textAlign: "center",
                            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                              {
                                display: "none",
                              },
                          },
                        },
                      }}
                      type="number"
                      disabled={
                        selectedSku === null ||
                        selectedSkuStock === 0 ||
                        totalStock === 0
                      }
                      value={count ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          selectedSku &&
                          selectedSkuStock &&
                          +value > selectedSkuStock
                        ) {
                          setCount(selectedSkuStock);
                        } else {
                          setCount(value ? parseInt(value, 10) : null);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "-") {
                          e.preventDefault();
                        }
                        if (
                          count === null &&
                          (e.key === "0" || e.key === "Enter")
                        ) {
                          e.preventDefault();
                        }
                      }}
                      size="small"
                    />
                    <Button
                      onClick={() => handleCountChange((count ?? 0) + 1)}
                      disabled={
                        !selectedSku ||
                        count === selectedSkuStock ||
                        selectedSkuStock === 0
                      }
                    >
                      +
                    </Button>
                  </ButtonGroup>
                  {totalStock && totalStock > 0 ? (
                    <Typography sx={{ fontSize: 14, lineHeight: "32px" }}>
                      {totalStock > 0 && selectedSku
                        ? selectedSku?.stocks?.reduce(
                            (
                              acc: number,
                              stock: { id: number; quantity: number }
                            ) => acc + stock.quantity,
                            0
                          )
                        : totalStock}{" "}
                      sản phẩm có sẵn
                    </Typography>
                  ) : (
                    ""
                  )}
                </Grid2>
              </Grid2>
              <Box
                sx={{
                  display: { xs: "flex", md: "block" },
                  justifyContent: { xs: "space-between", md: "normal" },
                }}
              >
                <Button
                  sx={{
                    width: { xs: "28%", md: "auto" },
                    mr: { xs: 0, md: 2 },
                    bgcolor: "#f0f0f0",
                  }}
                  variant="outlined"
                  size="large"
                  disabled={!selectedSku || selectedSkuStock === 0}
                  onClick={() => handleAddToCartProcess(false)}
                >
                  <ShoppingCartOutlinedIcon />
                </Button>
                <Button
                  sx={{ width: { xs: "69%", md: 200 } }}
                  variant="contained"
                  size="large"
                  loading={isBuyingNow}
                  disabled={!selectedSku || selectedSkuStock === 0}
                  onClick={() => handleAddToCartProcess(true)}
                >
                  {(!!totalStock && !selectedSku) ||
                  (!!totalStock && selectedSku && selectedSkuStock)
                    ? "Mua ngay"
                    : "Hết hàng"}
                </Button>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
      <Box sx={{ p: { xs: 0, md: 2 }, mb: 2, bgcolor: "#fff" }}>
        <Typography
          sx={{ width: "100%", p: 2, mb: 3, bgcolor: "rgba(0,0,0,0.02)" }}
        >
          Chi tiết sản phẩm
        </Typography>
        <Grid2 container spacing={1.5} ml={2} mb={3}>
          <Grid2 size={{ xs: 4, md: 2 }}>Danh mục</Grid2>
          <Grid2 size={{ xs: 8, md: 10 }}>{product?.category?.name}</Grid2>
          <Grid2 size={{ xs: 4, md: 2 }}>Thương hiệu</Grid2>
          <Grid2 size={{ xs: 8, md: 10 }}>{product?.brand}</Grid2>
          <Grid2 size={{ xs: 4, md: 2 }}>Bảo hành</Grid2>
          <Grid2 size={{ xs: 8, md: 10 }}>{product?.details?.guarantee}</Grid2>
          <Grid2 size={{ xs: 4, md: 2 }}>Chất liệu</Grid2>
          <Grid2 size={{ xs: 8, md: 10 }}>{product?.details?.material}</Grid2>
        </Grid2>
        <Typography
          sx={{ width: "100%", p: 2, mb: 3, bgcolor: "rgba(0,0,0,0.02)" }}
        >
          Mô tả sản phẩm
        </Typography>
        <HtmlRenderBox html={product?.description ?? ""} />
      </Box>
    </Box>
  );
};

export default ProductDetailClient;
