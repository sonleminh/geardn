import { getOrderConfirm } from '@/data/order.server';
import { Box } from '@mui/material';
import OrderConfirmationClient from './OrderComfirmationClient';
import { notFound } from 'next/navigation';

export default async function OrderConfirmation({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const res = await getOrderConfirm(code);
  if (!res) notFound();

  return (
    <Box>
      <OrderConfirmationClient data={res.data} />
    </Box>
  );
}
