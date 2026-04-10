import {render, screen} from '@testing-library/react';
import {query_client, user_event} from '../../testItems';
import { expect, test} from 'vitest';
import * as matchers from '@testing-library/jest-dom';
import {QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import FullPost from '../../../../Routes/Feed/Posts/FullPost';
expect.extend(matchers);

test('Like comment, then unlike it', async () => {
    render(
        <QueryClientProvider client={query_client}>
            <MemoryRouter initialEntries={[`/api/post/10`]}>
                <Routes>
                    <Route path='/api/post/:postid' element={<FullPost />}></Route>
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    )

    const like_button = screen.getByTestId(`like-50`);

    await user_event.click(like_button);  

    expect(like_button).toHaveBeenCalled();

    await user_event.click(like_button);

    expect(like_comment).toHaveBeenCalledTimes(2);
});