import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/solid';
import {useBookStore} from '../../../Context/bookStore';
import {useFetchUsers} from '../../Functions/Queries/UserQueries';
import {useFetchGroups} from '../../Functions/Queries/GroupQueries';
import {useCreateGroupMutation} from '../../Functions/Mutations/GroupMutations';
import ProfileBox from '../ProfileInformation/Accounts/ProfileBox';
import UserGroupInput from '../../Miscellaneous/Inputs/UserGroupInput';
import DescriptionBox from '../../Miscellaneous/Inputs/DescriptionBox';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr';
import PageHeader from '../../Miscellaneous/Text/PageHeader';

const CreateGroup = () => {
    const [groupErrors, setGroupErrors] = useState({
        title: null,
        description: null
    });

    const [groupInputs, setGroupInputs] = useState({
        title: '',
        description: '',
        private: false
    });
    
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    const navigate = useNavigate();

    const create_group_mutation = useCreateGroupMutation([navigate, setGroupErrors, setSiteError]);

    const handleTextInputs = (e) => {
        setGroupInputs((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    }

    const selectPrivacy = (e) => {
        setGroupInputs((prevState) => ({
            ...prevState,
            private: e.target.value === 'private' && true
        }));
    }

    const createGroup = () => {
        return create_group_mutation.mutate({group: groupInputs});
    }

    return (
        <div className='flex justify-between items-start h-screen w-screen m-2 z-50'>
            <div className='flex flex-col items-center gap-[20px]'> 
                <PageHeader header={'Start a new group!'} />

                <div>
                    <div className='flex flex-col items-start gap-y-5'>
                        <label htmlFor='public' className='flex justify-around items-start gap-x-10'>
                            <input type='radio' id='public' value='public' checked={!groupInputs.private && true}
                                onChange={(e) => selectPrivacy(e)}></input>

                            <EyeIcon className='h-4 stroke-slate-300 md:h-6' />

                            <span className='flex flex-col items-start text-slate-300'> Public 
                                <span className='text-sm'> Anyone can participate </span>
                            </span>
                        </label>

                        <label htmlFor='private' className='flex justify-around items-start gap-x-10'>
                            <input type='radio' id='private' value='private' checked={groupInputs.private && true}
                                onChange={(e) => selectPrivacy(e)}></input>

                            <EyeSlashIcon className='h-4 stroke-slate-300 md:h-6' />

                            <span className='text-slate-300 flex flex-col items-start'> Private 
                                <span className='text-sm'> Only approved users can participate </span>
                            </span>
                        </label>
                    </div>

                    <div className='flex flex-col items-start mb-[20px]'>
                        <label htmlFor='title' className='flex flex-col items-start'>
                            <span className='font-semibold'> Title </span>

                            <UserGroupInput id={'title'} input_value={groupInputs.title} input_fn={handleTextInputs} />
                        </label>  

                        {groupErrors.title &&
                            <InputErr error={groupErrors.title} />
                        }
                    </div>
                    
                    <div className='flex flex-col items-start mb-[10px]'>
                        <DescriptionBox description={groupInputs.description} editDescription={handleTextInputs} is_user={false} />

                        {groupErrors.description &&
                            <InputErr error={groupErrors.description} />
                        }
                    </div>
                </div> 

                <button type='button' className='font-semibold bg-fuchsia-400 rounded-full p-1 mb-[10px] w-[150px]
                    hover:bg-pink-100' 
                    onClick={() => createGroup()}>
                    Create group
                </button>
            </div>

            <div className='hidden md:flex md:flex-col md:items-center md:gap-y-10'>
                <ProfileBox title='Users' profile={null} items={userData.data?.users} />

                <ProfileBox title='Groups' profile={null} items={groupData.data?.groups} />
            </div>
        </div>
    )
}

export default CreateGroup;