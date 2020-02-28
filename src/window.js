const auth = new window.auth('https://ticked-server.herokuapp.com');


window.onload = async()=>{
    const loginScreen = await $('div.loginModal');
    const mainScreen = await $('div.main');
    if(auth.isLoggedIn()){
        loginScreen.hide();
    }else{
        mainScreen.hide();
    }
    

};

async function login(){
    const usernameInput = await $('#username');
    const passwordInput = await $('#password');
    const loginScreen = await $('div.loginModal');
    const mainScreen = await $('div.main');
    const password = passwordInput.val();
    const username = usernameInput.val();
    const authRes = await auth.login(username, password);
    if(authRes.success){
        loginScreen.hide(1000);
        mainScreen.show(1000);
    }
    return;
}