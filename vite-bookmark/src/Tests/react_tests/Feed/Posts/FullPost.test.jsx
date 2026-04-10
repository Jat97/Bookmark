import {render, screen} from '@testing-library/react';
import {query_client, user_event} from '../../testItems';
import {describe, expect, test} from 'vitest';
import * as matchers from '@testing-library/jest-dom';
import {QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import FullPost from '../../../../Routes/Feed/Posts/FullPost';
expect.extend(matchers);

describe('Display full post, like it, comment, then share it', async () => {
    test('Display full post, then like it', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialiEntries={[`/api/post/11`]}>
                    <Routes>
                        <Route path='/api/post/:postid' element={<FullPost />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText(
            `I think I'm going to need someone to explain Thus Spoke Zarathustra to me. Nietzsche's writing confuses me.`
        )).toBeInTheDocument();

        const like_button = screen.getByRole('button', {name: 'Like'});

        const like_post = vi.fn();

        like_button.onclick = like_post;

        await user_event.click(like_button);

        expect(like_button.onclick).toHaveBeenCalled();
    });

    test('Comment on post', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={[`/api/post/11`]}>
                    <Routes>
                        <Route path='/api/post/:postid' element={<FullPost />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        const comment_button = screen.getByRole('button', {name: 'Comment'});
        const textbox = screen.getByTestId('textbox');

        await user_event.type(textbox, `I have yet to read his works, but I've heard great things about Tolstoy. 
            War and Peace is a classic, so maybe start there?`
        );
        
        await user_event.click(comment_button);

        expect(comment_button).toHaveBeenCalledTimes(1);
    });

    test('Share post', async () => {
        render(
            <QueryClientProvider client={query_client}>
                <MemoryRouter initialEntries={[`/api/post/11`]}>
                    <Routes>
                        <Route path='/api/post/:postid' element={<FullPost />}></Route>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        const share_button = screen.getByRole('button', {name: 'Share'});

        await user_event.click(share_button);

        expect(share_button.onclick).toHaveBeenCalled();
    });
});