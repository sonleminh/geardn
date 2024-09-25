import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import styled from 'styled-components';

const Swiper1 = (props: any) => {
  return (
    <Swiper2Container>
      <Swiper
        onSwiper={props?.setThumbsSwiper}
        direction={'vertical'}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className='mySwiper'>
        {props?.data?.map((item: any) => (
          <SwiperSlide key={item}>
            <img src={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Swiper2Container>
  );
};

export default Swiper1;

const Swiper2Container = styled.div`
  .swiper {
    width: 100%;
    height: 100%;
  }
  .mySwiper {
    height: 390px;
  }
  .swiper-slide {
    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto !important;

    text-align: center;
    font-size: 18px;
    background: #fff;
    background-size: cover;
    background-position: center;

    border: 1px solid #bebebe;
    border-radius: 5px;
    cursor: pointer;
  }
  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .swiper-slide-thumb-active {
    border-color: #003468;
  }
`;
