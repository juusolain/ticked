var net;
var taskManager;
var modal, loginScreen, mainScreen, spinner, taskScreen, errorDiv, errorText, taskTemplate, reload, timeouts = [];

window.onload = async()=>{
    net = new Net(server);
    taskManager = new TaskManager();
    modal = await $('div.modal');
    loginScreen = await $('div.login');
    mainScreen = await $('div.main');
    spinner = await $('div.modal > div.spinner');
    taskScreen = await $('div.tasks');
    errorDiv = await $('div.error');
    errorText = await $('div.error > p.errorText');
    taskTemplate = await $('#task-template').html();
    reload = await $('div.modal > div.reload');
    const newTaskInput = await $('div.newtask > input.newtask');
    newTaskInput.keypress((event)=>{
        if(event.key === 'Enter'){
            newTask();
        }
    });
    if(net.isLoggedIn()){
        try {
            setViewState('spinner');
            await loadData();
            setViewState('main');
            hideError();
        } catch (error) {
            showError(error);
            setViewState('reload');
        }
    }else{
        setViewState('login');
    }
};

function showError(error){
    show(errorDiv)
    errorText.html(error);
}

function hideError(){
    hide(errorDiv);
}

function reloadPage(){
    location.reload();
    hide(reload);
}

async function newTask(){
    hideError();
    try {
        await taskManager.newTask();
        return true;
    } catch (error) {
        showError(error);
    }
}

async function addAlarm(taskData){//Wrapper for taskManager.addAlarm
    await taskManager.addAlarm(taskData);
    return true;
}

async function clearAlarms(){
    for (const elem of timeouts) {
        clearTimeout(elem);
    }
}

async function loadData(loopCounter=0){
    if(loopCounter >= 1){
        setViewState('spinner');
    }
    if(loopCounter >= 3){
        showError('loadData failed after 3 times with error: '+errorText.html());
        setViewState('reload');
        throw new Error(errorText.html());
    }
    try {
        await taskManager.loadData();
        setViewState('main');
        return true;
    } catch (error) {
        showError(error);
        loopCounter++;
        return loadData(loopCounter);
    }
}

async function deleteTask(taskID, counter=0){
    if(counter >= 1){
        setViewState('spinner')
    }
    if(counter >= 3){
        showError('deleteTask failed after 3 times with error: '+errorText.html());
        setViewState('reload');
        throw new Error(errorText.html());
    }
    try {
        const res = await net.post('/deleteTask', {
            data: {
                taskid: taskID
            }
        });
        if(res.data.success){
            return true;
        }else{
            throw new Error(res.data.error);
        }
        
    } catch (error) {
        counter++;
        showError(error);
        deleteTask(taskID, counter);
    }
}

async function updateTask(newTask, loopCounter=0){
    if(loopCounter >= 1){
        setViewState('spinner');
    }
    if(loopCounter >= 3){
        showError('updateTask failed after 3 times with error: '+errorText.html());
        setViewState('reload');
        return false;
    }
    try {
        await taskManager.updateTask(newTask);
        return true;
    } catch (error) {
        loopCounter++;
        showError(error);
        updateTask(newTask, loopCounter);
    }
}

async function logout(){
    net.logout();
    setViewState('login')
    return true;
}

async function login(){
    const usernameInput = await $('#username');
    const passwordInput = await $('#password');

    const password = passwordInput.val();
    const username = usernameInput.val();

    usernameInput.val('');
    passwordInput.val('');

    if(!username || !password){
        showError('Please supply both username and a password');
        show(loginScreen);
        hide(spinner);
        return;
    }

    
    hideError();
    setViewState('spinner');
    const authRes = await net.login(username, password);
    if(authRes.success){
        await loadData();
        setViewState('main');
    }else{
        showError(authRes.error);
        setViewState('login');
    }
    return;
}

function setViewState(newViewState){
    switch (newViewState) {
        case 'login':
            show(modal);
            show(loginScreen);
            hide(reload);
            hide(mainScreen);
            hide(spinner);
            break;
        case 'main':
            hide(modal);
            hide(spinner);
            hide(loginScreen);
            hide(reload);
            show(mainScreen);
            break;
        case 'reload':
            show(modal);
            show(reload);
            hide(spinner);
            hide(loginScreen);
            hide(mainScreen);
            break;
        case 'spinner':
            show(modal);
            hide(reload);
            hide(loginScreen);
            show(spinner);
            break;
        default:
            break;
    }
}

function hide(object){
    object.addClass('hide');
}

function show(object){
    object.removeClass('hide');
}