import SkeletonImage from "@/components/common/SkeletonImage";
import { Box, Button, InputBase, Typography } from "@mui/material";
import ProductCatalog from "./components/product-catalog";

import BANNER_BG from "@/assets/geardn.jpg";
import LayoutContainer from "@/components/layout-container";
import Explore from "./components/explore";
import { getCategories } from "@/data/category.server";
import { getProducts } from "@/data/product.server";
import {
  parseProductListParams,
  toURLSearchParams,
} from "@/lib/search/productList.params";

export default async function Homepage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const parsed = parseProductListParams(resolvedParams);
  const qs = toURLSearchParams(parsed);

  const productPage = await getProducts(qs);
  const categoryPage = await getCategories();
  if (!productPage?.success && !categoryPage?.success) {
    throw new Error("Không tải được dữ liệu trang chủ");
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "300px", md: "800px" },
          overflow: "hidden",
          "& img": { objectFit: "cover" },
          ":before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            filter: "blur(8px)",
            zIndex: 1,
          },
        }}
      >
        <SkeletonImage
          src={BANNER_BG}
          alt="geardn"
          fill
          quality={90}
          priority
        />
      </Box>

      <section id="shop">
        <ProductCatalog
          products={productPage?.data}
          categories={categoryPage?.data}
          pagination={productPage?.meta}
          params={parsed}
        />
      </section>

      <Explore exploreData={productPage?.data} />

      <LayoutContainer>
        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            justifyContent: "space-between",
            p: 5,
            backgroundImage: "linear-gradient(#363636, #1E1E1E)",
            color: "#fff",
            borderRadius: 3,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "35%" }, mb: { xs: 4, md: 0 } }}>
            <Typography
              sx={{
                mb: { xs: 2, md: 4 },
                fontSize: { xs: 18, md: 30 },
                fontWeight: 600,
                lineHeight: { xs: "", md: "38px" },
              }}
            >
              Sẵn sàng khám phá những sản phẩm mới?
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "260px",
                p: "4px 4px 4px 16px",
                bgcolor: "#fff",
                borderRadius: 10,
              }}
            >
              <InputBase placeholder="Email .." />
              <Button
                variant="contained"
                sx={{ width: "88px", borderRadius: 10 }}
              >
                Gửi
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "normal", md: "end" },
              flexDirection: "column",
              width: { xs: "100%", md: 400 },
            }}
          >
            <Typography
              sx={{
                mb: 2,
                fontSize: { xs: 14, md: 16 },
                fontWeight: 600,
              }}
            >
              GearDN cung cấp các sản phẩm chất lượng tốt.
            </Typography>
            <Typography sx={{ color: "#bdbdbd", fontSize: { xs: 14, md: 16 } }}>
              Chúng tôi cung cấp nhiều sản phẩm với nhiều thương hiệu khác nhau
              để bạn có thể lựa chọn.
            </Typography>
          </Box>
        </Box>
      </LayoutContainer>
    </Box>
  );
}
