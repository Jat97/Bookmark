import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {XMarkIcon} from '@heroicons/react/24/solid';
import {useBookStore} from '../../../Context/bookStore';
import UserGroupInput from '../../Miscellaneous/Inputs/UserGroupInput';
import DescriptionBox from '../../Miscellaneous/Inputs/DescriptionBox';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr';
import PageHeader from '../../Miscellaneous/Text/PageHeader';

const CreateGroup = () => {
    const [groupErrors, setGroupErrors] = useState({
        title: null,
        description: null
    });

    const setCreateGroupTab = useBookStore((state) => state.setCreateGroupTab);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const navigate = useNavigate();

    const disableCreateGroupTab = () => {
        setCreateGroupTab(false);
    }

    const createGroup = () => {
        const title = document.querySelector('#title').value;
        const description = document.querySelector('#description').value

        fetch('http://localhost:9000/api/group/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description
            }) 
        })
        .then(res => {
            if(!res.ok) {
                return res.json();
            }
            else if(res.redirected) {
                return navigate(res.url.replace('9000', '3000'), {rewrite: true});
            }
        })
        .then(json => {
            json.errors.errors.forEach(error => {
                setGroupErrors({
                    title: error.title ? error.title : null,
                    description: error.description ? error.description : null
                });
            })
        })
        .catch(err => setSiteError(err.message))
    };

    return (
        <div className='absolute top-0 right-0 bg-slate-200/50 h-screen w-screen z-50'>
            <XMarkIcon className='absolute top-[10px] right-[10px] stroke-slate-400 md:h-8 hover:stroke-zinc-100' 
                onClick={() => disableCreateGroupTab()}
            />

            <div className='relative top-[100px] left-[350px] flex flex-col items-center gap-[20px] bg-white border-slate-200 w-1/2'> 
                <PageHeader header={'Start a new group!'} />

                <div>
                    <div className='flex flex-col items-start mb-[20px]'>
                        <label for='title' className='flex flex-col items-start'>
                            <span className='font-semibold'> Title </span>

                            <UserGroupInput id={'title'} input_value={''} input_fn={null} />
                        </label>  

                        {groupErrors.title &&
                            <InputErr error={groupErrors.title} />
                        }
                    </div>
                    
                    <div className='flex flex-col items-start mb-[10px]'>
                        <DescriptionBox description={''} editDescription={null} is_user={false} />

                        {groupErrors.description &&
                            <InputErr error={groupErrors.description} />
                        }
                    </div>
                </div> 

                <button type='button' className='font-semibold bg-fuchsia-400 rounded-full p-1 mb-[10px] hover:bg-pink-100 md:w-[150px]' 
                    onClick={() => createGroup()}>
                    Create group
                </button>
            </div>
        </div>
    )
}

export default CreateGroup;