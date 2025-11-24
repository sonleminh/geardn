import CartClient from './CartClient';
import { getCartOnServer } from '@/data/cart.server';

export default async function Page() {
  const cart = await getCartOnServer();
  return <CartClient initialCart={cart} />;
}
