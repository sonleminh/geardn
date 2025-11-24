// app/error.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Container, Stack, Typography, Box } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [countdown, setCountdown] = useState(0); // đổi >0 để tự về trang chủ
  useEffect(() => {
    console.error(error);
  }, [error]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(
      () =>
        setCountdown((s) => {
          if (s <= 1) {
            window.location.assign('/');
            return 0;
          }
          return s - 1;
        }),
      1000
    );
    return () => clearInterval(t);
  }, [countdown]);

  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <Container
      maxWidth='sm'
      sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center' }}>
      <Stack spacing={3} sx={{ width: '100%', py: 6, textAlign: 'center' }}>
        <Typography variant='h3' fontWeight={700}>
          Đã xảy ra lỗi
        </Typography>

        <Typography variant='body1' color='text.secondary'>
          Rất tiếc, có vấn đề khi tải trang. Bạn có thể thử lại hoặc quay về
          trang chủ.
        </Typography>

        {isDev && (
          <Box
            component='pre'
            sx={{
              textAlign: 'left',
              p: 2,
              bgcolor: 'grey.900',
              color: 'grey.100',
              borderRadius: 2,
              overflow: 'auto',
              maxHeight: 240,
            }}>
            {error?.message || 'Unknown error'}
            {error?.digest ? `\n\ndigest: ${error.digest}` : ''}
          </Box>
        )}

        {countdown > 0 && (
          <Typography variant='caption' color='text.secondary'>
            Tự chuyển về trang chủ sau {countdown}s
          </Typography>
        )}

        <Stack direction='row' spacing={2} justifyContent='center'>
          <Button variant='contained' onClick={() => reset()}>
            Thử lại
          </Button>
          <Button variant='outlined' onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
          <Button component={Link} href='/' variant='text'>
            Về trang chủ
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
