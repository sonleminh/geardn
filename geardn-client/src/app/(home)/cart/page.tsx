import { getCartOnServer } from "@/data/cart.server";
import CartContainer from "./components/CartContainer";

export default async function Page() {
  const cart = await getCartOnServer();
  return <CartContainer initialCart={cart} />;
}
