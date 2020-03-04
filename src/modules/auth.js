const Store = require('electron-store');
const jwtDecode = require('jwt-decode');

const store = new Store();


class auth{
    constructor(server){
        this.server = server;
        console.log('New auth created');
    }

    login = async(username, password)=>{
        if(username && password){
            try{
                const res = await this.post('/login', {
                    data: {
                        username: username,
                        password: password,
                    },
                });
                if(res.data.success){
                    store.set('token', res.data.token);
                    return {
                        success: true,
                    }
                }else{
                    store.set('token', null);
                    return {
                        success: false,
                        error: 'Invalid username or password',
                    }
                }
            }catch(err){
                return {
                    success: false,
                    error: err,
                } 
            }

        }else{
            return {
                success: false,
                error: 'Please supply both username and password',
            }
        }
    }

    getToken = ()=>{
        return store.get('token');
    }

    setToken = (newToken)=>{
        return store.set('token', newToken);
    }

    isLoggedIn = ()=>{
        const token = this.getToken();
        if(token && !this.isExpired(token)){
            return true;
        }else{
            return false
        }
    }

    logout = ()=>{
        this.setToken(null);
        return true;
    }


    isExpired = (token)=>{
        const decodedJWT = jwtDecode(token);
        if(decodedJWT.exp < Date.now()/1000){
            return true;
        }else{
            return false;
        }
    }

    post = async(apiAddress, options)=>{
        const axios = require('axios');
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        if(this.isLoggedIn()){
            headers['Authorization'] = 'Bearer ' + this.getToken();
        }
        try {
            const res = await axios({
                baseURL: this.server,
                method: 'post',
                url: apiAddress,
                headers: headers,
                ...options,
            });
            return res;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    get = async(apiAddress, options)=>{
        const axios = require('axios');
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        if(this.isLoggedIn()){
            headers['Authorization'] = 'Bearer ' + this.getToken();
        }
        try {
            const res = await axios({
                baseURL: this.server,
                method: 'get',
                url: apiAddress,
                headers: headers,
                ...options,
            });
            return res;
        } catch (error) {
            return Promise.reject(error);
        }

        
    }
}

module.exports = auth;