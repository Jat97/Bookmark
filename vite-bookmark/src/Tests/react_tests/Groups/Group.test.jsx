import {render, screen, waitFor} from '@testing-library/react';
import {query_client, user_event} from '../testItems';
import {describe, expect, test} from 'vitest';
import * as matchers from '@testing-library/jest-dom';
import {QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import Group from '../../../Routes/Groups/Group';
expect.extend(matchers);

describe('Display group information, leave, resend join request', () => {
    test('Display information', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={[`/api/group/22`]}>
                    <Routes>
                        <Route path='/api/group/:groupid' element={<Group />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => expect(screen.getByText('Library of Borges')).toBeInTheDocument());
    });

    test('Leave group', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={['/api/group/22']}>
                    <Routes>
                        <Route path='/api/group/:groupdid' element={<Group />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        const leave_button = screen.getByRole('button', {name: 'Leave group'});

        await user_event.click(leave_button);

        expect(leave_group.onclick).toHaveBeenCalled();
    });

    test('Send new join request', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter intialEntries={['/api/group/23']}>
                    <Routes>
                        <Route path='/api/group/:groupid' element={<Group />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => expect(screen.getByText('Roberto Bolaño Fan Club')).toBeInTheDocument()); 

        const request_button = screen.getByRole('button', {name: 'Request to join'});

        await user_event.click(request_button);

        expect(request_button.onclick).toHaveBeenCalled();
    });
});

test('Accept group request', async () => {
    render(
        <QueryClientProvider client={query_client}>
            <MemoryRouter initialEntries={['/api/group/21']}>
                <Routes>
                    <Route path='/api/group/:groupid' element={<Group />}></Route>
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    )

    const accept_button = screen.getByRole('button', {name: 'Accept request'});

    await user_event.click(accept_button);

    expect(accept_button.onclick).toHaveBeenCalled();
});