import { ChangeEvent } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ILocation, ILocationOption } from "@/interfaces/ILocation";
import { BaseResponse } from "@/types/response.type";

const helperTextStyle = { color: "#d32f2f", fontSize: "0.75rem" };
const selectStyle = {
  "& .MuiFilledInput-root": {
    overflow: "hidden",
    borderRadius: 1,
    backgroundColor: "#fff !important",
    border: "1px solid",
    borderColor: "rgba(0,0,0,0.23)",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      border: "2px solid",
    },
  },
  "& .MuiInputLabel-asterisk": {
    color: "red",
  },
};
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface CheckoutShippingProps {
  values: {
    shipment: { method: number; deliveryDate: Date; address?: string };
    note: string;
  };
  errors: { note?: string };
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  setFieldValue: (field: string, value: string | number | Date | null) => void;

  // States
  province: ILocationOption | null;
  setProvince: (val: ILocationOption | null) => void;
  ward: ILocationOption | null;
  setWard: (val: ILocationOption | null) => void;
  detailAddress: string;
  setDetailAddress: (val: string) => void;
  shopAddress: string;
  setShopAddress: (val: string) => void;

  // Modal & Errors
  modalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  handleConfirmAddress: () => void;
  shipmentError: boolean;

  provinceOptions: ILocationOption[];
  provinceData: BaseResponse<ILocation> | undefined | null;
}

const CheckoutShipping = ({
  values,
  errors,
  handleChange,
  setFieldValue,
  province,
  setProvince,
  ward,
  setWard,
  detailAddress,
  setDetailAddress,
  shopAddress,
  setShopAddress,
  modalOpen,
  handleModalOpen,
  handleModalClose,
  handleConfirmAddress,
  shipmentError,
  provinceOptions,
  provinceData,
}: CheckoutShippingProps) => {
  return (
    <Box sx={{ p: 2, mb: 2, bgcolor: "#fff", borderRadius: "4px" }}>
      <RadioGroup
        sx={{ mb: 1 }}
        row
        name="shipment.method"
        onChange={handleChange}
        value={values?.shipment?.method}
      >
        <FormControlLabel
          value={1}
          control={<Radio size="small" />}
          label={
            <Typography sx={{ fontSize: 14 }}>Giao hàng tận nơi</Typography>
          }
        />
        <FormControlLabel
          value={2}
          control={<Radio size="small" />}
          label={
            <Typography sx={{ fontSize: 14 }}>Nhận tại cửa hàng</Typography>
          }
        />
      </RadioGroup>

      <Grid2 mb={2} container rowSpacing={2} columnSpacing={4}>
        {values?.shipment?.method == 1 ? (
          <Grid2 size={12}>
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: detailAddress ? "start" : "center",
                  width: "100%",
                  p: 1.5,
                  minHeight: 56,
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
                onClick={handleModalOpen}
              >
                {detailAddress && !modalOpen ? (
                  <>
                    <Box>
                      <Typography sx={{ color: "#6b7280", fontSize: 13 }}>
                        Giao tới
                      </Typography>
                      <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                        {ward?.name}, {province?.name}
                      </Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        {detailAddress}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ color: "#1250dc", fontSize: 14, fontWeight: 600 }}
                    >
                      Thay đổi
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography sx={{ color: "#9ca3af" }}>
                      Tỉnh/Thành Phố, Phường Xã
                    </Typography>
                    <ChevronRightIcon />
                  </>
                )}
              </Box>
              {shipmentError && (
                <FormHelperText sx={{ mx: "14px" }}>
                  <Box component={"span"} sx={helperTextStyle}>
                    Vui lòng nhập thông tin nhận hàng
                  </Box>
                </FormHelperText>
              )}
            </>
            <Modal
              open={modalOpen}
              onClose={handleModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <Typography
                  sx={{ mb: 2, textAlign: "center", fontWeight: 600 }}
                >
                  Thêm địa chỉ nhận hàng
                </Typography>
                <FormControl fullWidth margin="dense">
                  <Autocomplete
                    disablePortal
                    options={provinceOptions}
                    renderInput={(params) => (
                      <TextField {...params} label="Tỉnh/Thành phố" />
                    )}
                    onChange={(e, value) => setProvince(value)}
                    value={province}
                    isOptionEqualToValue={(option, value) =>
                      option?.code === value?.code
                    }
                    getOptionLabel={(option) => option?.name ?? ""}
                  />
                </FormControl>

                <FormControl fullWidth margin="dense">
                  <Autocomplete
                    disablePortal
                    options={provinceData?.data.wards ?? []}
                    renderInput={(params) => (
                      <TextField {...params} label="Phường/Xã" />
                    )}
                    onChange={(e, value) => setWard(value)}
                    value={ward}
                    isOptionEqualToValue={(option, value) =>
                      option?.code === value?.code
                    }
                    getOptionLabel={(option) => option?.name ?? ""}
                    disabled={!province}
                  />
                </FormControl>

                <FormControl
                  sx={{
                    mb: 2.5,
                    textarea: {
                      fontFamily: "Roboto, sans-serif",
                      "::placeholder": { fontSize: 16, color: "#9ca3af" },
                    },
                  }}
                  margin="dense"
                  fullWidth
                >
                  <textarea
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid rgba(0, 0, 0, 0.23)",
                      borderRadius: "4px",
                      fontSize: 16,
                    }}
                    rows={4}
                    placeholder="Địa chỉ cụ thể"
                    onChange={(e) => setDetailAddress(e.target.value)}
                    value={detailAddress}
                  />
                </FormControl>
                <Button
                  aria-label="Xác nhận"
                  sx={{ width: "100%" }}
                  variant="contained"
                  disabled={
                    !province || !ward || !Boolean(detailAddress?.length > 3)
                  }
                  onClick={handleConfirmAddress}
                >
                  Xác nhận
                </Button>
              </Box>
            </Modal>

            <FormControl
              sx={{
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0,0,0,0.23) !important",
                },
                ".date-picker": {
                  width: "300px",
                  height: 50,
                  pl: 5,
                  fontSize: 15,
                },
                ".react-datepicker__calendar-icon": {
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                },
              }}
              fullWidth
              margin="dense"
            >
              <Typography sx={{ mb: 1, mt: 2 }}>
                Thời gian nhận hàng:
              </Typography>
              <DatePicker
                showTimeSelect
                showIcon
                icon={<CalendarTodayOutlinedIcon />}
                selected={values?.shipment?.deliveryDate}
                onChange={(e) => setFieldValue("shipment.deliveryDate", e)}
                minTime={new Date(new Date().setHours(7, 0, 0, 0))}
                maxTime={new Date(new Date().setHours(23, 30, 0, 0))}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy HH:mm"
                timeFormat="HH:mm"
                className="date-picker"
              />
            </FormControl>
          </Grid2>
        ) : (
          <Grid2 size={12}>
            <FormControl variant="filled" fullWidth sx={selectStyle}>
              <InputLabel>Chọn shop có hàng gần nhất</InputLabel>
              <Select
                disableUnderline
                size="small"
                onChange={(e) => setShopAddress(e.target.value as string)}
                value={shopAddress}
              >
                <MenuItem
                  value={"39 Cù Chính Lan, P.Hòa Khê, Q.Thanh Khê, TP.Đà Nẵng"}
                >
                  39 Cù Chính Lan, P.Hòa Khê, Q.Thanh Khê, TP.Đà Nẵng
                </MenuItem>
                <MenuItem
                  value={"02 Tô Hiến Thành, P.Phước Mỹ, Q.Sơn Trà, TP.Đà Nẵng"}
                >
                  02 Tô Hiến Thành, P.Phước Mỹ, Q.Sơn Trà, TP.Đà Nẵng
                </MenuItem>
              </Select>
            </FormControl>
            {shipmentError && (
              <FormHelperText sx={{ mx: "14px" }}>
                <Box component={"span"} sx={helperTextStyle}>
                  Vui lòng nhập thông tin nhận hàng
                </Box>
              </FormHelperText>
            )}

            <FormControl
              sx={{
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0,0,0,0.23) !important",
                },
                ".date-picker": {
                  width: "300px",
                  height: 50,
                  pl: 5,
                  fontSize: 15,
                },
                ".react-datepicker__calendar-icon": {
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                },
              }}
              margin="dense"
            >
              <Typography sx={{ mb: 1, mt: 2 }}>
                Thời gian nhận hàng:
              </Typography>
              <DatePicker
                showTimeSelect
                showIcon
                icon={<CalendarTodayOutlinedIcon />}
                selected={values?.shipment?.deliveryDate}
                onChange={(e) => setFieldValue("shipment.deliveryDate", e)}
                minTime={new Date(new Date().setHours(7, 0, 0, 0))}
                maxTime={new Date(new Date().setHours(23, 30, 0, 0))}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy HH:mm"
                timeFormat="HH:mm"
                className="date-picker"
              />
            </FormControl>
          </Grid2>
        )}

        <Grid2 size={12}>
          <FormControl
            variant="filled"
            fullWidth
            sx={{
              textarea: {
                fontFamily: "Roboto, sans-serif",
                "::placeholder": { fontSize: 16, color: "#9ca3af" },
              },
            }}
          >
            <textarea
              placeholder="Ghi chú (Ví dụ: Hãy gọi cho tôi khi chuẩn bị hàng xong)"
              name="note"
              rows={4}
              onChange={handleChange}
              value={values?.note}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: "4px",
                fontSize: 16,
              }}
              onFocus={(e) => (e.target.style.outline = "1px solid #000")}
              onBlur={(e) => (e.target.style.outline = "none")}
            />
            <FormHelperText sx={helperTextStyle}>{errors?.note}</FormHelperText>
          </FormControl>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default CheckoutShipping;
