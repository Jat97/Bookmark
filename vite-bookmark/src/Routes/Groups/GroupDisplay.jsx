import {Link} from 'react-router-dom';
import {BookOpenIcon} from '@heroicons/react/24/solid';

const GroupDisplay = (props) => {
    const group = props.props[0];
    const group_mode = props.props[1];

    const handleGroupImageCSS = () => {
        if(group_mode === 'index') {
            return 'max-w-16 md:max-w-20';
        }
        else if (group_mode === 'page') {
            return 'max-w-20 md:max-w-24';
        }
    }
    
    const handleGroupIconCSS = () => {
        if(group_mode === 'index') {
            return 'max-h-5 md:max-h-6'
        }
        else if(group_mode === 'page') {
            return ' max-h-8 md:max-h-10'
        }
    }

    return (
        <div className='flex justify-around items-center'>
            {group.group_image ?
                <img src={group.group_image} className={`${handleGroupImageCSS()}`}></img>
            :
                <BookOpenIcon className={`${handleGroupIconCSS()}`} />
            }

            <Link to={`/api/group/${group.id}`} className={`font-semibold 
                ${group_mode === 'index' ? 'text-blue-600 hover:underline' : 'cursor-not-allowed'}`}> 
                {group.title} 
            </Link>
        </div>
    )
};

export default GroupDisplay;