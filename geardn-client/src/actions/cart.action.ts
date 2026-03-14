"use server";

import {
  IAddCartItemPayload,
  IUpdateQuantityPayload,
} from "@/interfaces/ICart";
import { getBackendBaseUrl } from "@/lib/backend-config";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const BE = getBackendBaseUrl();

export async function addCartItemDB(payload: IAddCartItemPayload) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const response = await fetch(`${BE}/carts/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi khi thêm vào giỏ hàng");
    }

    revalidatePath("/cart");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    };
  }
}

export async function updateCartItemDB(payload: IUpdateQuantityPayload) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const response = await fetch(`${BE}/carts/items/${payload.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi khi cập nhật giỏ hàng");
    }

    revalidatePath("/cart");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    };
  }
}

export async function removeCartItemDB(id: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const response = await fetch(`${BE}/carts/items/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi khi cập nhật giỏ hàng");
    }

    revalidatePath("/cart");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    };
  }
}
