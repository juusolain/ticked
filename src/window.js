const auth = new Auth(server);
var modal, loginScreen, mainScreen, spinner, taskScreen, errorDiv, errorText;


window.onload = async()=>{
    modal = await $('div.modal');
    loginScreen = await $('div.login');
    mainScreen = await $('div.main');
    spinner = await $('div.modal > div.spinner');
    taskScreen = await $('div.tasks');
    errorDiv = await $('div.error');
    errorText = await $('div.error > p.errorText');
    const newTaskInput = await $('div.newtask > input.newtask');
    newTaskInput.keypress((event)=>{
        if(event.key === 'Enter'){
            newTask();
        }
    });
    if(auth.isLoggedIn()){
        try {
            await loadData();
            hide(spinner);
            hide(modal);
            show(mainScreen);
        } catch (error) {
            show(modal);
            show(errorDiv);
            errorText.html(error);
        }
    }else{
        hide(spinner);
        show(loginScreen);
        console.log(loginScreen);
    }
};

async function newTask(){
    const newTaskInput = await $('div.newtask > input.newtask');
    const name = newTaskInput.val();
    console.log(name);
    show(modal);
    show(spinner);
    hide(loginScreen);
    hide(errorDiv);
    try {
        const res = await auth.post('/newTask', {
            data: {
                name: name
            }
        });
        if(res.data.success){
            newTaskInput.val('');
            await loadData();
        }else{
            show(errorDiv);
            errorText.html(res.data.error);
        }
        
    } catch (error) {
        show(errorDiv);
        errorText.html(error);
    }
}

async function loadData(loopCounter=0){
    if(loopCounter >= 3){
        hide(modal);
        show(errorDiv);
        const old = errorText.html();
        errorText.html('Failed after 3 times with error: ' + old);
        throw new Error('Failed after 3 times with error: ' + old);
    }
    hide(errorDiv);
    show(modal);
    show(spinner);
    try {
        const res = await auth.post('/getTask/all');
        const resData = res.data;
        const taskTemplate = await $('#task-template').html();
        taskScreen.empty();
        if(resData.success){
            for (const task of resData.tasks) {
                var newTask = await $(taskTemplate).clone();
                const inputName = newTask.find('input.name')
                const inputDesc = newTask.find('input.description')
                inputName.val(task.name);
                if(task.description){
                    inputDesc.val(task.description);
                }
                
                inputName.focusin(()=>{
                    inputName.curVal = inputName.val();
                });
    
                inputDesc.focusin(()=>{
                    inputDesc.curVal = inputDesc.val();
                });
    
                inputName.focusout(()=>{
                    if(inputName.val() !== inputName.curVal){
                        updateTask(task.taskid, {name: inputName.val(), description: -1});
                    }
                });
    
                inputDesc.focusout(()=>{
                    if(inputDesc.val() !== inputDesc.curVal){
                        updateTask(task.taskid, {description: inputDesc.val(), name: -1});
                    }
                });
    
                inputDesc.keypress((event)=>{
                    if(event.key === 'Enter'){
                        inputDesc.blur();
                    }
                });
    
                inputName.keypress((event)=>{
                    if(event.key === 'Enter'){
                        inputName.blur();
                    }
                });
    
    
    
                taskScreen.append(newTask);
            }
            show(mainScreen);
            hide(modal);
            hide(spinner);
        }else{
            show(errorDiv);
            errorText.html(resData.error);
            loopCounter++;
            return loadData(loopCounter);
        }
    } catch (error) {
        show(errorDiv);
        errorText.html(error);
        loopCounter++;
        return loadData(loopCounter);
    }

}

async function updateTask(taskID, newTask, counter=0){
    if(counter > 3){
        hide(modal);
        hide(spinner);
        show(errorDiv)
        errorText.html(res.error, ", exhauted ", counter, "retries");
    }
    if(!taskID){
        show(errorDiv);
        hide(modal);
        hide(spinner);
        errorText.html('Empty taskid');
        return false;
    }
    if(newTask.name === -1 && newTask.description === -1){
        return true;
    }
    try {
        hide(loginScreen);
        show(modal);
        show(spinner);
        if(!newTask.name) newTask.name = null;
        if(!newTask.name) newTask.description = null;
        const res = await auth.post('/updateTask', {
            data: {
                description: newTask.description,
                taskid: taskID,
                name: newTask.name,
            }
        });
        if(res.data.success){
            hide(modal);
            hide(spinner);
            return true;
        }else{
            counter++;
            show(errorDiv);
            errorText.html(res.error + ", " + counter + " retries");
            console.error(res.error);
            return updateTask(taskID, newTask, counter);
        }
    } catch (error) {
        counter++;
        show(errorDiv);
        errorText.html(error + ", " + counter + " retries");
        console.error(error);
        return updateTask(taskID, newTask, counter);
    }
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
        await loadData();
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