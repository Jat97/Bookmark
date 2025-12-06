import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useBookStore} from '../../../Context/bookStore';
import LogSignButton from '../../Buttons/LogSignButton';
import LogSignInput from '../../Miscellaneous/Inputs/LogSignInput';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr';

const Signup = () => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const [signErrors, setSignErrors] = useState({
        first_name: null,
        last_name: null,
        email: null,
        dob: null,
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
                first_name: document.querySelector('#first_name').value,
                last_name: document.querySelector('#last_name').value,
                email: document.querySelector('#email').value,
                dob: document.querySelector('#dob').value,
                password: document.querySelector('#password').value,
                confirm: document.querySelector('#confirm_password').value
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
        <div className='absolute top-[150px] h-screen w-screen md:left-[250px] md:rounded-full md:w-1/2'>
            <div className='flex flex-col items-center gap-y-[20px] md:border md:border-slate-200 
                md:shadow-sm md:shadow-slate-200'>
                <p className='text-lg font-semibold'> Join us at Bookmark! </p>

                <div className='grid grid-cols-2 items-center gap-y-[10px] w-11/12'>
                    <div>
                        <div className='flex flex-col items-start'>
                            <p className='font-semibold'> First Name </p>

                            <LogSignInput props='first_name' />
                        </div>
                        

                        {signErrors.first_name &&
                            <InputErr props={signErrors.first_name} />
                        }
                    </div>

                    <div>
                        <div className='flex flex-col items-start'>
                            <p> Last Name </p>

                            <LogSignInput props='last_name' />
                        </div>

                        {signErrors.last_name && 
                            <InputErr props={signErrors.last_name} />
                        }
                    </div>

                    <div>
                        <div className='flex flex-col items-start'>
                            <p className='font-semibold'> Email </p>

                            <LogSignInput props='email' />
                        </div>
                       

                        {signErrors.email &&
                            <InputErr props={signErrors.email} />
                        }
                    </div>

                    <div>
                        <div className='flex flex-col items-start'>
                            <p className='font-semibold'> Date of birth </p>

                            <LogSignInput props='dob' />
                        </div>

                        {signErrors.dob &&
                            <InputErr props={signErrors.dob} />
                        }
                    </div>

                    <div>
                        <div className='font-semibold flex flex-col items-start'>
                            <p className='font-semibold'> Password </p>

                            <LogSignInput props='password' />
                        </div>
                        

                        {signErrors.password &&
                            <InputErr props={signErrors.password} />
                        }
                    </div>

                    <div>
                        <div className='flex flex-col items-start'>
                            <p className='font-semibold'> Confirm </p>

                            <LogSignInput props='confirm_password' />
                        </div>
                        

                        {signErrors.confirm &&
                            <InputErr props={signErrors.confirm} />
                        }
                    </div>
                </div>
                
                <div className='flex flex-col items-center gap-y-[10px] mb-[10px]'>
                    <LogSignButton props={['Create account', signUp]} />

                    <p> Already have an account? 
                        <Link to='/api/login' className='text-blue-600 underline'> Log in here! </Link> 
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup;