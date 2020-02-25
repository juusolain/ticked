import jwtDecode from 'jwt-decode';

export default class AuthService{
    constructor(server){
        this.server = server;
    }

    login = async(username, password)=>{
        const res = await fetch(`${this.server}/login`, {
            method: 'POST',
            body: JSON.stringify({username: username, password: password}),
        })
        if(res.ok){
            this.setToken(res.token);
            return true;
        }else{
            return false;
        }
    }

    register = async(username, password)=>{
        const res = await fetch(`${this.server}/register`, {
            method: 'POST',
            body: JSON.stringify({username: username, password: password}),
        })
        if(res.ok){
            this.setToken(res.token);
            return true;
        }else{
            return false;
        }
    }

    setToken(newToken){
        localStorage.setItem('token', newToken);
    }

    getToken(){
        return localStorage.getItem('token');
    }

    isLoggedIn(){
        const token = getToken();
        if(token && !isExpired(token)){
            return true;
        }else{
            return false
        }
    }

    isExpired(token){
        const decodedJWT = jwtDecode(token);
        if(decodedJWT.exp < Date.now()/1000){
            return true;
        }else{
            return false;
        }
    }

    getUserID(){
        if(isLoggedIn()){
            const decodedJWT = jwtDecode(getToken());
            return decodedJWT.userid;
        }else{
            return false;
        }
    }

    authFetch = (url, options)=> {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if(isLoggedIn()){
            headers['Authorization'] = 'Bearer ' + getToken();
        }
        return fetch(url, {headers, ...options});
    }
}