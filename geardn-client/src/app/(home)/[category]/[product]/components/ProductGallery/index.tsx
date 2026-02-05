import { useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import { SwiperClass } from "swiper/react";

import { IProduct } from "@/interfaces/IProduct";
import { IProductSku } from "@/interfaces/IProductSku";

import SkeletonImage from "@/components/common/SkeletonImage";
import MainSwiper from "./MainSwiper";
import ThumbSwiper from "./ThumbSwiper";

interface IProps {
  product: IProduct;
  selectedSku: IProductSku | null;
}

const ProductImageGallery = ({ product, selectedSku }: IProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const mainSwiperRef = useRef<SwiperClass | null>(null);

  const productImageList = useMemo(() => {
    return [
      ...(product?.images || []),
      ...(product && product?.skus?.length > 1
        ? product?.skus.map((sku) => sku.imageUrl).filter(Boolean)
        : []),
    ];
  }, [product]);
  return (
    <div>
      <Box sx={{ position: "relative", height: "400px" }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {selectedSku?.imageUrl ? (
            <SkeletonImage
              src={selectedSku?.imageUrl}
              alt="Selected Option"
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : null}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "400px",
              display: selectedSku?.imageUrl ? "none" : "block",
            }}
          >
            <MainSwiper
              data={productImageList}
              thumbsSwiper={thumbsSwiper}
              setMainSwiper={mainSwiperRef}
            />
          </Box>
        </Box>
      </Box>
      <Box mb={1} />
      <Box>
        <ThumbSwiper
          images={productImageList}
          setThumbsSwiper={setThumbsSwiper}
        />
      </Box>
    </div>
  );
};

export default ProductImageGallery;
