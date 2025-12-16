'use client';

import { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material';

export default function CssBaselineClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <CssBaseline /> : null;
}
