import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import styled from 'styled-components';

const Swiper2 = (props: any) => {
  return (
    <Swiper1Container>
      <Swiper
        style={{}}
        spaceBetween={10}
        navigation={true}
        thumbs={{
          swiper:
            props?.thumbsSwiper && !props?.thumbsSwiper?.destroyed
              ? props?.thumbsSwiper
              : null,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className='mySwiper2'>
        {props?.data?.map((item: any) => (
          <SwiperSlide key={item}>
            <img src={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Swiper1Container>
  );
};

export default Swiper2;

const Swiper1Container = styled.div`
  .swiper {
    width: 100%;
    height: 100%;
  }
  .mySwiper {
    height: 390px;
  }
  .swiper-slide {
    width: 485px;
    height: 485px;
  }
  .swiper-button-prev,
  .swiper-button-next {
    color: #333;
  }
`;
