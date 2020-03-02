const auth = new Auth(server);
var modal, loginScreen, mainScreen, spinner, taskScreen, errorDiv, errorText, taskTemplate, reload;


window.onload = async()=>{
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
    if(auth.isLoggedIn()){
        try {
            show(modal);
            show(spinner);
            await loadData();
            hide(spinner);
            hideError();
            hide(modal);
            show(mainScreen);
        } catch (error) {
            showError(error);
            hide(spinner);
            show(reload);
        }
    }else{
        hide(spinner);
        show(loginScreen);
        console.log(loginScreen);
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
    const newTaskInput = await $('div.newtask > input.newtask');
    const name = newTaskInput.val();
    newTaskInput.val('');
    const newTaskData = {
        name: name
    };
    insertTask(newTaskData);
    hideError();
    try {
        const res = await auth.post('/newTask', {
            data: newTaskData
        });
        if(res.data.success){
            
            await loadData();
        }else{
            showError(res.data.error);
        }
        
    } catch (error) {
        showError(error);
    }
}

async function insertTask(taskData){
    var newTask = await $(taskTemplate).clone();
    const inputName = newTask.find('input.name')
    const inputDesc = newTask.find('input.description')
    const inputAlarmDate = newTask.find('input.alarm.date')
    const inputAlarmTime = newTask.find('input.alarm.time')
    const buttonDelete = newTask.find('button.delete')
    
    inputName.val(taskData.name);
    if(taskData.description){
        inputDesc.val(taskData.description);
    }
    
    if(taskData.alarm){
        buttonAlarm.addClass('blue');
    }
    
    inputName.focusin(()=>{
        inputName.curVal = inputName.val();
    });

    inputDesc.focusin(()=>{
        inputDesc.curVal = inputDesc.val();
    });

    inputName.focusout(()=>{
        if(inputDesc.val() !== inputDesc.curVal && inputName.val() !== inputName.curVal){
            updateTask(task.taskid, {name: inputName.val(), description: inputDesc.val(), alarm: taskData.alarm});
        }
    });

    inputDesc.focusout(()=>{
        if(inputDesc.val() !== inputDesc.curVal && inputName.val() !== inputName.curVal){
            updateTask(task.taskid, {description: inputDesc.val(), name: inputName.val(), alarm: taskData.alarm});
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
    flatpickr(inputAlarmDate, {
        enableTime: false,
        altInput: true,
        altFormat: "M d", //d.m.Y\nH:i
        dateFormat: "d.m.y",
    });
    flatpickr(inputAlarmTime, {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        altInput: true,
        altFormat: "H:i", //d.m.Y\nH:i
        dateFormat: "H:i",
    });
    buttonDelete.click(()=>{
        deleteTask(taskData.taskid);
        newTask.remove();
    });
    taskScreen.append(newTask);
    return true;
}


async function loadData(loopCounter=0){
    if(loopCounter >= 1){
        show(spinner);
        show(modal);
    }
    if(loopCounter >= 3){
        showError('loadData failed after 3 times with error: '+errorText.html());
        hide(spinner);
        show(reload);
        throw new Error(errorText.html());
    }
    try {
        const res = await auth.post('/getTask/all');
        const resData = res.data;
        taskScreen.empty();
        if(resData.success){
            for (const task of resData.tasks) {
                insertTask(task);
            }
            show(mainScreen);
            hide(modal);
            hide(spinner);
        }else{
            showError(resData.error);
            loopCounter++;
            return loadData(loopCounter);
        }
    } catch (error) {
        showError(error);
        loopCounter++;
        return loadData(loopCounter);
    }

}

async function deleteTask(taskID, counter=0){
    if(counter >= 1){
        show(modal);
        show(spinner);
    }
    if(counter >= 3){
        showError('deleteTask failed after 3 times with error: '+errorText.html());
        hide(spinner);
        show(reload);
        throw new Error(errorText.html());
    }
    try {
        const res = await auth.post('/deleteTask', {
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

async function updateTask(taskID, newTask, counter=0){
    if(counter >= 1){
        show(modal);
        show(spinner);
    }
    if(counter >= 3){
        showError('updateTask failed after 3 times with error: '+errorText.html());
        hide(spinner);
        show(reload);
        throw new Error(errorText.html());
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
            hideError();
            return true;
        }else{
            counter++;
            showError(res.data.error);
            return updateTask(taskID, newTask, counter);
        }
    } catch (error) {
        counter++;
        showError(error);
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
        showError('Please supply both username and a password');
        show(loginScreen);
        hide(spinner);
        return;
    }

    
    hideError();
    hide(loginScreen);
    show(spinner);
    const authRes = await auth.login(username, password);
    if(authRes.success){
        await loadData();
        hide(modal);
        show(mainScreen);
    }else{
        showError(authRes.error);
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