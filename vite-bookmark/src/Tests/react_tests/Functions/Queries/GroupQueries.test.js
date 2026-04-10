import {renderHook, waitFor} from '@testing-library/react';
import {describe, expect, test} from 'vitest';
import {wrapper} from '../../testItems';
import * as matchers from '@testing-library/jest-dom';
import {useBookStore} from '../../../../Context/bookStore';
import {useFetchGroups} from '../../../../Routes/Functions/Queries/GroupQueries';
expect.extend(matchers);

describe('Group query tests', () => {
    const mockStore = renderHook(() => useBookStore(), {wrapper});

    test('Get groups', async () => {
        const groupData = renderHook(() => useFetchGroups([
            mockStore.result.current.authorized,
            mockStore.result.current.setAuthorized,
            mockStore.result.current.setSiteError
        ]), {wrapper});

        await waitFor(() => expect(groupData.result.current.isSuccess).toBe(true));

        expect(groupData.result.current.data.groups.length).toEqual(4)
    });
});