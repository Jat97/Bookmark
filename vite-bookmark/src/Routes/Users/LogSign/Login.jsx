import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useBookStore} from '../../../Context/bookStore';
import UserGroupInput from '../../Miscellaneous/Inputs/UserGroupInput';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr';
import LogSignButton from '../../Buttons/LogSignButton';

const Login = () => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const navigate = useNavigate();

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
            else if(res.status === 200) {
                return navigate('/api/home', {rewrite: true});
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
        <div className='absolute top-[200px] h-screen w-screen md:top-1/3 md:left-[325px] md:rounded-full md:w-1/2'>
            <div className='flex flex-col items-center gap-y-[20px] md:border md:border-slate-200 md:shadow-sm md:shadow-red-200 
                md:bg-white'>
                <p className='text-lg font-semibold'> Sign in to Bookmark </p>

                <div className='font-semibold'>
                    <div className='w-1/3'>
                        <label for='email' className='flex flex-col items-start'>
                            Username

                            <UserGroupInput props={'email'} />
                        </label>
                            
                        {logErrors.username &&
                            <InputErr props={logErrors.username} />
                        } 
                    </div>

                    <div className='w-1/3'>
                        <label for='password' className='flex flex-col items-start'>
                            Password

                            <UserGroupInput props={'password'} />
                        </label>
                        
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