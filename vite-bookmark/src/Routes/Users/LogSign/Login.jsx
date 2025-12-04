import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useBookStore} from '../../../Context/bookStore';
import LogSignInput from '../../Miscellaneous/Inputs/LogSignInput';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr';
import LogSignButton from '../../Buttons/LogSignButton';

const Login = () => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const [logErrors, setLogErrors] = useState({
        user: null,
        password: null
    });

    const logIn = () => {
        fetch('http://localhost:9000/api/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: document.querySelector('#email').value,
                password: document.querySelector('#password').value
            })
        })
        .then(res => {
            if(!res.ok) {
                throw Error(`Error ${res.status}: ${res.statusText}`);
            }
            else {
                return res.json();
            }
        })
        .then(json => {
            setLogErrors({
                user: json.user_err ? json.user_err : null,
                password: json.pass_err ? json.pass_err : null
            });
        })
        .catch(err => setSiteError(err.message));
    }

    return (
        <div className='absolute top-[200px] h-screen w-screen md:top-1/3 md:left-[350px] md:w-1/2'>
            <div className='flex flex-col items-center gap-y-[20px] md:border md:border-slate-200 md:shadow-sm md:shadow-red-200 
                md:bg-white'>
                <p className='text-lg font-semibold'> Sign in to Bookmark </p>

                <div>
                    <div className='w-1/3'>
                        <div className='flex flex-col items-start'>
                            <p className='font-semibold'> Username </p>

                            <LogSignInput props={'email'} />
                        </div>
                            
                        {logErrors.username &&
                            <InputErr props={logErrors.username} />
                        } 
                    </div>

                    <div className='w-1/3'>
                        <div className='flex flex-col items-start'>
                            <p className='font-semibold'> Password </p>

                            <LogSignInput props={'password'} />
                        </div>
                        
                        {logErrors.password &&
                            <InputErr props={logErrors.password} />
                        }
                    </div>
                </div>

                <div className='flex flex-col items-center gap-y-[10px] mb-[10px]'>
                    <LogSignButton props={['Log in', logIn]} />

                    <p> Don't have an account? 
                        <Link to='/api/signup' className='text-blue-600 underline'> Create one! </Link> 
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;