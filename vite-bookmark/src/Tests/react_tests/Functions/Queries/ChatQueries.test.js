import {renderHook, waitFor} from '@testing-library/react';
import {describe, expect, test} from 'vitest';
import {wrapper} from '../../testItems';
import * as matchers from '@testing-library/jest-dom';
import {useBookStore} from '../../../../Context/bookStore';
import {useFetchChats} from '../../../../Routes/Functions/Queries/ChatQueries';
expect.extend(matchers);

describe('Chat hook tests', () => {
    const mockStore = renderHook(() => useBookStore(), {wrapper});

    test('Show chats', async () => {
        const chatData = renderHook(() => useFetchChats([
            mockStore.result.current.authorized,
            mockStore.result.current.setAuthorized,
            mockStore.result.current.setSiteError
        ]), {wrapper});

        await waitFor(() => expect(chatData.result.current.isSuccess).toBe(true));

        expect(chatData.result.current.data.chats.length).toEqual(3);
    });
});