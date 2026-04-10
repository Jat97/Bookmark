import {renderHook, waitFor} from '@testing-library/react';
import {describe, expect, test} from 'vitest';
import {wrapper} from '../../testItems';
import * as matchers from '@testing-library/jest-dom';
import {useBookStore} from '../../../../Context/bookStore';
import {useFetchLogged, useFetchUsers, useFetchFriends, useFetchBlocked} from '../../../../Routes/Functions/Queries/UserQueries';
expect.extend(matchers);

describe('User test queries', () => {
    const mockStore = renderHook(() => useBookStore(), {wrapper});

    test('Get users', async () => {
        const userData = renderHook(() => useFetchUsers([
            mockStore.result.current.authorized,
            mockStore.result.current.setSiteAuthorized,
            mockStore.result.current.setSiteError
        ]), {wrapper});

        await waitFor(() => expect(userData.result.current.isSuccess).toBe(true));

        expect(userData.result.current.data.users.length).toEqual(7);
    });

    test('Get logged user', async () => {
        const loggedData = renderHook(() => useFetchLogged([
            mockStore.result.current.authorized,
            mockStore.result.current.setAuthorized,
            mockStore.result.current.setSiteError
        ]), {wrapper});

        await waitFor(() => expect(loggedData.result.current.isSuccess).toBe(true));

        expect(loggedData.result.current.data.logged_user.first_name).toBe('Fred');
    });

    test('Get friends', async () => {
        const friendData = renderHook(() => useFetchFriends([
            mockStore.result.current.authorized,
            mockStore.result.current.setAuthorized,
            mockStore.result.current.setSiteError
        ]), {wrapper});

        await waitFor(() => expect(friendData.result.current.isSuccess).toBe(true));

        expect(friendData.result.current.data.friends.length).toEqual(3);
    });

    test('Get blocked', async () => {
        const blockData = renderHook(() => useFetchBlocked([
            mockStore.result.current.authorized,
            mockStore.result.current.setAuthorized,
            mockStore.result.current.setSiteError
        ]), {wrapper});
        
        await waitFor(() => expect(blockData.result.current.isSuccess).toBe(true));

        expect(blockData.result.current.data.blocked.length).toEqual(1);
    });
});