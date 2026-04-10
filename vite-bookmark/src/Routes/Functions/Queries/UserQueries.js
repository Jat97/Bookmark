import {useQuery} from '@tanstack/react-query';

export const useFetchLogged = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['logged'],
        queryFn: async () => {
            return await fetch('http://localhost:9000/api/user', {
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

export const useFetchUsers = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            return await fetch('http://localhost:9000/api/users', {
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
            .catch(err => setSiteError(err))
        }
    });

    return result;
}

export const useFetchAlerts = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['alerts'],
        queryFn: async () => {
            return await fetch('http://localhost:9000/api/notifications', {
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