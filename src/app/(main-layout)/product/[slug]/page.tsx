import Breadcrumbs from '@/components/common/Breadcrumbs';
import LayoutContainer from '@/components/common/sharing/layout-container';
import { Box, Typography } from '@mui/material';
import React from 'react';

const ProductDetail = () => {
  const breadcrumbsOptions = [
    { link: '/', label: 'HOME' },
    // { link: `/blog/${data._id}`, label: data.title },
  ];
  return (
    <Box sx={{ bgcolor: '#eee' }}>
      <LayoutContainer>
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Typography variant='h3' sx={{ mb: 2, fontSize: 28, fontWeight: 700 }}>
          {/* {data?.title} */}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            mb: 2,
          }}>
          {/* {data?.tags?.map((item) => (
            <TagItem key={item.value} data={item} />
          ))} */}
        </Box>
        {/* <HtmlRenderBox html={data?.content} /> */}
      </LayoutContainer>
    </Box>
  );
};

export default ProductDetail;
