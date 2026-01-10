import {useState, useEffect} from 'react';
import {useBookStore} from '../../Context/bookStore';
import {useEditProfileMutation} from '../Functions/Mutations/userMutations';
import UserGroupInput from '../Miscellaneous/Inputs/UserGroupInput';
import DescriptionBox from '../Miscellaneous/Inputs/DescriptionBox';
import ProfileDisplay from '../Miscellaneous/Images/ProfileDisplay';
import InputErr from '../Miscellaneous/Text/Errors/InputErr'
import BlockButton from '../Buttons/BlockButton';
import EditButton from '../Buttons/EditButton';

const EditProfile = (props) => {
    const user = props.props;

    const description_value = useBookStore((state) => state.description_value);
    const setDescriptionValue = useBookStore((state) => state.setDescriptionValue);
    const setSiteError = useBookStore((state) => state.setSiteError);

    useEffect(() => {
        if(!description_value) {
            setDescriptionValue(user.description);
        }
    }, [description_value, user]);

    const [editErrors, setEditErrors] = useState({
        first_name: null,
        last_name: null,
        dob: null,
    });

    const [profileData, setProfileData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        dob: user.dob,
    })

    const profile_mutation = useEditProfileMutation([
        user, 
        {...profileData, description: description_value}, 
        setDescription, 
        setEditErrors, 
        setSiteError
    ]);

    const editProfile = () => {
        profile_mutation.mutate();
    }

    const editInformation = (e) => {
        setProfileData((prevState) => ({
            ...prevState,
            [e.currentTarget.id]: e.currentTarget.value
        }));
    }

    return (
        <div>
            <div>
                <div>
                    <label for='first_name'>
                        <span className='font-semibold'> First name </span>

                        <UserGroupInput props={['first_name', user.first_name, editInformation]} />
                    </label>

                    {editErrors.first_name && 
                        <InputErr props={editErrors.first_name} />
                    }
                </div> 

                <div>
                    <label for='last_name'>
                        <span className='font-semibold'> Last name </span>

                        <UserGroupInput props={['last_name', user.last_name, editInformation]} />
                    </label>

                    {editErrors.last_name &&
                        <InputErr props={editErrors.last_name} />
                    }
                </div>

                <div>
                    <label for='dob'>
                        <span className='font-semibold'> Date of birth </span>

                        <UserGroupInput props={['dob', user.dob, editInformation]} />
                    </label>

                    {editErrors.dob &&
                        <InputErr props={editErrors.dob} />
                    }
                </div>

                <DescriptionBox props={[description_value, true]} />

                <EditButton props={editProfile} />
            </div>
            
            <div>
                <span className='font-semibold'> Blocked users </span>

                <ul>
                    {user.blocked_users.map(blocked => {
                        <div>
                            <ProfileDisplay props={[blocked, false, 'index']} />

                            <BlockButton props={blocked} />
                        </div>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default EditProfile;