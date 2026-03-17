import { Box, TextField, Typography } from "@mui/material";

// 1. Define exactly what this component needs to function
interface CheckoutInfoProps {
  values: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  errors: {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  touched?: {
    fullName?: boolean;
    phoneNumber?: boolean;
    email?: boolean;
  };
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const CheckoutInfo = ({
  values,
  errors,
  onChange,
  touched,
  onBlur,
}: CheckoutInfoProps) => {
  const helperTextStyle = { color: "error.main", fontSize: "0.75rem" };

  return (
    <Box sx={{ p: 2, mb: 2, bgcolor: "#fff", borderRadius: "4px" }}>
      <Typography sx={{ fontWeight: 600 }}>Thông tin đặt hàng</Typography>

      <TextField
        fullWidth
        margin="dense"
        placeholder="Họ và tên"
        name="fullName"
        value={values.fullName}
        onChange={onChange}
        onBlur={onBlur}
        error={touched?.fullName && Boolean(errors.fullName)}
        helperText={
          touched?.fullName && errors.fullName ? (
            <Box component="span" sx={helperTextStyle}>
              {errors.fullName}
            </Box>
          ) : null
        }
      />

      <TextField
        fullWidth
        margin="dense"
        placeholder="Số điện thoại"
        name="phoneNumber"
        value={values.phoneNumber}
        onChange={onChange}
        onBlur={onBlur}
        error={touched?.phoneNumber && Boolean(errors.phoneNumber)}
        helperText={
          touched?.phoneNumber && errors.phoneNumber ? (
            <Box component="span" sx={helperTextStyle}>
              {errors.phoneNumber}
            </Box>
          ) : null
        }
      />

      <TextField
        fullWidth
        margin="dense"
        placeholder="Email (Không bắt buộc)"
        type="email"
        name="email"
        value={values.email}
        onChange={onChange}
        onBlur={onBlur}
        error={touched?.email && Boolean(errors.email)}
        helperText={
          touched?.email && errors.email ? (
            <Box component="span" sx={helperTextStyle}>
              {errors.email}
            </Box>
          ) : null
        }
      />
    </Box>
  );
};

export default CheckoutInfo;
