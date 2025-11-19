import {ExclamationTriangleIcon} from '@heroicons/react/24/solid';

const SiteErr = (props) => {
    const error = props.props;

    return (
        <div>
            <ExclamationTriangleIcon className='h-6' /> 
            
            {error} 
        </div>
    )
};

export default SiteErr;