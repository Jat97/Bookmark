import {useState, useEffect} from 'react';
import {useBookStore} from '../../../Context/bookStore';
import {useEditProfileMutation} from '../../Functions/Mutations/UserMutations';
import UserGroupInput from '../../Miscellaneous/Inputs/UserGroupInput';
import DescriptionBox from '../../Miscellaneous/Inputs/DescriptionBox';
import ProfileDisplay from '../ProfileInformation/ProfileDisplay';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr'
import BlockButton from '../../Buttons/BlockButton';
import EditButton from '../../Buttons/EditButton';

const EditProfile = ({user}) => {
    const description_input = useBookStore((state) => state.description_input);
    const setDescriptionInput = useBookStore((state) => state.setDescriptionInput);
    const setSiteError = useBookStore((state) => state.setSiteError);

    useEffect(() => {
        if(!description_input) {
            setDescriptionInput(user.description);
        }
    }, [description_input, user]);

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
        {...profileData, description: description_input}, 
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

                        <UserGroupInput id={'first_name'} input_value={user.first_name} input_fn={editInformation} props={['first_name', user.first_name, editInformation]} />
                    </label>

                    {editErrors.first_name && 
                        <InputErr error={editErrors.first_name} />
                    }
                </div> 

                <div>
                    <label for='last_name'>
                        <span className='font-semibold'> Last name </span>

                        <UserGroupInput id={'ast_name'} input_value={user.last_name} input_fn={editInformation} />
                    </label>

                    {editErrors.last_name &&
                        <InputErr error={editErrors.last_name} />
                    }
                </div>

                <div>
                    <label for='dob'>
                        <span className='font-semibold'> Date of birth </span>

                        <UserGroupInput id={'dob'} input_value={user.dob} input_fn={editInformation} />
                    </label>

                    {editErrors.dob &&
                        <InputErr error={editErrors.dob} />
                    }
                </div>

                <DescriptionBox description={description_value} is_user={true} />

                <EditButton save_fn={editProfile} />
            </div>
            
            <div>
                <span className='font-semibold'> Blocked users </span>

                <ul>
                    {user.blocked_users.map(blocked => {
                        <div>
                            <ProfileDisplay profile={blocked} is_logged={false} profile_mode={'index'} />

                            <BlockButton user={blocked} />
                        </div>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default EditProfile;