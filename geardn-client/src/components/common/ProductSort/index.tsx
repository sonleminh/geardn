"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");

  let currentValue = "newest";
  if (sortBy === "price" && order === "asc") currentValue = "price_asc";
  if (sortBy === "price" && order === "desc") currentValue = "price_desc";

  const handleChange = (event: SelectChangeEvent) => {
    const val = event.target.value;
    const nextParams = new URLSearchParams(searchParams.toString());

    nextParams.set("page", "1");

    if (val === "price_asc") {
      nextParams.set("sortBy", "price");
      nextParams.set("order", "asc");
    } else if (val === "price_desc") {
      nextParams.set("sortBy", "price");
      nextParams.set("order", "desc");
    } else {
      nextParams.delete("sortBy");
      nextParams.delete("order");
    }

    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography
        sx={{ fontSize: { xs: 12, md: 14 }, color: "text.secondary" }}
      >
        Sắp xếp theo:
      </Typography>
      <FormControl size="small">
        <Select
          value={currentValue}
          onChange={handleChange}
          MenuProps={{
            disableScrollLock: true,
          }}
          sx={{
            fontSize: 14,
            minWidth: 160,
            bgcolor: "#fff",
            "& .MuiSelect-select": { py: 1 },
          }}
        >
          <MenuItem value="newest" sx={{ fontSize: 14 }}>
            Mới nhất
          </MenuItem>
          <MenuItem value="price_asc" sx={{ fontSize: 14 }}>
            Giá thấp đến cao
          </MenuItem>
          <MenuItem value="price_desc" sx={{ fontSize: 14 }}>
            Giá cao đến thấp
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
