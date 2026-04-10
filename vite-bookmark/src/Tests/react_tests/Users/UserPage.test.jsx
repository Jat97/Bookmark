import {render, screen, waitFor} from '@testing-library/react';
import {query_client, user_event} from '../testItems';
import {describe, expect, test} from 'vitest';
import * as matchers from '@testing-library/jest-dom';
import {QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import UserPage from '../../../Routes/Users/UserPage';
expect.extend(matchers);

describe('Add one user, block and unblock another', () => {
    test('Show user, add them', async () => {
        const pending_requests = [];

        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={[`/api/user/8`]}>
                    <Routes>
                        <Route path='/api/user/:userid' element={<UserPage />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => expect(screen.getByText('Samantha Jones')).toBeInTheDocument());

        const friend_button = screen.getByRole('button', {name: 'Add friend'});

        const friendSpy = vi.spyOn(friend_button, 'handleFriendMutation').mockImplementation(() => {
            pending_requests.push({
                id: 8,
                first_name: 'Samantha',
                last_name: 'Jones',
                dob: '06/06/1998',
                profile_picture: 'SamanthaJones.jpg',
                online: true,
                hidden: false
            });
        });

        await user_event.click(friend_button);

        expect(friendSpy).toHaveBeenCalled();
        expect(pending_requests.length).toEqual(1);
    });

    test('Block a different user, then immediately unblock them', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={['/api/user/6']}>
                    <Routes>
                        <Route path='/api/user/:userid' element={<UserPage />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => expect(screen.getByText('Claire Johnson')).toBeInTheDocument()); 

        const block_button = screen.getByRole('button', {name: 'Block'});

        await user_event.click(block_button);

        expect(block_button.onclick).toHaveBeenCalled();

        const unblock_button = screen.getByRole('button', {name: 'Unblock button'});

        await user_event.click(unblock_button);

        expect(unblock_button.onclick).toHaveBeenCalled();
    });
});