import {PencilIcon} from '@heroicons/react/24/solid';

const EditButton = ({save_fn}) => {
    return (
        <button type='button' className='flex justify-around items-center font-semibold bg-blue-400 rounded-full 
            w-[150px] hover:bg-sky-100' onClick={save_fn}> 
            <PencilIcon className='h-4 md:h-6' />

            Save changes 
        </button>
    )
}

export default EditButton;