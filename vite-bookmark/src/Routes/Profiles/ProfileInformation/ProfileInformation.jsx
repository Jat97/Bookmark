const ProfileInformation = ({profile}) => {
    return (
        <div className='flex flex-col items-center'>
            <div>
                <p> {profile?.date_of_birth ? 'Date of birth:' : 'Date created:'} 
                    <span> {profile?.date_of_birth ? profile?.date_of_birth : profile?.created} </span> 
                </p>

                {profile?.moderator && <p> Created by: <span> {`${moderator?.first_name} ${moderator?.last_name}`} </span> </p>}

                {profile?.alma_mater && 
                    <p className='flex flex-col items-start'> Education: {profile?.alma_mater} 
                        <span className='text-sm'> {profile?.degree} </span> 
                    </p>
                }
            </div>

            <p> About: <span> {profile?.description} </span> </p>
        </div>
    )
}

export default ProfileInformation;