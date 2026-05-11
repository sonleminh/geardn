// app/login/_components/LoginSkeleton.tsx
import { Box, FormControl, Skeleton } from "@mui/material";

const LoginSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: { xs: "20px 40px 20px 40px", md: "20px 40px 20px 0" },
        height: "100%",
      }}
    >
      {/* Logo area */}
      <Box sx={{ mb: { xs: 2, md: 0 } }}>
        <Box
          sx={{
            display: { xs: "flex", md: "block" },
            alignItems: { xs: "center", md: "normal" },
            mb: 1,
          }}
        >
          {/* "Welcome to" text */}
          <Skeleton
            variant="text"
            width={100}
            height={32}
            sx={{ mb: { xs: 0, md: 1 }, mr: { xs: 1, md: 0 } }}
          />
          {/* Logo */}
          <Skeleton
            variant="rounded"
            width={145}
            height={60.5}
            sx={{ borderRadius: 2 }}
          />
        </Box>

        <Box>
          {/* Email field */}
          <FormControl fullWidth variant="standard" sx={{ maxHeight: 100 }}>
            <Skeleton variant="text" width={40} height={20} sx={{ mb: 0.5 }} />
            <Skeleton
              variant="rounded"
              height={40}
              sx={{ mt: { xs: 6, md: 6 }, borderRadius: 1 }}
            />
            {/* Reserve helperText space so layout doesn't shift */}
            <Skeleton variant="text" width={0} height={20} />
          </FormControl>

          {/* Password field */}
          <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
            <Skeleton variant="text" width={70} height={20} sx={{ mb: 0.5 }} />
            <Skeleton
              variant="rounded"
              height={40}
              sx={{ mt: { xs: 6, md: 6 }, borderRadius: 1 }}
            />
            <Skeleton variant="text" width={0} height={20} />
          </FormControl>

          {/* Login button */}
          <Skeleton
            variant="rounded"
            height={48}
            sx={{ mt: 3, borderRadius: 1 }}
          />
        </Box>
      </Box>

      {/* Google login button */}
      <Skeleton
        variant="rounded"
        height={40}
        width={220}
        sx={{ borderRadius: 4, mx: "auto" }}
      />

      {/* Signup link */}
      <Skeleton
        variant="text"
        width={220}
        height={24}
        sx={{ mt: { xs: 2, md: 0 }, mb: 2 }}
      />
    </Box>
  );
};

export default LoginSkeleton;
