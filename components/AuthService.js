import jwtDecode from 'jwt-decode';
import {AsyncStorage} from 'react-native';

export default class AuthService{
    constructor(server){
        this.server = server;
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
        this.getToken = this.getToken.bind(this);
        this.setToken = this.setToken.bind(this);
        this.getUserID = this.getUserID.bind(this);
    }

    async login(username, password){
        try {
            const res = await this.authFetch(`${this.server}/login`, {
                method: 'POST',
                body: JSON.stringify({username: username, password: password}),
            });
            if(res.ok){
                if (process.env.NODE_ENV == 'development') console.log("Logged in, got token: ", res.token);
                this.setToken(res.token);
                return true;
            }else{
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async register(username, password){
        if (process.env.NODE_ENV == 'development') console.log("Registering", JSON.stringify({username: username, password: password}));
        const res = await this.authFetch(`${this.server}/register`, {
            method: 'POST',
            body: JSON.stringify({username: username, password: password}),
        })
        if(res.ok){
            if (process.env.NODE_ENV == 'development') console.log("Registered, got token: ", res.token);
            this.setToken(res.token);
            return true;
        }else{
            return false;
        }
    }

    async setToken(newToken){
        await AsyncStorage.setItem('token', newToken);
        return true;
    }

    async getToken(){
        return await AsyncStorage.getItem('token');
    }

    async isLoggedIn(){
        const token = await this.getToken();
        if(token && !this.isExpired(token)){
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

    async getUserID(){
        if(await this.isLoggedIn()){
            const decodedJWT = jwtDecode(await getToken());
            return decodedJWT.userid;
        }else{
            return false;
        }
    }

    async authFetch(url, options){
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        if(this.isLoggedIn()){
            headers['Authorization'] = 'Bearer ' + await this.getToken();
        }
        return fetch(url, {headers, ...options});
    }
}