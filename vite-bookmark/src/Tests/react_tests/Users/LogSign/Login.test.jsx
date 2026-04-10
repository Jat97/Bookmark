import {render, screen, waitFor} from '@testing-library/react';
import {query_client, user_event} from '../../testItems';
import {expect, test} from 'vitest';
import * as matchers from '@testing-library/jest-dom';
import {QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter, MemoryRouter, Routes, Route} from 'react-router-dom';
import Login from '../../../../Routes/Users/LogSign/Login';
import Home from '../../../../Routes/Feed/Posts/Home'
expect.extend(matchers);

test('Log into account', async () => {
    const {unmount} =
     render(
        <QueryClientProvider client={query_client}>
            <MemoryRouter initialEntries={['/api/login']}>
                <Routes>
                    <Route path='/api/login' element={<Login />}></Route>
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    )

    await user_event.type(screen.getByTestId('email'), 'FredSmith@example.com');
    await user_event.type(screen.getByTestId('password'), 'FredSmithPassword');

    const button = screen.getByRole('button', {name: 'Log in'});

    const logSpy = vi.spyOn(global, 'fetch').mockImplementation({
        ok: true,
        json: async () => ({message: 'OK'})
    });

    await user_event.click(button);

    expect(logSpy).toHaveBeenCalled();
    // expect(logSpy).toHaveBeenCalledWith(['http://127.0.0.1:9000/api/login']);

    unmount();

    render(
        <QueryClientProvider client={query_client}>
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        </QueryClientProvider>
    )

    await waitFor(
        () => expect(screen.getByText('Anybody have any recommendations for Russian literature besides Dostoevsky?'))
        .toBeInTheDocument()
    );
});