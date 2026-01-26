import {useQuery} from '@tanstack/react-query';

export const useFetchPosts = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            return await fetch('http://localhost:9000/api/posts', {
                method: 'GET',
                credentials: 'include'
            })
            .then(res => {            
                if(res.status === 401) {
                    setAuthorized(false);
                }
                else if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    if(!authorized) {
                        setAuthorized(true);
                    }

                    return res.json();
                }
            })
            .catch(err => {
                setSiteError(err)
            })
        }
    });

    return result;
};

export const useFetchComments = ([postid, authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['comments'],
        queryFn: async () => {
            return await fetch(`http://localhost:9000/api/${postid}/comments`, {
                method: 'GET',
                credentials: 'include'
            })
            .then(res => {
                if(res.status === 401) {
                    setAuthorized(false);
                }
                else if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    if(!authorized) {
                        setAuthorized(true);
                    }

                    return res.json();
                }
            })
            .catch(err => setSiteError(err))
        }
    });

    return result;
}