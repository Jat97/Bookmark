import {render, screen, waitFor} from '@testing-library/react';
import {query_client, user_event} from '../testItems';
import {describe, expect, test} from 'vitest';
import * as matchers from '@testing-library/jest-dom';
import {QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import Home from '../../../Routes/Feed/Posts/Home';
expect.extend(matchers);

describe('View chat, send message', () => {
    test('View chats', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={['/api/home']}>
                    <Routes>
                        <Route path='/api/home' element={<Home />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        const chat_button = screen.getByTestId('chat_access_button');
        await user_event.click(chat_button);

        expect(chat_button.onclick).toHaveBeenCalled();

        await waitFor(() => expect(screen.getByText(`Aw! That's adorable! What's his name?`)).toBeInTheDocument());
    });

    test('View messages and send one', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={['/api/home']}>
                    <Routes>
                        <Route path='/api/home' element={<Home />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        const chat_button = screen.getByTestId('chat_access_button');
        await user_event.click(chat_button);

        expect(chat_button.onclick).toHaveBeenCalled();

        const message_input = screen.getByTestId('message_input');

        await user_event.type(message_input, 'I think Rodion would be a good name for him.');

        const send_button = screen.getByTestId('send_message_button');

        await user_event.click(send_button);

        expect(send_message.onclick).toHaveBeenCalled();
    });
});