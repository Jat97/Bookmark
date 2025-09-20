import {useState} from 'react';
import {Link} from 'react-router-dom';
import LogSignInput from '../../Miscellaneous/Inputs/LogSignInput';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr';

const Login = () => {
    const [logErrors, setLogErrors] = useState({
        username: null,
        password: null
    });

    return (
        <div>
            <div>
                Sign in to Bookmark

                <div>
                    <div>
                        Username

                        <LogSignInput props={'email'} />

                        {logErrors.username &&
                            <InputErr props={logErrors.username} />
                        }
                    </div>

                    <div>
                        Password

                        <LogSignInput props={'password'} />

                        {logErrors.password &&
                            <InputErr props={logErrors.password} />
                        }
                    </div>
                </div>

                <div>
                    <button type='button'> Log in </button>

                    Don't have an account? <Link to='/api/signup'> Create one! </Link>
                </div>
            </div>
        </div>
    )
}

export default Login;