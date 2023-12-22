import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Global styles
import "./styles/global.scss";
// React query
import { QueryClient, QueryClientProvider } from "react-query";

import { routes } from "./router/Routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  refetchOnReconnect: false,
  retry: false,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    {/* <ReactQueryDevtools /> */}
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colors: {
          brand: [
            "#e1f9ff",
            "#ccedff",
            "#9ad7ff",
            "#64c1ff",
            "#3baefe",
            "#20a2fe",
            "#099cff",
            "#0088e4",
            "#0078cd",
            "#0069b6"
          ],
        },
        globalStyles: theme => ({
          body: {
            color: "#000000",
            background: "#FAFAFA",
          },
        }),
        primaryShade: 8,
        primaryColor: "brand",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSizes: {
          xs: '0.6rem',
          sm: '0.75rem',
          md: '0.9rem',
          lg: '1rem',
          xl: '1.25rem',
        },
      }}
    >
      <ModalsProvider>
        <NotificationsProvider position="top-center">
          <BrowserRouter>{routes}</BrowserRouter>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  </QueryClientProvider>
);
