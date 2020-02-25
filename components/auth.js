import jwtDecode from 'jwt-decode';

export default class Auth{
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
}