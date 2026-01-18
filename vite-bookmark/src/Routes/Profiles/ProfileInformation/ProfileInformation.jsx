const ProfileInformation = ({profile}) => {
    return (
        <div className='flex flex-col items-center'>
            <div>
                <p> <span className='font-semibold'> {profile.date_of_birth ? 'Date of birth:' : 'Created:'} </span> 
                    {profile?.date_of_birth ? profile?.date_of_birth : profile?.created} 
                </p>

                {profile?.moderator && <p> <span className='font-semibold'> Created by: </span> 
                    {`${moderator?.first_name} ${moderator?.last_name}`} 
                </p>
                }

                {profile?.alma_mater && 
                    <p className='flex flex-col items-start'> Education: {profile?.alma_mater} 
                        <span className='text-sm'> {profile?.degree} </span> 
                    </p>
                }

                <p> <span className='font-semibold'> Role: </span> {profile?.role} </p>
            </div>

            <p> <span className='font-semibold'> About: </span> {profile?.description} </p>
        </div>
    )
}

export default ProfileInformation;