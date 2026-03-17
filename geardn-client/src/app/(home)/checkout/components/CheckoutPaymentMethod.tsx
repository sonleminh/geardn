import { ChangeEvent } from "react";

import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import SkeletonImage from "@/components/common/SkeletonImage";

import { IPaymentMethod } from "@/interfaces/IPayment";
import "react-datepicker/dist/react-datepicker.css";

interface CheckoutPaymentProps {
  value: number | string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  paymentMethods?: IPaymentMethod[];
}

const CheckoutPaymentMethod = ({
  value,
  onChange,
  error,
  paymentMethods,
}: CheckoutPaymentProps) => {
  const helperTextStyle = { color: "#d32f2f", fontSize: "0.75rem" };

  return (
    <Box sx={{ p: 3, bgcolor: "#fff", borderRadius: "4px" }}>
      <FormControl error={Boolean(error)} fullWidth>
        <Typography sx={{ mb: 2, fontWeight: 600 }}>
          Phương thức thanh toán
        </Typography>

        <RadioGroup name="paymentMethodId" onChange={onChange} value={value}>
          {paymentMethods?.map((item) => (
            <FormControlLabel
              sx={{ my: 1 }}
              key={item?.key}
              value={item?.id}
              control={<Radio size="small" />}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: 32,
                      height: 32,
                      ml: 1,
                      mr: 1.5,
                      overflow: "hidden",
                      img: { objectFit: "cover" },
                    }}
                  >
                    <SkeletonImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="cart-item"
                    />
                  </Box>
                  <Typography sx={{ fontSize: 14 }}>{item?.name}</Typography>
                </Box>
              }
            />
          ))}
        </RadioGroup>

        {error && <FormHelperText sx={helperTextStyle}>{error}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default CheckoutPaymentMethod;
