import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useBookStore} from '../../../Context/bookStore';
import LogSignButton from '../../Buttons/LogSignButton';
import UserGroupInput from '../../Miscellaneous/Inputs/UserGroupInput';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr';

const Signup = () => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const navigate = useNavigate();

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
            else if(res.status === 200) {
                return navigate('/api/home', {rewrite: true});
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
        <div className='absolute top-[150px] h-screen w-screen md:left-[350px] md:rounded-full md:w-1/2'>
            <div className='flex flex-col items-center gap-y-[20px] md:border md:border-slate-200 
                md:shadow-sm md:shadow-slate-200 md:w-full'>
                <p className='text-lg font-semibold'> Join us at Bookmark! </p>

                <div className='grid grid-cols-2 items-center font-semibold gap-y-[10px] w-11/12'>
                    <div>
                        <label for='first_name' className='flex flex-col items-center'>
                            <span className='font-semibold'> First Name </span>

                            <UserGroupInput props={['first_name', null]} />
                        </label>

                        {signErrors.first_name &&
                            <InputErr props={signErrors.first_name} />
                        }
                    </div>

                    <div>
                        <label for='last_name' className='flex flex-col items-center'>
                            <span className='font-semibold'> Last Name </span>

                            <UserGroupInput props={['last_name', null]} />
                        </label>

                        {signErrors.last_name && 
                            <InputErr props={signErrors.last_name} />
                        }
                    </div>

                    <div>
                        <label for='email' className='flex flex-col items-center'>
                            <span className='font-semibold'> Email </span>

                            <UserGroupInput props={['email', null]} />
                        </label>
                       
                        {signErrors.email &&
                            <InputErr props={signErrors.email} />
                        }
                    </div>

                    <div>
                        <label for='dob' className='flex flex-col items-center'>
                            <span className='font-semibold'> Date of birth </span>

                            <UserGroupInput props={['dob', null]} />
                        </label>

                        {signErrors.dob &&
                            <InputErr props={signErrors.dob} />
                        }
                    </div>

                    <div>
                        <label for='password' className='flex flex-col items-center'>
                            <span className='font-semibold'> Password </span> 

                            <UserGroupInput props={['password', null]} />
                        </label>
                        
                        {signErrors.password &&
                            <InputErr props={signErrors.password} />
                        }
                    </div>

                    <div>
                        <label for='confirm_password' className='flex flex-col items-center'>
                            <span className='font-semibold'> Confirm password </span> 

                            <UserGroupInput props={['confirm_password', null]} />
                        </label>
                        
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