'use client';

import SkeletonImage from '@/components/common/SkeletonImage';
import {
  Box,
  Button,
  FormControl,
  Grid2,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import bg from '@/../../public/setup-backgroud.jpg';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import * as yup from 'yup';
import { useFormik } from 'formik';
import LockIcon from '@mui/icons-material/Lock';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useSWR from 'swr';
import { useGetFake } from '@/services/queries';
import { fetcher } from '@/services/fetcher';
import Link from 'next/link';
import { BASE_API_URL } from '@/constants/env';
import { useSignUpAPI } from '@/services/mutations';
import { signUp } from '@/services/auth';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { mutate } = useSignUpAPI();

  const formik = useFormik({
    initialValues: { fullName: '', email: '', password: '' },
    // validationSchema: schema,
    validateOnChange: false,
    async onSubmit(values) {
      // signInMutation.mutate(values);
      const result = await signUp(values);
      mutate(result, false);
      if (result._id) {
        router.push('/login');
      }
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    formik.setFieldValue(name, value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        bgcolor: '#D7D6D9',
      }}>
      <Box
        sx={{
          width: 1000,
          mx: 'auto',
          bgcolor: '#fff',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
        <Grid2 container spacing={4}>
          <Grid2 size={6}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '500px' },
                overflow: 'hidden',
                '& img': {
                  objectFit: 'cover',
                },
              }}>
              <SkeletonImage src={bg} alt='cc' />
            </Box>
          </Grid2>
          <Grid2
            size={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: '20px 40px 20px 0',
            }}>
            <Box>
              <Box>
                <Typography
                  sx={{ mb: 1, textTransform: 'uppercase', fontSize: 20 }}>
                  Create your account!
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#ababab' }}>
                  Access ...
                </Typography>
              </Box>
              <Box>
                <FormControl
                  fullWidth
                  variant='standard'
                  sx={{ maxHeight: 100 }}>
                  <InputLabel>Họ và tên</InputLabel>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    name='fullName'
                    placeholder='Your full name'
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Person2OutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      <Typography
                        component={'span'}
                        sx={{ fontSize: 13, color: 'red' }}>
                        {formik.errors.fullName}
                      </Typography>
                    }
                    onChange={handleChange}
                    sx={{ mt: 6, borderRadius: 4 }}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  variant='standard'
                  sx={{ maxHeight: 100 }}>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    name='email'
                    placeholder='username@gmail.com'
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Person2OutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      <Typography
                        component={'span'}
                        sx={{ fontSize: 13, color: 'red' }}>
                        {formik.errors.email}
                      </Typography>
                    }
                    onChange={handleChange}
                    sx={{ mt: 6, borderRadius: 4 }}
                  />
                </FormControl>
                <FormControl fullWidth variant='standard'>
                  <InputLabel>Mật khẩu</InputLabel>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder='*******'
                    autoFocus
                    helperText={
                      <Typography
                        component={'span'}
                        sx={{ fontSize: 13, color: 'red' }}>
                        {formik.errors.password}
                      </Typography>
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LockIcon sx={{ fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='start'>
                          {formik.values.password ? (
                            <Box
                              onClick={() => setShowPassword(!showPassword)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                              }}>
                              {showPassword ? (
                                <Visibility sx={{ fontSize: 20 }} />
                              ) : (
                                <VisibilityOff sx={{ fontSize: 20 }} />
                              )}
                            </Box>
                          ) : (
                            <></>
                          )}
                        </InputAdornment>
                      ),
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        formik.handleSubmit();
                      }
                    }}
                    onChange={handleChange}
                    sx={{ mt: 6, borderRadius: 4 }}
                  />
                </FormControl>
                <Button
                  variant='contained'
                  fullWidth
                  sx={{ height: 48, mt: 3 }}
                  disabled={
                    !formik.values.fullName ||
                    !formik.values.email ||
                    !formik.values.password
                  }
                  onClick={() => formik.handleSubmit()}>
                  Đăng nhập
                </Button>
              </Box>
            </Box>
            <Typography sx={{ mb: 2 }}>
              Already have an account?{' '}
              <Link href={'/login'}>
                <Typography component={'span'}>Login</Typography>
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
}
