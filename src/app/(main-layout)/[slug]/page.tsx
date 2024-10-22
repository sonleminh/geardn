// 'use client';

// import AppLink from '@/components/common/AppLink';
// import Breadcrumbs from '@/components/common/Breadcrumbs';
// import LayoutContainer from '@/components/common/sharing/layout-container';
// import { useGetProductById, useGetSKUByPrdId } from '@/services/product/api';
// import { formatPrice } from '@/utils/format-price';
// import StarRateIcon from '@mui/icons-material/StarRate';
// import {
//   Box,
//   Button,
//   ButtonGroup,
//   Grid2,
//   List,
//   ListItem,
//   TextField,
//   ToggleButton,
//   ToggleButtonGroup,
//   Typography,
// } from '@mui/material';
// import { useParams, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { Swiper as SwiperClass } from 'swiper';
// import MainSwiper from './components/main-swiper';
// import ThumbSwiper from './components/thumb-swiper';
// import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
// import HtmlRenderBox from '@/components/common/HtmlRenderBox';
// import { useUpsertCart } from '@/services/cart/mutations';
// import { useAuthStore } from '@/providers/auth-store-provider';
// import { addCartAPI } from '@/services/cart/api';
// import { ISku } from '@/interfaces/ISku';
// import SkeletonImage from '@/components/common/SkeletonImage';
// import { IModel, IVariant } from '@/interfaces/IProduct';

// const ProductDetail = () => {
//   const params = useParams();
//   const router = useRouter();
//   const { user, logout } = useAuthStore((state) => state);
//   const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
//   const [count, setCount] = useState<number | null>(1);

//   const [selectedModel, setSelectedModel] = useState<(number | null)[]>([]);
//   const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
//   const [matchedModel, setMatchedModel] = useState<IModel | null>(null);

//   const { product } = useGetProductById(params?.slug as string);
//   const { mutate } = useUpsertCart();

//   const breadcrumbsOptions = [
//     { link: '/', label: 'Home' },
//     { link: `/product/${product?._id}`, label: product?.name as string },
//   ];

//   useEffect(() => {
//     if (selectedModel) {
//       const matchedModel = product?.models?.find(
//         (model) =>
//           JSON.stringify(model?.extinfo?.tier_index) ==
//           JSON.stringify(selectedModel)
//       );
//       if (matchedModel) {
//         setMatchedModel(matchedModel);
//       }
//     } else {
//       setMatchedModel(null);
//     }
//   }, [selectedModel]);

//   console.log(matchedModel);

//   const handleToggleChange = (newValue: string, vIndex: number) => {
//     const optionIndex =
//       product?.tier_variations[vIndex]?.options?.indexOf(newValue);

//     const updatedSelectedModel = [...selectedModel];
//     if (optionIndex !== -1) {
//       updatedSelectedModel[vIndex] = optionIndex;
//       setSelectedModel(updatedSelectedModel);
//     } else {
//       console.log(2);
//       updatedSelectedModel[vIndex] = null;
//       setSelectedModel(updatedSelectedModel);
//     }
//     // setSelectedOptionIndex(vIndex);
//   };

//   const handleCountChange = (value: number | null) => {
//     // Ensure count is non-negative
//     if (value && value >= 0) {
//       setCount(value);
//     }
//   };

//   function removeDuplicates(arr: (string | undefined)[]) {
//     return arr?.filter((item, index) => arr.indexOf(item) === index);
//   }

//   const handleAddCart = async () => {
//     // if (!user) {
//     //   router.push('/login');
//     // }
//     // if (matchedSKU) {
//     //   const cartData = await addCartAPI({
//     //     sku: matchedSKU?._id,
//     //     quantity: count ?? 1,
//     //   });
//     //   mutate(cartData, false);
//     // }
//   };

//   const handleDisableOption = (variantIndex: number, optionIndex: number) => {
//     if (selectedModel?.length > 0) {
//       const updatedSelectedModel = [...selectedModel];
//       updatedSelectedModel[variantIndex] = optionIndex;
//       const matchingModel = product?.models?.find(
//         (model) =>
//           JSON.stringify(model?.extinfo?.tier_index) ===
//           JSON.stringify(updatedSelectedModel)
//       );
//       const optionIsDisabled = product?.models?.some(
//         (model) => model.extinfo.tier_index[variantIndex] === optionIndex
//       );
//       return matchingModel ||
//         (optionIsDisabled && selectedOptionIndex === variantIndex)
//         ? false
//         : true;
//     }
//     return !product?.models?.some(
//       (model) => model.extinfo.tier_index[variantIndex] === optionIndex
//     );
//   };

//   console.log('slt:', selectedModel);

//   return (
//     <Box pb={4}>
//       <LayoutContainer>
//         <Box sx={{ mb: 2 }}>
//           <Breadcrumbs options={breadcrumbsOptions} />
//         </Box>
//         <Box sx={{ px: 3, mb: 2, bgcolor: '#fff', borderRadius: 1 }}>
//           <Grid2 container spacing={4}>
//             <Grid2 size={5} sx={{ py: 3 }}>
//               <MainSwiper data={product?.images} thumbsSwiper={thumbsSwiper} />
//               <Box mb={1} />
//               <ThumbSwiper
//                 images={product?.images}
//                 setThumbsSwiper={setThumbsSwiper}
//               />
//             </Grid2>
//             <Grid2 size={7} sx={{ pl: 3, borderLeft: '1px solid #eee' }}>
//               <Box sx={{ pt: 3 }}>
//                 <Typography sx={{ mb: 1, fontSize: 24, fontWeight: 600 }}>
//                   {product?.name}
//                 </Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                   <Typography
//                     sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
//                     5.0 <StarRateIcon sx={{ color: '#F19B4C', fontSize: 20 }} />
//                   </Typography>
//                   <AppLink href={'/'} sx={{ fontSize: 14 }}>
//                     Xem đánh giá
//                   </AppLink>
//                 </Box>
//                 {/* <Box sx={{ mb: 3 }}>
//                   <Typography sx={{ fontSize: 26, fontWeight: 600 }}>
//                     {formatPrice(product?.price)}
//                   </Typography>
//                   {product?.discount?.discountPrice && (
//                     <Typography component={'span'}>
//                       {formatPrice(product?.discount?.discountPrice)}
//                     </Typography>
//                   )}
//                 </Box> */}
//                 <Typography sx={{ mb: 2, fontSize: 24, fontWeight: 600 }}>
//                   {formatPrice(
//                     matchedModel?.price || product?.original_price
//                   ) ?? formatPrice(product?.original_price)}
//                 </Typography>
//                 {product?.tier_variations?.map((variant: IVariant, vIndex) => (
//                   <Grid2
//                     container
//                     display={'flex'}
//                     key={variant?.name}
//                     my={2.5}>
//                     <Grid2
//                       size={2}
//                       sx={{ display: 'flex', alignItems: 'center' }}>
//                       {variant?.name}:
//                     </Grid2>
//                     <Grid2
//                       size={10}
//                       sx={{ display: 'flex', alignItems: 'center' }}>
//                       <ToggleButtonGroup
//                         sx={{
//                           '.MuiButtonBase-root': {
//                             minWidth: 100,
//                             height: 40,
//                             mr: 2,
//                             border: '1px solid rgba(0,0,0,0.09)',
//                             color: '#000',
//                             borderRadius: '2px',
//                             textTransform: 'initial',
//                             ':hover': {
//                               border: '1px solid #000',
//                             },
//                           },
//                           '.Mui-selected': {
//                             border: '1px solid #000',
//                           },
//                           '.Mui-disabled': {
//                             bgcolor: '#fafafa',
//                             color: 'rgba(0,0,0,.26)',
//                             border: '1px solid rgba(0,0,0,0.09) !important',
//                             cursor: 'not-allowed',
//                           },
//                         }}
//                         value={
//                           selectedModel[vIndex] !== null
//                             ? product?.tier_variations[vIndex]?.options[
//                                 selectedModel[vIndex]
//                               ]
//                             : ''
//                         }
//                         // value={
//                         //   product?.tier_variations[vIndex]?.options[
//                         //     selectedModel[vIndex]
//                         //   ]
//                         // }
//                         exclusive
//                         size='small'
//                         onChange={(event, newValue) =>
//                           handleToggleChange(newValue, vIndex)
//                         }>
//                         {variant?.options?.map((item, index) => (
//                           <ToggleButton
//                             sx={{
//                               '.Mui-disabled': {
//                                 bgcolor: 'red',
//                               },
//                             }}
//                             key={item}
//                             value={item ?? ''}
//                             aria-label='left aligned'
//                             disabled={handleDisableOption(vIndex, index)}>
//                             {variant?.images && (
//                               <Box
//                                 sx={{
//                                   position: 'relative',
//                                   width: 24,
//                                   height: 24,
//                                   mr: 1,
//                                   overflow: 'hidden',
//                                 }}>
//                                 <SkeletonImage
//                                   src={variant?.images[index]}
//                                   alt='geardn'
//                                 />
//                               </Box>
//                             )}
//                             {item}
//                           </ToggleButton>
//                         ))}
//                       </ToggleButtonGroup>
//                     </Grid2>
//                   </Grid2>
//                 ))}
//                 <Grid2 container mt={3} mb={3}>
//                   <Grid2 size={2}>Số lượng:</Grid2>
//                   <Grid2 size={10} display={'flex'}>
//                     <ButtonGroup
//                       variant='outlined'
//                       size='small'
//                       sx={{ mr: 2, height: 32 }}>
//                       <Button
//                         onClick={() => handleCountChange((count ?? 0) - 1)}>
//                         -
//                       </Button>
//                       <TextField
//                         type='number'
//                         value={count ?? ''}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           setCount(value ? parseInt(value, 10) : null);
//                         }}
//                         onKeyDown={(e) => {
//                           if (e.key === '-') {
//                             e.preventDefault();
//                           }
//                           if (
//                             count === null &&
//                             (e.key === '0' || e.key === 'Enter')
//                           ) {
//                             e.preventDefault();
//                           }
//                         }}
//                         size='small'
//                         sx={{
//                           width: '48px',
//                           '.MuiInputBase-root': {
//                             height: 32,
//                             borderRadius: 0,
//                             '.MuiInputBase-input': {
//                               p: 0,
//                               textAlign: 'center',
//                               '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button':
//                                 {
//                                   display: 'none',
//                                 },
//                             },
//                           },
//                         }}
//                       />
//                       <Button
//                         onClick={() => handleCountChange((count ?? 0) + 1)}>
//                         +
//                       </Button>
//                     </ButtonGroup>
//                     <Typography sx={{ fontSize: 14, lineHeight: '32px' }}>
//                       69 sản phẩm có sẵn
//                     </Typography>
//                   </Grid2>
//                 </Grid2>
//                 <Box>
//                   <Button
//                     sx={{ mr: 2, bgcolor: '#f0f0f0' }}
//                     variant='outlined'
//                     size='large'
//                     onClick={handleAddCart}>
//                     <ShoppingCartOutlinedIcon />
//                   </Button>
//                   <Button variant='contained' size='large' sx={{ width: 200 }}>
//                     Mua ngay
//                   </Button>
//                 </Box>
//               </Box>
//             </Grid2>
//           </Grid2>
//         </Box>
//         <Box sx={{ p: 2, mb: 2, bgcolor: '#fff' }}>
//           <Typography
//             sx={{ width: '100%', p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
//             Chi tiết sản phẩm
//           </Typography>
//           <Grid2 container spacing={1.5} ml={2} mb={3}>
//             <Grid2 size={2}>Danh mục</Grid2>
//             <Grid2 size={10}>{product?.category?.name}</Grid2>
//             <Grid2 size={2}>Thương hiệu</Grid2>
//             <Grid2 size={10}>{product?.brand}</Grid2>
//             <Grid2 size={2}>Bảo hành</Grid2>
//             <Grid2 size={10}>{product?.details?.guarantee}</Grid2>
//             <Grid2 size={2}>Chất liệu</Grid2>
//             <Grid2 size={10}>{product?.details?.material}</Grid2>
//           </Grid2>
//           <Typography
//             sx={{ width: '100%', p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
//             Mô tả sản phẩm
//           </Typography>
//           <HtmlRenderBox html={product?.description} />
//         </Box>
//       </LayoutContainer>
//     </Box>
//   );
// };

// export default ProductDetail;

'use client';

import AppLink from '@/components/common/AppLink';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import HtmlRenderBox from '@/components/common/HtmlRenderBox';
import LayoutContainer from '@/components/common/sharing/layout-container';
import SkeletonImage from '@/components/common/SkeletonImage';
import { IModel, IVariant } from '@/interfaces/IProduct';
import { useAuthStore } from '@/providers/auth-store-provider';
import { useUpsertCart } from '@/services/cart/mutations';
import { useGetProductById } from '@/services/product/api';
import { formatPrice } from '@/utils/format-price';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StarRateIcon from '@mui/icons-material/StarRate';
import {
  Box,
  Button,
  ButtonGroup,
  Grid2,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import MainSwiper from './components/main-swiper';
import ThumbSwiper from './components/thumb-swiper';

const ProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { user, logout } = useAuthStore((state) => state);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [count, setCount] = useState<number | null>(1);

  const [selectedModel, setSelectedModel] = useState<(number | undefined)[]>(
    []
  );
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [matchedModel, setMatchedModel] = useState<IModel | null>(null);

  const { product } = useGetProductById(params?.slug as string);
  const { mutate } = useUpsertCart();

  const breadcrumbsOptions = [
    { link: '/', label: 'Home' },
    { link: `/product/${product?._id}`, label: product?.name as string },
  ];

  useEffect(() => {
    // Match the selectedModel with a valid product model
    const matchedModel = product?.models?.find(
      (model) =>
        JSON.stringify(model?.extinfo?.tier_index) ===
        JSON.stringify(selectedModel)
    );
    setMatchedModel(matchedModel ?? null);
  }, [selectedModel, product]);

  console.log(matchedModel);

  const handleToggleChange = (newValue: string, vIndex: number) => {
    const optionIndex = product?.tier_variations[vIndex]?.options?.indexOf(
      newValue ?? ''
    );
    const updatedSelectedModel = [...selectedModel];
    if (optionIndex !== -1) {
      updatedSelectedModel[vIndex] = optionIndex;
    } else {
      updatedSelectedModel[vIndex] = undefined;
    }
    setSelectedModel(updatedSelectedModel);
  };

  const handleDisableOption = (variantIndex: number, optionIndex: number) => {
    const updatedSelectedModel = [...selectedModel];
    updatedSelectedModel[variantIndex] = optionIndex;

    const validCombination = product?.models?.some((model) =>
      model.extinfo.tier_index.every(
        (tierIndex: number, idx: number) =>
          updatedSelectedModel[idx] === undefined ||
          updatedSelectedModel[idx] === tierIndex
      )
    );
    console.log(
      variantIndex,
      optionIndex,
      validCombination,
      updatedSelectedModel
    );
    return !validCombination;
  };
  const handleCountChange = (value: number | null) => {
    // Ensure count is non-negative
    if (value && value >= 0) {
      setCount(value);
    }
  };

  function removeDuplicates(arr: (string | undefined)[]) {
    return arr?.filter((item, index) => arr.indexOf(item) === index);
  }

  const handleAddCart = async () => {
    // if (!user) {
    //   router.push('/login');
    // }
    // if (matchedSKU) {
    //   const cartData = await addCartAPI({
    //     sku: matchedSKU?._id,
    //     quantity: count ?? 1,
    //   });
    //   mutate(cartData, false);
    // }
  };

  console.log('slt:', selectedModel);

  return (
    <Box pb={4}>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Box sx={{ px: 3, mb: 2, bgcolor: '#fff', borderRadius: 1 }}>
          <Grid2 container spacing={4}>
            <Grid2 size={5} sx={{ py: 3 }}>
              <MainSwiper data={product?.images} thumbsSwiper={thumbsSwiper} />
              <Box mb={1} />
              <ThumbSwiper
                images={product?.images}
                setThumbsSwiper={setThumbsSwiper}
              />
            </Grid2>
            <Grid2 size={7} sx={{ pl: 3, borderLeft: '1px solid #eee' }}>
              <Box sx={{ pt: 3 }}>
                <Typography sx={{ mb: 1, fontSize: 24, fontWeight: 600 }}>
                  {product?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    5.0 <StarRateIcon sx={{ color: '#F19B4C', fontSize: 20 }} />
                  </Typography>
                  <AppLink href={'/'} sx={{ fontSize: 14 }}>
                    Xem đánh giá
                  </AppLink>
                </Box>
                {/* <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: 26, fontWeight: 600 }}>
                    {formatPrice(product?.price)}
                  </Typography>
                  {product?.discount?.discountPrice && (
                    <Typography component={'span'}>
                      {formatPrice(product?.discount?.discountPrice)}
                    </Typography>
                  )}
                </Box> */}
                <Typography sx={{ mb: 2, fontSize: 24, fontWeight: 600 }}>
                  {formatPrice(
                    matchedModel?.price || product?.original_price
                  ) ?? formatPrice(product?.original_price)}
                </Typography>
                {product?.tier_variations?.map((variant: IVariant, vIndex) => (
                  <Grid2
                    container
                    display={'flex'}
                    key={variant?.name}
                    my={2.5}>
                    <Grid2
                      size={2}
                      sx={{ display: 'flex', alignItems: 'center' }}>
                      {variant?.name}:
                    </Grid2>
                    <Grid2
                      size={10}
                      sx={{ display: 'flex', alignItems: 'center' }}>
                      <ToggleButtonGroup
                        sx={{
                          '.MuiButtonBase-root': {
                            minWidth: 100,
                            height: 40,
                            mr: 2,
                            border: '1px solid rgba(0,0,0,0.09)',
                            color: '#000',
                            borderRadius: '2px',
                            textTransform: 'initial',
                            ':hover': {
                              border: '1px solid #000',
                            },
                          },
                          '.Mui-selected': {
                            border: '1px solid #000',
                          },
                          '.Mui-disabled': {
                            bgcolor: '#fafafa',
                            color: 'rgba(0,0,0,.26)',
                            border: '1px solid rgba(0,0,0,0.09) !important',
                            cursor: 'not-allowed',
                          },
                        }}
                        value={
                          selectedModel[vIndex] !== undefined
                            ? product?.tier_variations[vIndex]?.options[
                                selectedModel[vIndex]
                              ]
                            : ''
                        }
                        // value={
                        //   product?.tier_variations[vIndex]?.options[
                        //     selectedModel[vIndex]
                        //   ]
                        // }
                        exclusive
                        size='small'
                        onChange={(event, newValue) =>
                          handleToggleChange(newValue, vIndex)
                        }>
                        {variant?.options?.map((item, index) => (
                          <ToggleButton
                            sx={{
                              '.Mui-disabled': {
                                bgcolor: 'red',
                              },
                            }}
                            key={item}
                            value={item ?? ''}
                            aria-label='left aligned'
                            disabled={handleDisableOption(vIndex, index)}>
                            {variant?.images && (
                              <Box
                                sx={{
                                  position: 'relative',
                                  width: 24,
                                  height: 24,
                                  mr: 1,
                                  overflow: 'hidden',
                                }}>
                                <SkeletonImage
                                  src={variant?.images[index]}
                                  alt='geardn'
                                />
                              </Box>
                            )}
                            {item}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Grid2>
                  </Grid2>
                ))}
                <Grid2 container mt={3} mb={3}>
                  <Grid2 size={2}>Số lượng:</Grid2>
                  <Grid2 size={10} display={'flex'}>
                    <ButtonGroup
                      variant='outlined'
                      size='small'
                      sx={{ mr: 2, height: 32 }}>
                      <Button
                        onClick={() => handleCountChange((count ?? 0) - 1)}>
                        -
                      </Button>
                      <TextField
                        type='number'
                        value={count ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCount(value ? parseInt(value, 10) : null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === '-') {
                            e.preventDefault();
                          }
                          if (
                            count === null &&
                            (e.key === '0' || e.key === 'Enter')
                          ) {
                            e.preventDefault();
                          }
                        }}
                        size='small'
                        sx={{
                          width: '48px',
                          '.MuiInputBase-root': {
                            height: 32,
                            borderRadius: 0,
                            '.MuiInputBase-input': {
                              p: 0,
                              textAlign: 'center',
                              '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button':
                                {
                                  display: 'none',
                                },
                            },
                          },
                        }}
                      />
                      <Button
                        onClick={() => handleCountChange((count ?? 0) + 1)}>
                        +
                      </Button>
                    </ButtonGroup>
                    <Typography sx={{ fontSize: 14, lineHeight: '32px' }}>
                      69 sản phẩm có sẵn
                    </Typography>
                  </Grid2>
                </Grid2>
                <Box>
                  <Button
                    sx={{ mr: 2, bgcolor: '#f0f0f0' }}
                    variant='outlined'
                    size='large'
                    onClick={handleAddCart}>
                    <ShoppingCartOutlinedIcon />
                  </Button>
                  <Button variant='contained' size='large' sx={{ width: 200 }}>
                    Mua ngay
                  </Button>
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </Box>
        <Box sx={{ p: 2, mb: 2, bgcolor: '#fff' }}>
          <Typography
            sx={{ width: '100%', p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
            Chi tiết sản phẩm
          </Typography>
          <Grid2 container spacing={1.5} ml={2} mb={3}>
            <Grid2 size={2}>Danh mục</Grid2>
            <Grid2 size={10}>{product?.category?.name}</Grid2>
            <Grid2 size={2}>Thương hiệu</Grid2>
            <Grid2 size={10}>{product?.brand}</Grid2>
            <Grid2 size={2}>Bảo hành</Grid2>
            <Grid2 size={10}>{product?.details?.guarantee}</Grid2>
            <Grid2 size={2}>Chất liệu</Grid2>
            <Grid2 size={10}>{product?.details?.material}</Grid2>
          </Grid2>
          <Typography
            sx={{ width: '100%', p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)' }}>
            Mô tả sản phẩm
          </Typography>
          <HtmlRenderBox html={product?.description} />
        </Box>
      </LayoutContainer>
    </Box>
  );
};

export default ProductDetail;
