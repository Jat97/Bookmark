import {render, screen, waitFor} from '@testing-library/react';
import {query_client, user_event} from '../../testItems';
import {expect, test} from 'vitest';
import * as matchers from '@testing-library/jest-dom';
import {QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter, MemoryRouter, Routes, Route} from 'react-router-dom';
import Signup from '../../../../Routes/Users/LogSign/Signup';
import Home from '../../../../Routes/Feed/Posts/Home';
expect.extend(matchers);

test('Create account', async () => {
    const {unmount} = render(
        <QueryClientProvider client={query_client}>
            <MemoryRouter initialEntries={['/api/signup']}>
                <Routes>
                    <Route path='/api/signup' element={<Signup />}></Route>
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );

    await user_event.type(screen.getByTestId('first_name'), 'John');
    await user_event.type(screen.getByTestId('last_name'), 'Smith');
    await user_event.type(screen.getByTestId('email'), 'JohnSmith@example.com');
    await user_event.type(screen.getByTestId('password'), 'JohnSmithPassword');
    await user_event.type(screen.getByTestId('confirm'), 'JohnSmithPassword');

    const button = screen.getByRole('button', {name: 'Create account'});

    const signSpy = vi.spyOn(global, 'fetch').mockImplementation({
        ok: true,
        json: async () => ({message: 'OK'})
    });
    
    await user_event.click(button);

    expect(signSpy).toHaveBeenCalled();

    unmount();
    
    render(
        <QueryClientProvider client={query_client}>
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        </QueryClientProvider>
    )

    await waitFor(
        () => expect('Anybody have any recommendations for Russian literature besides Dostoevsky?')
        .not().toBeInTheDocument()
    );
});