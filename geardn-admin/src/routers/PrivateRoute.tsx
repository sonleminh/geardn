import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useWhoAmI } from "../services/auth";
import { useEffect } from "react";
import LoadingBackdrop from "../components/LoadingBackdrop";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const auth = useAuthContext();

  const { data, isFetching, isError } = useWhoAmI();

  useEffect(() => {
    if (isFetching) return;

    if (data?.data) {
      // Interceptor already succeeded (either directly or after a silent refresh)
      auth?.login({
        id: data.data.id,
        email: data.data.email,
        name: data.data.name,
        lastReadNotificationsAt: auth?.user?.lastReadNotificationsAt ?? null,
      });
      return;
    }

    if (isError) {
      // The interceptor has already:
      // 1. Tried to refresh via /admin/auth/refresh-token
      // 2. Retried whoami with the new token
      // 3. Called redirectToLogin() if everything failed
      // We only land here if the interceptor threw — navigation is already happening.
      // navigate() here is just a fallback for router-aware navigation.
      navigate("/login", { replace: true });
    }
  }, [data, isFetching, isError]);

  // Show loading while:
  // - whoami is in flight
  // - interceptor is doing its silent refresh + retry
  // - auth context is being populated
  if (isFetching || !auth?.user) return <LoadingBackdrop />;

  return <Outlet />;
};

export default PrivateRoute;
