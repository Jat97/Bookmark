import {render, screen} from '@testing-library/react';
import {query_client, user_event} from '../testItems';
import {describe, expect, test} from 'vitest';
import * as matchers from '@testing-library/jest-dom';
import {QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import GroupInfoPage from '../../../Routes/Groups/GroupInfoPage';
expect.extend(matchers);

describe('Change group description, then remove a member', () => {
    test('Change group description', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={[`/api/group/info/21`]}>
                    <Routes>
                        <Route path='/api/group/info/:groupid' element={<GroupInfoPage />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        expect(screen.getByText('Fans of Buraiha')).toBeInTheDocument();

        const textbox = screen.getByTestId('textbox');
        const save_button = screen.getByRole('button', {name: 'Save changes'});

        await user_event.type(textbox, 'We mostly talk about Osamu Dazai, but we swear other authors exist.');

        await user_event.click(save_button);

        expect(save_button.onclick).toHaveBeenCalled();
    });

    test('Remove a member', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={[`/api/group/info/21`]}>
                    <Routes>
                        <Route path='/api/group/info/:groupid' element={<GroupInfoPage />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        const remove_button = screen.getByRole('button', {name: 'Remove from group'});

        await user_event.click(remove_button);

        expect(remove_button.onclick).toHaveBeenCalled();
    });
});

test('Delete group', async () => {
    const {unmount} = render(
        <QueryClientProvider client={query_client}>
            <MemoryRouter initialEntries={[`/api/group/info/21`]}>
                <Routes>
                    <Route path='/api/group/info/:groupid' element={<GroupInfoPage />}></Route>
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    )

    const delete_button = screen.getByRole('button', {name: 'Delete group'});

    await user_event.click(delete_button);

    expect(delete_button.onclick).toHaveBeenCalled();

    unmount();

    render(
        <QueryClientProvider client={query_client}>
            <MemoryRouter initialEntries={['/api/home']}>
                <Routes>
                    <Route path='/api/home' element={<Home />}></Route>
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    )

    expect(screen.getByText('Anybody have any recommendations for Russian literature besides Dostoevsky?'))
        .toBeInTheDocument();
});