import {renderHook, waitFor} from '@testing-library/react';
import {describe, expect, test} from 'vitest';
import {wrapper} from '../../testItems';
import * as matchers from '@testing-library/jest-dom';
import {useBookStore} from '../../../../Context/bookStore';
import {useFetchPosts, useFetchComments} from '../../../../Routes/Functions/Queries/PostQueries';
expect.extend(matchers);

describe('Post query tests', () => {
    const mockStore = renderHook(() => useBookStore(), {wrapper});

    test('View posts', async () => {
       const postData = renderHook(() => useFetchPosts([
        mockStore.result.current.authorized,
        mockStore.result.current.setAuthorized,
        mockStore.result.current.setSiteError
       ]), {wrapper}); 

       await waitFor(() => expect(postData.result.current.isSuccess).toBe(true));

       expect(postData.result.current.data.posts.length).toEqual(5);
    });

    test('View comments', async () => {
        const commentData = renderHook(() => useFetchComments([
            10,
            mockStore.result.current.authorized,
            mockStore.result.current.setAuthorized,
            mockStore.result.current.setSiteError
        ]), {wrapper}); 

        await waitFor(() => expect(commentData.result.current.isSuccess).toBe(true));

        expect(commentData.result.current.data.length).toEqual(2);
    });
});