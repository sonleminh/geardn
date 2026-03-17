"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import { Box, Button, Grid2, Typography } from "@mui/material";

import Breadcrumbs from "@/components/common/Breadcrumbs";

import { ROUTES } from "@/constants/route";

import LayoutContainer from "@/components/layout-container";
import { checkoutSchema } from "@/features/orders/schemas/checkout.schema";
import { useSession } from "@/hooks/useSession";
import { ILocationOption } from "@/interfaces/ILocation";
import { useProvince, useProvinces } from "@/queries/location";
import { useCreateOrder } from "@/queries/order";
import { usePaymentMethods } from "@/queries/payment";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useNotificationStore } from "@/stores/notification-store";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import { toFormikValidationSchema } from "zod-formik-adapter";
import CheckoutInfo from "./CheckoutInfo";
import CheckoutItem from "./CheckoutItem";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";
import CheckoutShipping from "./CheckoutShipping";
import CheckoutSummary from "./CheckoutSummary";

const CheckoutContainer = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { checkoutCart } = useAuthStore();
  const { showNotification } = useNotificationStore();
  const { data: userSession } = useSession();
  const { removeItem } = useCartStore();

  const breadcrumbsOptions = [
    { href: "/", label: "Trang chủ" },
    { href: ROUTES.CHECKOUT, label: "Thanh toán" },
  ];

  const [province, setProvince] = useState<ILocationOption | null>(null);
  const [ward, setWard] = useState<ILocationOption | null>(null);
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [shopAddress, setShopAddress] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [shipmentError, setShipmentError] = useState(false);

  const { data: provinces } = useProvinces();
  const { data: provinceData } = useProvince(province?.code);
  const { data: paymentMethods } = usePaymentMethods();
  const { mutate: onCreateOrder, isPending: isCreateOrderLoading } =
    useCreateOrder();

  const provinceOptions = Object.values(provinces ?? {})
    .filter((p) => p && typeof p === "object" && p.code != null && p.name)
    .filter((p, idx, arr) => arr.findIndex((x) => x.code === p.code) === idx);
  useEffect(() => {
    setWard(null);
  }, [province?.code]);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    if (!detailAddress) {
      setProvince(null);
      setWard(null);
      setDetailAddress("");
    }
  };

  const formik = useFormik({
    initialValues: {
      totalPrice: 0,
      fullName: "",
      phoneNumber: "",
      email: "",
      note: "",
      flag: {
        isOnlineOrder: true,
      },
      shipment: {
        method: 1,
        address: "",
        deliveryDate: moment().toDate(),
      },
      paymentMethodId: 1,
    },
    validationSchema: toFormikValidationSchema(checkoutSchema),
    validateOnChange: false,
    async onSubmit(values) {
      if (
        (values?.shipment?.method == 1 && !detailAddress) ||
        (values?.shipment?.method == 2 && !shopAddress)
      ) {
        return setShipmentError(true);
      } else {
        setShipmentError(false);
      }
      const payload = {
        ...values,
        orderItems: checkoutCart?.map((item) => ({
          skuId: item.skuId,
          quantity: item.quantity,
        })),
        shipment: {
          ...values?.shipment,
          method: +values?.shipment?.method,
          address:
            values?.shipment?.method === 1
              ? `${detailAddress}, ${ward?.name}, ${province?.name}`
              : shopAddress,
        },
        userId: userSession?.data?.id ?? null,
      };
      onCreateOrder(payload, {
        onSuccess: (data) => {
          checkoutCart?.forEach((item) => {
            removeItem(item?.skuId);
          });
          router.push(`${ROUTES.ORDER_CONFIRMATION}/${data?.data?.orderCode}`);
          queryClient.invalidateQueries({
            queryKey: ["user-purchases"],
          });
        },
        onError: () => {
          showNotification("Đã có lỗi xảy ra", "error");
        },
      });
    },
  });

  const totalAmount = useMemo(() => {
    return checkoutCart?.reduce(
      (acc, item) => acc + item.sellingPrice * item.quantity,
      0
    );
  }, [checkoutCart]);

  const handleConfirmAddress = () => {
    setModalOpen(false);
  };
  return (
    <Box pt={2} pb={{ xs: 30, md: 4 }} bgcolor={"#F3F4F6"}>
      <LayoutContainer>
        <Box sx={{}}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Button
          aria-label="Quay lại giỏ hàng"
          component={Link}
          href={ROUTES.CART}
        >
          <ChevronLeftOutlinedIcon />
          Quay lại giỏ hàng
        </Button>

        <Grid2 container spacing={2}>
          <Grid2 sx={{}} size={{ xs: 12, md: 8.5 }}>
            <Box sx={{ p: 2, mb: 2, bgcolor: "#fff", borderRadius: "4px" }}>
              <Box sx={{ display: { xs: "flex", md: "flex" } }}>
                <Typography sx={{ flex: 7 }}>Sản phẩm</Typography>
                <Typography sx={{ flex: 2, textAlign: "center", fontSize: 14 }}>
                  Đơn giá
                </Typography>
                <Typography
                  sx={{
                    display: { xs: "none", md: "block" },
                    flex: { xs: 1, md: 2 },
                    textAlign: "center",
                    fontSize: 14,
                  }}
                >
                  Số lượng
                </Typography>
                <Typography
                  sx={{
                    display: { xs: "unset", md: "none" },
                    flex: { xs: 1, md: 2 },
                    textAlign: "center",
                    fontSize: 14,
                  }}
                >
                  SL
                </Typography>
                <Typography
                  sx={{
                    display: { xs: "none", md: "block" },
                    flex: 2,
                    textAlign: "center",
                    fontSize: 14,
                  }}
                >
                  Thành tiền
                </Typography>
              </Box>
              {checkoutCart?.map((item, index) => (
                <CheckoutItem key={item.skuId} item={item} index={index} />
              ))}
            </Box>
            <CheckoutInfo
              values={formik.values}
              errors={formik.errors}
              touched={formik.touched}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <CheckoutShipping
              values={formik.values}
              errors={formik.errors}
              handleChange={formik.handleChange}
              setFieldValue={formik.setFieldValue}
              province={province}
              setProvince={setProvince}
              ward={ward}
              setWard={setWard}
              detailAddress={detailAddress}
              setDetailAddress={setDetailAddress}
              shopAddress={shopAddress}
              setShopAddress={setShopAddress}
              modalOpen={modalOpen}
              handleModalOpen={handleModalOpen}
              handleModalClose={handleModalClose}
              handleConfirmAddress={handleConfirmAddress}
              shipmentError={shipmentError}
              provinceOptions={provinceOptions}
              provinceData={provinceData}
            />
            <CheckoutPaymentMethod
              value={formik.values.paymentMethodId}
              onChange={formik.handleChange}
              error={formik.errors.paymentMethodId}
              paymentMethods={paymentMethods?.data}
            />
          </Grid2>
          <CheckoutSummary
            isCreateOrderLoading={isCreateOrderLoading}
            totalAmount={totalAmount}
            onSubmitOrder={formik.handleSubmit}
          />
        </Grid2>
      </LayoutContainer>
    </Box>
  );
};

export default CheckoutContainer;
