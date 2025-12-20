"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import {
  Box,
  Button,
  FormControl,
  Grid2,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

import LOGO from "@/assets/geardn-logo.png";
import SkeletonImage from "@/components/common/SkeletonImage";
import { ROUTES } from "@/constants/route";
import { loginSchema } from "@/features/auth/schemas/login.schema";
import { IProductSkuAttributes } from "@/interfaces/IProductSku";
import { AppError } from "@/lib/errors/app-error";
import { useGoogleLogin, useLoginWithEmailPwd } from "@/queries/auth";
import { useSyncCart } from "@/queries/cart";
import { useCartStore } from "@/stores/cart-store";
import { useNotificationStore } from "@/stores/notification-store";
import { useQueryClient } from "@tanstack/react-query";
import AppLink from "../../../components/common/AppLink";

const LoginPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cartItems, syncCart } = useCartStore();
  const { showNotification } = useNotificationStore();
  const { mutateAsync: onSyncCart } = useSyncCart();
  const { mutateAsync: onLoginWithEmailPwd } = useLoginWithEmailPwd();
  const { mutateAsync: onGoogleLogin } = useGoogleLogin();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: toFormikValidationSchema(loginSchema),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        await onLoginWithEmailPwd(values);
        const syncPayload = cartItems?.map(
          ({ productId, skuId, quantity }) => ({
            productId,
            skuId,
            quantity,
          })
        );
        const updatedCart = await onSyncCart({ items: syncPayload });

        const syncCartData = updatedCart?.data?.items?.map((item) => ({
          productId: item?.productId,
          skuId: item?.sku?.id,
          productName: item?.product?.name,
          imageUrl: item?.sku?.imageUrl
            ? item?.sku?.imageUrl
            : item?.product?.images?.[0],
          sellingPrice: item?.sku?.sellingPrice,
          quantity: item?.quantity,
          attributes: item?.sku?.productSkuAttributes.map(
            (productSkuAttribute: IProductSkuAttributes) => ({
              attribute: productSkuAttribute?.attributeValue?.attribute?.name,
              attributeValue: productSkuAttribute?.attributeValue?.value,
            })
          ),
          cartItemId: item?.id,
        }));
        syncCart(syncCartData);
        router.push("/");
        router.refresh();
        queryClient.invalidateQueries({
          queryKey: ["whoami"],
        });
        showNotification("Đăng nhập thành công", "success");
      } catch (error) {
        const e = AppError.fromUnknown(error);
        showNotification(e?.message, "error");
      }
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    formik.setFieldValue(name, value);
  };

  const handleGoogleLogin = async (cred: CredentialResponse) => {
    const idToken = cred.credential;
    if (!idToken) return;
    try {
      await onGoogleLogin({ idToken });
      const syncPayload = cartItems?.map(({ productId, skuId, quantity }) => ({
        productId,
        skuId,
        quantity,
      }));
      const updatedCart = await onSyncCart({ items: syncPayload });
      const syncCartData = updatedCart?.data?.items?.map((item) => ({
        productId: item?.productId,
        skuId: item?.sku?.id,
        productName: item?.product?.name,
        imageUrl: item?.sku?.imageUrl
          ? item?.sku?.imageUrl
          : item?.product?.images?.[0],
        sellingPrice: item?.sku?.sellingPrice,
        quantity: item?.quantity,
        attributes: item?.sku?.productSkuAttributes.map(
          (productSkuAttribute: IProductSkuAttributes) => ({
            attribute: productSkuAttribute?.attributeValue?.attribute?.name,
            attributeValue: productSkuAttribute?.attributeValue?.value,
          })
        ),
        cartItemId: item?.id,
      }));
      syncCart(syncCartData);
      router.push("/");
      showNotification("Đăng nhập thành công", "success");
    } catch (error) {
      const e = AppError.fromUnknown(error);
      showNotification(e?.message, "error");
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100dvh",
        bgcolor: "#D7D6D9",
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", md: "1000px" },
          mx: "auto",
          bgcolor: "#fff",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Grid2 container spacing={{ xs: 0, md: 4 }}>
          <Grid2 size={{ xs: 0, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                display: { xs: "none", md: "block" },
                width: "100%",
                height: { xs: "300px", md: "500px" },
                overflow: "hidden",
                "& img": {
                  objectFit: "cover",
                },
              }}
            >
              <SkeletonImage src={"/setup-background.jpg"} alt="geardn" />
            </Box>
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: "20px 40px 20px 40px", md: "20px 40px 20px 0" },
            }}
          >
            <Box sx={{ mb: { xs: 2, md: 0 } }}>
              <Box
                sx={{
                  display: { xs: "flex", md: "block" },
                  alignItems: { xs: "center", md: "normal" },
                }}
              >
                <Typography
                  sx={{
                    mb: { xs: 0, md: 1 },
                    fontSize: { xs: 20, md: 20 },
                    fontWeight: 600,
                  }}
                >
                  Welcome to
                </Typography>
                <AppLink href={"/"}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "145px",
                      height: { xs: "60.5px" },
                      borderRadius: 2,
                      overflow: "hidden",
                      "& img": {
                        objectFit: "cover",
                      },
                    }}
                  >
                    <SkeletonImage
                      src={LOGO}
                      alt="geardn"
                      fill
                      quality={90}
                      priority
                    />
                  </Box>
                </AppLink>
              </Box>
              <Box>
                <FormControl
                  fullWidth
                  variant="standard"
                  sx={{ maxHeight: 100 }}
                >
                  <InputLabel>Email</InputLabel>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="email"
                    placeholder="username@gmail.com"
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person2OutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      <Typography
                        component={"span"}
                        sx={{ fontSize: 13, color: "red" }}
                      >
                        {formik.errors.email}
                      </Typography>
                    }
                    onChange={handleChange}
                    sx={{
                      height: { xs: 30, md: "auto" },
                      mt: { xs: 6, md: 6 },
                      borderRadius: 4,
                    }}
                  />
                </FormControl>
                <FormControl fullWidth variant="standard">
                  <InputLabel>Mật khẩu</InputLabel>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="*******"
                    autoFocus
                    helperText={
                      <Typography
                        component={"span"}
                        sx={{ fontSize: 13, color: "red" }}
                      >
                        {formik.errors.password}
                      </Typography>
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="start">
                          {formik.values.password ? (
                            <Box
                              onClick={() => setShowPassword(!showPassword)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                            >
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
                      if (e.key === "Enter") {
                        formik.handleSubmit();
                      }
                    }}
                    onChange={handleChange}
                    sx={{ mt: { xs: 6, md: 6 }, borderRadius: 4 }}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ height: 48, mt: 3 }}
                  disabled={!formik.values.email || !formik.values.password}
                  onClick={() => formik.handleSubmit()}
                >
                  Đăng nhập
                </Button>
              </Box>
            </Box>
            <GoogleLogin
              onSuccess={(cred: CredentialResponse) => {
                handleGoogleLogin(cred);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
            <Typography sx={{ mt: { xs: 2, md: 0 }, mb: 2 }}>
              Bạn chưa có tài khoản?{" "}
              <Link href={ROUTES.SIGNUP}>
                {" "}
                <Typography component={"span"}>Đăng ký</Typography>
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default LoginPage;
