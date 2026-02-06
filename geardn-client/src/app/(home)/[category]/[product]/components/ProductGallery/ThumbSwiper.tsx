"use client";

import React from "react";
import { Box, SxProps, Theme } from "@mui/material";

import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import { Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import SkeletonImage from "@/components/common/SkeletonImage";

interface IProps {
  images: string[];
  setThumbsSwiper: React.Dispatch<React.SetStateAction<SwiperClass | null>>;
}
const ThumbSwiper = ({ images, setThumbsSwiper }: IProps) => {
  return (
    <Box sx={SwiperStyle}>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={5}
        modules={[Navigation, Thumbs]}
        navigation={true}
        grabCursor={true}
        roundLengths={false}
        watchSlidesProgress={true}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <Box
              className="slide-item"
              sx={{
                // height: "80px",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <SkeletonImage
                src={src}
                alt={`test-${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ThumbSwiper;

const SwiperStyle: SxProps<Theme> = {
  ".swiper": {
    width: "100%",
    height: "auto",
    padding: "0",
  },

  // --- STYLE CHO TRẠNG THÁI LOADING (Trước khi JS chạy 0.2s) ---
  // Chỉ áp dụng khi class .swiper-initialized CHƯA xuất hiện
  ".swiper:not(.swiper-initialized) .swiper-wrapper": {
    display: "flex",
    gap: "10px", // Giả lập khoảng cách 10px ngay bằng CSS
  },

  ".swiper:not(.swiper-initialized) .swiper-slide": {
    // 1. Tính toán width chính xác: (100% - 40px gap) chia 5
    width: "calc((100% - 40px) / 5)",

    // 2. Reset các margin thừa để khớp với gap
    marginRight: "0px",

    // Các style cơ bản giữ nguyên để không bị lệch layout
    flexShrink: 0,
    display: "block",
    // height: "80px",
    aspectRatio: "1 / 1",
    boxSizing: "border-box",
  },

  ".slide-item": {
    // height: "80px",
    width: "100%",
    aspectRatio: "1 / 1",
    position: "relative",
    overflow: "hidden",
    borderRadius: "8px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
    cursor: "grab",
  },

  ".swiper-slide-thumb-active .slide-item": {
    borderColor: "#f06 !important",
    borderWidth: "1px",
  },

  ".swiper-button-prev, .swiper-button-next": {
    width: 36,
    height: 36,
    border: "1px solid #696969",
    borderRadius: "50%",
    bgcolor: "rgba(24, 24, 24, 0.7)",
    color: "#fff",
    ":after": {
      fontSize: 12,
    },
    ":hover": {
      bgcolor: "rgba(24, 24, 24, 0.3)",
    },
    "&.swiper-button-disabled": {
      display: "none",
    },
  },
};
