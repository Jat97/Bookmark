import {render, screen, waitFor} from '@testing-library/react';
import {query_client, user_event} from '../testItems';
import {describe, expect, test} from 'vitest';
import * as matchers from '@testing-library/jest-dom';
import {QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import Index from '../../../Routes/Users/Index';
expect.extend(matchers);

describe('View index and send request, then block another user', () => {
    test('Add friend from index', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={['/api/index']}>
                    <Routes>
                        <Route path='/api/index' element={<Index />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )
        
        await waitFor(() => expect(screen.getByText('Samantha Jones')).toBeInTheDocument());

        const friend_button = screen.getByTestId(`friend-8`);

        await user_event.click(friend_button);

        expect(friend_button.onclick).toHaveBeenCalled();
    });

    test('Block user from index', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={['/api/index']}>
                    <Routes>
                        <Route path='/api/index' element={<Index />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => expect(screen.getByText('Eric Goldberg')).toBeInTheDocument());
        
        const block_button = screen.getByTestId(`block-7`);

        await user_event.click(block_button);

        expect(block_button.onclick).toHaveBeenCalled();
    });
});