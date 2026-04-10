import {useQuery} from '@tanstack/react-query';

export const useFetchChats = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            return await fetch('http://localhost:9000/api/chats', {
                method: 'GET',
                credentials: 'include'
            })
            .then(res => {
                if(res.status === 401 || res.status === 500) {
                    setAuthorized(false);
                }   
                else {
                    if(!authorized) {
                        setAuthorized(true);
                    }    
                }
                
                return res.json();
            })
            .then(json => {
                if(json.error.error) {
                    setSiteError(json.error.error);
                }
            })
            .catch(err => setSiteError(err.message))
        }
    });

    return result;
};