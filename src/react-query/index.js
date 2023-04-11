import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const ClientProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}
    <ReactQueryDevtools initialIsOpen/>
    </QueryClientProvider>
  );
};

export default ClientProvider;