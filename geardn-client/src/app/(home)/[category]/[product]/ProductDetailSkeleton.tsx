import { Box, Grid2, Skeleton, Stack } from "@mui/material";

export default function ProductDetailSkeleton() {
  return (
    <Box pt={2} pb={4}>
      <Box sx={{ mb: 2, px: { xs: 0.5, md: 0 } }}>
        <Skeleton variant="text" width={200} height={24} />
      </Box>

      <Box
        sx={{
          px: { xs: 0.5, md: 3 },
          mb: { xs: 4, md: 2 },
          bgcolor: "#fff",
          borderRadius: 1,
          pb: 3,
        }}
      >
        <Grid2 container columnSpacing={4}>
          <Grid2 size={{ xs: 12, md: 5 }} sx={{ py: 3 }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={400}
              sx={{ borderRadius: 1, mb: 2 }}
            />
            <Stack direction="row" spacing={1}>
              {[1, 2, 3, 4].map((item) => (
                <Skeleton
                  key={item}
                  variant="rectangular"
                  width={80}
                  height={80}
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Stack>
          </Grid2>

          <Grid2
            size={{ xs: 12, md: 7 }}
            sx={{
              pl: { xs: 0, md: 3 },
              borderLeft: { xs: "none", md: "1px solid #eee" },
            }}
          >
            <Box sx={{ pt: 3 }}>
              <Skeleton variant="text" height={40} width="90%" sx={{ mb: 1 }} />
              <Skeleton variant="text" height={40} width="60%" sx={{ mb: 1 }} />

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Skeleton variant="text" width={50} />
                <Skeleton variant="text" width={100} />
              </Stack>

              <Skeleton variant="text" height={60} width={200} sx={{ mb: 2 }} />

              {[1, 2].map((attr) => (
                <Box key={attr} sx={{ display: "flex", mb: 2 }}>
                  <Skeleton
                    variant="text"
                    width={80}
                    sx={{ mr: 2, flexShrink: 0 }}
                  />
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Skeleton variant="rectangular" width={70} height={32} />
                    <Skeleton variant="rectangular" width={70} height={32} />
                    <Skeleton variant="rectangular" width={70} height={32} />
                  </Stack>
                </Box>
              ))}

              <Grid2 container mt={4} mb={3} alignItems="center">
                <Grid2 size={{ xs: 2.5, md: 2 }}>
                  <Skeleton variant="text" width={60} />
                </Grid2>
                <Grid2 size={{ xs: 9.5, md: 10 }}>
                  <Skeleton variant="rectangular" width={120} height={32} />
                </Grid2>
              </Grid2>

              <Stack direction="row" spacing={2}>
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={48}
                  sx={{ borderRadius: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={48}
                  sx={{ borderRadius: 1 }}
                />
              </Stack>
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      <Box sx={{ p: { xs: 0, md: 2 }, mb: 2, bgcolor: "#fff" }}>
        <Skeleton variant="rectangular" height={50} sx={{ mb: 3 }} />

        <Grid2 container spacing={1.5} ml={2} mb={3}>
          {[1, 2, 3, 4].map((row) => (
            <Grid2 container size={12} key={row}>
              <Grid2 size={{ xs: 4, md: 2 }}>
                <Skeleton variant="text" width="80%" />
              </Grid2>
              <Grid2 size={{ xs: 8, md: 10 }}>
                <Skeleton variant="text" width="60%" />
              </Grid2>
            </Grid2>
          ))}
        </Grid2>

        <Skeleton variant="rectangular" height={50} sx={{ mb: 3 }} />

        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} width="90%" sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={200} width="100%" />
        </Box>
      </Box>
    </Box>
  );
}
