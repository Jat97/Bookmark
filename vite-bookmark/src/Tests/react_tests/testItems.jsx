import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

export const query_client = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            cacheTime: 0,
            experimental_prefetchInRender: true
        },
    }
});

export const wrapper = ({children}) => {
    return (
        <QueryClientProvider client={query_client}>
            {children}
        </QueryClientProvider>
    )
};

export const user_event = userEvent.setup();