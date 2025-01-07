'use client';

import bg from '@/../../public/setup-backgroud.jpg';
import SkeletonImage from '@/components/common/SkeletonImage';
import { BASE_API_URL } from '@/constants/env';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
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
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useFormik } from 'formik';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/providers/auth-store-provider';
import { ICustomJwtPayload } from '@/interfaces/IAuth';
import { loginAPI } from '@/services/auth/api';

export default function Login() {
  const router = useRouter();
  const { login } = useAuthStore((state) => state);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    // validationSchema: schema,
    validateOnChange: false,
    async onSubmit(values) {
      const userData = await loginAPI(values);
      // mutate(userData, false);
      login({
        _id: userData?._id,
        email: userData?.email,
        name: userData?.name,
      });

      if (userData?._id) {
        router.push('/tai-khoan');
      }
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    formik.setFieldValue(name, value);
  };

  const handleGoogleLogin = (credentialResponse: CredentialResponse) => {
    const credentialDecoded: ICustomJwtPayload = jwtDecode(
      credentialResponse?.credential as string
    );

    if (credentialResponse) {
      Cookies.set('GC', credentialResponse?.credential as string, {
        expires: credentialDecoded?.exp,
      });
      login({
        _id: credentialDecoded?.sub,
        email: credentialDecoded?.email as string,
        name: credentialDecoded?.name as string,
        picture: credentialDecoded?.picture,
      });
      router.push('/tai-khoan');
    }
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
              <SkeletonImage src={bg} alt='geardn' />
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
                  sx={{
                    mb: 1,
                    textTransform: 'uppercase',
                    fontSize: 20,
                    fontWeight: 600,
                  }}>
                  Welcome to GearDN
                </Typography>
                {/* <Typography sx={{ fontSize: 14, color: '#ababab' }}>
                  Đăng nhập
                </Typography> */}
              </Box>
              <Box>
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
                  disabled={!formik.values.email && !formik.values.password}
                  onClick={() => formik.handleSubmit()}>
                  Đăng nhập
                </Button>
              </Box>
            </Box>
            <GoogleLogin
              onSuccess={(credentialResponse: CredentialResponse) => {
                handleGoogleLogin(credentialResponse);
                // const credentialDecoded = jwtDecode(
                //   credentialResponse.credential as string
                // );
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
            <Typography sx={{ mb: 2 }}>
              Bạn chưa có tài khoản?{' '}
              <Link href={'/signup'}>
                {' '}
                <Typography component={'span'}>Đăng ký</Typography>
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
}
