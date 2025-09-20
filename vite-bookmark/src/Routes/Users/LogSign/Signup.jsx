import {useState} from 'react';
import {Link} from 'react-router-dom';
import LogSignInput from '../../Miscellaneous/Inputs/LogSignInput';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr';

const Signup = () => {
    const [signErrors, setSignErrors] = useState({
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        confirm: null
    });

    return (
        <div>
            <div>
                Join us at Bookmark!

                <div>
                    <div>
                        First Name

                        <LogSignInput props='first_name' />

                        {signErrors.first_name &&
                            <InputErr props={signErrors.first_name} />
                        }
                    </div>

                    <div>
                        Last Name

                        <LogSignInput props='last_name' />

                        {signErrors.last_name && 
                            <InputErr props={signErrors.last_name} />
                        }
                    </div>

                    <div>
                        Email

                        <LogSignInput props='email' />

                        {signErrors.email &&
                            <InputErr props={signErrors.email} />
                        }
                    </div>

                    <div>
                        Password

                        <LogSignInput props='password' />

                        {signErrors.password &&
                            <InputErr props={signErrors.password} />
                        }
                    </div>

                    <div>
                        Confirm

                        <LogSignInput props='confirm' />

                        {signErrors.confirm &&
                            <InputErr props={signErrors.confirm} />
                        }
                    </div>

                    <div>
                        <button type='button'>
                            Create account
                        </button>

                        Already have an account? <Link to='/api/login'> Log in here! </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;