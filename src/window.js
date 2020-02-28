const auth = new Auth(server);
var modal, loginScreen, mainScreen, spinner, taskScreen;


window.onload = async()=>{
    modal = await $('div.modal');
    loginScreen = await $('div.login');
    mainScreen = await $('div.main');
    spinner = await $('div.modal > div.spinner');
    taskScreen = await $('div.tasks');
    
    if(auth.isLoggedIn()){
        await loadData();
        hide(spinner);
        hide(modal);
        show(mainScreen);
        mainScreen.show(250);
    }else{
        hide(spinner);
        show(loginScreen);
        console.log(loginScreen);
    }
};

async function loadData(){
    taskScreen.empty();
    hide(mainScreen);
    show(modal);
    show(spinner);
    const res = await auth.get('/getTask/all');
    const taskTemplate = await $('#task-template').html();
    for (const task of res.data) {
        var newTask = await $(taskTemplate).clone();

        newTask.find('p.name').html(task.name);
        newTask.find('p.description').html(task.description);

        taskScreen.append(newTask);
    }
    show(mainScreen);
    hide(modal);
    hide(spinner);
}

async function logout(){
    auth.logout();
    hide(mainScreen);
    show(loginScreen);
    show(modal);
    hide(spinner);
    return true;
}

async function login(){
    const usernameInput = await $('#username');
    const passwordInput = await $('#password');
    const errorDiv = await $('div.modal > div.error');
    const errorText = await $('div.modal > div.error > p.errorText');

    const password = passwordInput.val();
    const username = usernameInput.val();

    usernameInput.val('');
    passwordInput.val('');

    if(!username || !password){
        errorText.html('Please supply both username and a password');
        show(errorDiv);
        show(loginScreen);
        hide(spinner);
        return;
    }

    
    hide(errorDiv);
    hide(loginScreen);
    show(spinner);
    const authRes = await auth.login(username, password);
    if(authRes.success){
        hide(errorDiv);
        hide(modal);
        show(mainScreen);
    }else{
        errorText.html(authRes.error);
        show(errorDiv);
        show(loginScreen);
        hide(spinner);
    }
    return;
}

function hide(object){
    object.addClass('hide');
}

function show(object){
    object.removeClass('hide');
}