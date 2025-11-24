import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useBookStore} from '../../../Context/bookStore';
import LogSignInput from '../../Miscellaneous/Inputs/LogSignInput';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr';

const Signup = () => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const [signErrors, setSignErrors] = useState({
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        confirm: null
    });

    const signUp = () => {
        fetch('http://localhost:9000/api/signup', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                confirm: confirm
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
            json.errors.errors.forEach(error => {
                setSignErrors(prevState => ({
                    ...prevState,
                    [error.param] : err.msg
                }));
            })
        })
        .catch(err => setSiteError(err.message))
    }

    return (
        <div className='absolute top-1/3 right-1/3'>
            <div className='flex flex-col items-center border border-slate-200 shadow-sm shadow-slate-200'>
                Join us at Bookmark!

                <div className='font-semibold grid grid-cols-2 items-center'>
                    <div>
                        <div className='font-semibold flex flex-col items-start'>
                            First Name

                            <LogSignInput props='first_name' />
                        </div>
                        

                        {signErrors.first_name &&
                            <InputErr props={signErrors.first_name} />
                        }
                    </div>

                    <div>
                        <div className='font-semibold flex flex-col items-start'>
                            Last Name

                            <LogSignInput props='last_name' />
                        </div>

                        {signErrors.last_name && 
                            <InputErr props={signErrors.last_name} />
                        }
                    </div>

                    <div>
                        <div className='font-semibold flex flex-col items-start'>
                            Email

                            <LogSignInput props='email' />
                        </div>
                       

                        {signErrors.email &&
                            <InputErr props={signErrors.email} />
                        }
                    </div>

                    <div>
                        <div className='font-semibold flex flex-col items-start'>
                            Password

                            <LogSignInput props='password' />
                        </div>
                        

                        {signErrors.password &&
                            <InputErr props={signErrors.password} />
                        }
                    </div>

                    <div>
                        <div className='flex flex-col items-start'>
                            Confirm

                            <LogSignInput props='confirm' />
                        </div>
                        

                        {signErrors.confirm &&
                            <InputErr props={signErrors.confirm} />
                        }
                    </div>
                </div>
                
                <div className='flex flex-col items-center'>
                    <LogSignButton props={['Create account', signUp]} />

                    Already have an account? <Link to='/api/login' className='text-blue-600 underline'> 
                        Log in here! 
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Signup;