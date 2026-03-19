"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import SkeletonImage from "../common/SkeletonImage";

import { ROUTES } from "@/constants/route";
import { useSession } from "@/hooks/useSession";
import { IUser } from "@/interfaces/IUser";
import { AppError } from "@/lib/errors/app-error";
import { useLogout } from "@/queries/auth";
import { useCartStore } from "@/stores/cart-store";
import { useNotificationStore } from "@/stores/notification-store";
import AppLink from "../common/AppLink";
import SearchIconExpand from "../common/SearchIconExpand";
import { HeaderStyle } from "./style";
import { searchProducts } from "@/services/products";
import { IProduct } from "@/interfaces/IProduct";
import { formatPrice } from "@/utils/format-price";

const Header = ({ initialUser }: { initialUser?: IUser | null }) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();

  const { cartItems } = useCartStore((state) => state);

  const { data } = useSession();
  const { mutateAsync: onLogout } = useLogout();

  const userData = data?.data ?? initialUser;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMenuDrawer, setOpenMenuDrawer] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [liveResults, setLiveResults] = useState<IProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleLiveSearch = async (keyword: string) => {
    if (!keyword.trim()) return;

    try {
      const results = await searchProducts({
        keyword: keyword,
        page: 1,
        limit: 5,
        sortBy: "createdAt",
        order: "desc",
      });

      if (results && results.data) {
        setLiveResults(results.data);
      } else {
        setLiveResults([]);
      }
    } catch (error) {
      console.error(error);
      setLiveResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFullSearch = (keyword: string) => {
    router.push(`/search?keyword=${keyword}`);
  };

  const handleStartTyping = (keyword: string) => {
    setSearchTerm(keyword);

    if (keyword.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setLiveResults([]);
    }
  };

  const toggleMenuDrawer = (newOpen: boolean) => () => {
    setOpenMenuDrawer(newOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsExpanded(window.scrollY > 720);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToProductList = () => {
    const productList = document.getElementById("shop");
    if (productList) {
      productList.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#shop");
    }
  };

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      router.push(ROUTES.LOGIN);
      queryClient.removeQueries({
        queryKey: ["whoami"],
      });
      queryClient.removeQueries({
        queryKey: ["user-purchases"],
      });
      queryClient.removeQueries({
        queryKey: ["cart"],
      });
      showNotification("Đăng xuất thành công", "success");
    } catch (error) {
      const e = AppError.fromUnknown(error);
      showNotification(e?.message, "error");
    }
  };
  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!userData) {
      router.push(ROUTES.LOGIN);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <Box sx={HeaderStyle(isExpanded, pathname)}>
      <Box className="header-main">
        <Grid2 container height={{ xs: 68, md: 80 }}>
          <Grid2
            size={{ xs: 3, md: 4.5 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <AppLink href={"/"}>
              <Box className="header-logo">
                <SkeletonImage
                  src={"/geardn-logo.png"}
                  alt="Hình ảnh logo thương hiệu GearDN"
                  fill
                  quality={90}
                  priority
                />
              </Box>
            </AppLink>
          </Grid2>
          <Grid2
            size={{ xs: 0, md: 3 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <List
              sx={{
                display: { xs: "none", md: "flex" },
                width: "100%",
                "> li": {
                  justifyContent: "center",
                  p: 0,
                  ":hover": {
                    " p": {
                      ":before": {
                        transform: "scaleX(1)",
                      },
                    },
                  },
                  " p": {
                    position: "relative",
                    cursor: "pointer",
                    ":before": {
                      content: '""',
                      position: "absolute",
                      bottom: "-4px",
                      left: 0,
                      width: "100%",
                      height: "2px",
                      bgcolor: "#000",
                      transition: "transform .2s",
                      transform: "scaleX(0)",
                      transformOrigin: "top left",
                    },
                  },
                },
              }}
            >
              <ListItem>
                <Typography onClick={scrollToProductList}>Danh mục</Typography>
              </ListItem>
              <ListItem>
                <Typography onClick={scrollToProductList}>Shop</Typography>
              </ListItem>
              <ListItem>
                <AppLink href={"https://www.facebook.com/geardnha/"}>
                  <Typography>Liên hệ</Typography>
                </AppLink>
              </ListItem>
            </List>
          </Grid2>
          <Grid2
            size={{ xs: 9, md: 4.5 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                width: "100%",
              }}
            >
              <SearchIconExpand
                onType={handleLiveSearch}
                onStartTyping={handleStartTyping}
                onSubmit={handleFullSearch}
                placeholder="Tìm sản phẩm…"
                debounceMs={500}
                dropdownContent={
                  <Box>
                    {searchTerm && (
                      <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{ bgcolor: "#f5f5f5", px: 2, py: 1.5 }}
                      >
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                          Kết quả tìm kiếm:
                        </Typography>
                      </Box>
                    )}

                    <Box
                      sx={{ maxHeight: 500, overflowY: "auto", minHeight: 100 }}
                    >
                      {isSearching ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 100,
                          }}
                        >
                          <Typography
                            sx={{ fontSize: 13, color: "text.secondary" }}
                          >
                            Đang tìm kiếm...
                          </Typography>
                        </Box>
                      ) : liveResults.length === 0 && searchTerm ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 100,
                          }}
                        >
                          <Typography
                            sx={{ fontSize: 13, color: "text.secondary" }}
                          >
                            Không tìm thấy sản phẩm.
                          </Typography>
                        </Box>
                      ) : (
                        liveResults.map((item) => (
                          <MenuItem
                            key={item.id}
                            onClick={() =>
                              router.push(`/product/${item.slug || item.id}`)
                            }
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                              px: 2,
                              py: 1,
                              whiteSpace: "normal",
                              borderBottom: "1px solid #f0f0f0",
                              "&:last-child": {
                                borderBottom: "none",
                              },
                              "&:hover": {
                                bgcolor: "#f9f9f9",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                flexShrink: 0,
                                position: "relative",
                                bgcolor: "#fff",
                                borderRadius: 1,
                                overflow: "hidden",
                              }}
                            >
                              <SkeletonImage
                                src={item.images[0]}
                                alt={item.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  lineHeight: 1.4,
                                  color: "#333",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {item.name}
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#d32f2f",
                                  }}
                                >
                                  {formatPrice(item.priceMin)}
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))
                      )}
                    </Box>
                  </Box>
                }
              />
              <Button
                aria-label="Xem giỏ hàng"
                sx={{
                  position: "relative",
                  minWidth: 40,
                  height: 40,
                  ml: { xs: 0, md: 1 },
                  mr: { xs: 0.5, md: 0 },
                }}
                onClick={() => router.push(ROUTES.CART)}
              >
                <ShoppingCartOutlinedIcon />
                <Typography
                  sx={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "20px",
                    height: "20px",
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor: "#000",
                    color: "#fff",
                  }}
                >
                  {cartItems ? cartItems?.length : 0}
                </Typography>
              </Button>

              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {userData !== null ? (
                  userData?.picture ? (
                    <Button
                      aria-label="Xem user menu / Đăng nhập"
                      sx={{}}
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        handleUserClick(e)
                      }
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: "30px",
                          height: "30px",
                          mr: 1,
                          overflow: "hidden",
                          borderRadius: 20,
                          "& img": {
                            objectFit: "cover",
                          },
                        }}
                      >
                        <SkeletonImage
                          src={userData?.picture}
                          alt="Hình ảnh đại diện của người dùng"
                          fill
                        />
                      </Box>
                      <Typography sx={{ fontSize: 14, textTransform: "none" }}>
                        {userData?.name}
                      </Typography>
                    </Button>
                  ) : (
                    <Button
                      disableRipple
                      disableFocusRipple
                      aria-label="Xem user menu / Đăng nhập"
                      sx={{
                        minWidth: 40,
                        height: 40,
                        bgcolor: "transparent",
                        "&:hover": { backgroundColor: "transparent" },
                      }}
                      onClick={handleUserClick}
                    >
                      <AccountCircleIcon
                        sx={{ mr: 0.5, ml: 1.5, fontSize: 32 }}
                      />
                      <Typography sx={{ fontSize: 14, textTransform: "none" }}>
                        {userData?.name}
                      </Typography>
                    </Button>
                  )
                ) : (
                  <Button
                    aria-label="Đăng nhập / Đăng ký"
                    sx={{ width: 40, minWidth: 40, height: 40, ml: 1 }}
                    className="user-icon"
                    onClick={handleUserClick}
                  >
                    <AccountCircleIcon sx={{ fontSize: 30 }} />
                  </Button>
                )}
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  disableScrollLock={true}
                >
                  <MenuItem onClick={() => router.push(ROUTES.ACCOUNT)}>
                    Tài khoản của tôi
                  </MenuItem>
                  <MenuItem onClick={() => router.push(ROUTES.PURCHASE)}>
                    Đơn mua
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </Box>

              <IconButton
                aria-label="Mở menu điều hướng"
                onClick={toggleMenuDrawer(true)}
              >
                <MenuIcon
                  sx={{ display: { xs: "block", md: "none" }, mr: 1 }}
                />
              </IconButton>
              <Drawer
                anchor="right"
                open={openMenuDrawer}
                onClose={toggleMenuDrawer(false)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onClick={toggleMenuDrawer(false)}
                >
                  <List>
                    <ListItem
                      disablePadding
                      onClick={() =>
                        router.push(
                          userData?.name ? ROUTES.ACCOUNT : ROUTES.LOGIN
                        )
                      }
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <AccountCircleOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={userData ? userData?.name : "Đăng nhập"}
                        />
                      </ListItemButton>
                    </ListItem>
                    {userData?.id && (
                      <ListItem disablePadding onClick={handleLogout}>
                        <ListItemButton>
                          <ListItemIcon>
                            <LogoutIcon />
                          </ListItemIcon>
                          <ListItemText primary={"Đăng xuất"} />
                        </ListItemButton>
                      </ListItem>
                    )}
                    <Divider />
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <ListAltOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Danh mục"} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem
                      disablePadding
                      onClick={() =>
                        router.push("https://www.facebook.com/geardnha/")
                      }
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <InfoOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Liên hệ"} />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default Header;
