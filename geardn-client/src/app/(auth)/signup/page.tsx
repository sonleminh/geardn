'use client';

import SkeletonImage from '@/components/common/SkeletonImage';
import { ROUTES } from '@/constants/route';
import { signUpSchema } from '@/features/auth/schemas/signup.schema';
import { AppError } from '@/lib/errors/app-error';
import { useSignup } from '@/queries/auth';
import { useNotificationStore } from '@/stores/notification-store';
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
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { toFormikValidationSchema } from 'zod-formik-adapter';

export default function SignUp() {
  const router = useRouter();
  const { showNotification } = useNotificationStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { mutateAsync: onSignup } = useSignup();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: toFormikValidationSchema(signUpSchema),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await onSignup(values);
        router.push(ROUTES.LOGIN);
        showNotification('Tạo tài khoản thành công', 'success');
      } catch (error) {
        const e = AppError.fromUnknown(error);
        showNotification(e.message, 'error');
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
              <SkeletonImage src={'/setup-background.jpg'} alt='geardn' />
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
                    name='name'
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
                        {formik.errors.name}
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
                    !formik.values.name ||
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
              <Link href={ROUTES.LOGIN}>
                <Typography component={'span'}>Login</Typography>
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
}
