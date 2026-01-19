import {TrashIcon} from '@heroicons/react/24/solid';

const DeleteButton = ({delete_fn}) => {
    return (
        <button type='button' className='flex justify-around items-center bg-red-400 hover:bg-pink-100'
            onClick={delete_fn}>
            <TrashIcon className='h-4 stroke-white md:h-6' />

            <span className='text-white'> Delete </span>
        </button>
    )
};

export default DeleteButton;