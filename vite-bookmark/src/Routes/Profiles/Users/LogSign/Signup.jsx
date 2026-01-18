import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useBookStore} from '../../../../Context/bookStore';
import LogSignButton from '../../../Buttons/LogSignButton';
import UserGroupInput from '../../../Miscellaneous/Inputs/UserGroupInput';
import UserSelectInput from '../../../Miscellaneous/Inputs/UserSelectInput';
import InputErr from '../../../Miscellaneous/Text/Errors/InputErr';

const Signup = () => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const navigate = useNavigate();

    const [signErrors, setSignErrors] = useState({
        first_name: null,
        last_name: null,
        email: null,
        dob: null,
        role: null,
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
                role: document.querySelector('#role').value,
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
                        <label htmlFor='first_name' className='flex flex-col items-center'>
                            <span className='font-semibold'> First Name </span>

                            <UserGroupInput id={'first_name'} input_value={''} input_fn={null} />
                        </label>

                        {signErrors.first_name &&
                            <InputErr error={signErrors.first_name} />
                        }
                    </div>

                    <div>
                        <label htmlFor='last_name' className='flex flex-col items-center'>
                            <span className='font-semibold'> Last Name </span>

                            <UserGroupInput id={'last_name'} input_value={''} input_fn={null} />
                        </label>

                        {signErrors.last_name && 
                            <InputErr error={signErrors.last_name} />
                        }
                    </div>

                    <div>
                        <label htmlFor='email' className='flex flex-col items-center'>
                            <span className='font-semibold'> Email </span>

                            <UserGroupInput id={'email'} input_value={''} input_fn={null} />
                        </label>
                       
                        {signErrors.email &&
                            <InputErr error={signErrors.email} />
                        }
                    </div>

                    <div>
                        <label htmlFor='dob' className='flex flex-col items-center'>
                            <span className='font-semibold'> Date of birth </span>

                            <UserGroupInput id={'dob'} input_value={''} input_fn={null} />
                        </label>

                        {signErrors.dob &&
                            <InputErr error={signErrors.dob} />
                        }
                    </div>

                    <div>
                        <label htmlFor='status'>
                            <span className='font-semibold'> Which best describes your relationship to literature? </span>

                            <UserSelectInput value={''} select_fn={null} />
                        </label>

                        {signErrors.role &&
                            <InputErr error={signErrors.role} />
                        }
                    </div>

                    <div>
                        <label htmlFor='password' className='flex flex-col items-center'>
                            <span className='font-semibold'> Password </span> 

                            <UserGroupInput id={'password'} input_value={''} input_fn={null} />
                        </label>
                        
                        {signErrors.password &&
                            <InputErr error={signErrors.password} />
                        }
                    </div>

                    <div>
                        <label for='confirm_password' className='flex flex-col items-center'>
                            <span className='font-semibold'> Confirm password </span> 

                            <UserGroupInput id={'confirm_password'} input_value={''} input_fn={null} />
                        </label>
                        
                        {signErrors.confirm &&
                            <InputErr error={signErrors.confirm} />
                        }
                    </div>
                </div>
                
                <div className='flex flex-col items-center gap-y-[10px] mb-[10px]'>
                    <LogSignButton log_sign_text={'Create account'} log_sign_fn={signUp} />

                    <p> Already have an account? 
                        <Link to='/api/login' className='text-blue-600 underline'> Log in here! </Link> 
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup;