'use client';

import { BASE_API_URL } from '@/constants/env';
import { getRequest } from '@/utils/fetch-client';
// import { getRequest } from '@/services/axios';
import { Button } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Cookie() {
  const [callAPI, setCallAPI] = useState(false);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await getRequest(`${BASE_API_URL}/auth/ck`);
  //       console.log(res);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, [callAPI]);
  useEffect(() => {
    // Tạo cookie rt='cc' nếu chưa có
    // document.cookie = 'rt=cc; path=/';

    const fetchData = async () => {
      try {
        const response = await getRequest(`${BASE_API_URL}/auth/ck`);

        // const response = await fetch(`${BASE_API_URL}/auth/ck`, {
        //   method: 'GET',
        //   credentials: 'include', // Để gửi cookie cùng request
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });

        console.log(response);

        // if (!response.ok) {
        //   throw new Error(`Error: ${response.status}`);
        // }

        // const result = await response.json();
        // setData(result);
      } catch (err) {
        // setError(err.message);
        console.log(err);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <Button onClick={() => setCallAPI(!callAPI)}>Cookie</Button>
      <Link href={'/login'}>Login</Link>
    </>
  );
}
