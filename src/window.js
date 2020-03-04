const auth = new Auth(server);
var modal, loginScreen, mainScreen, spinner, taskScreen, errorDiv, errorText, taskTemplate, reload, timeouts = [];


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
    const inputAlarm = newTask.find('input.alarm')
    const buttonDelete = newTask.find('button.delete')
    var taskAlarm = null;
    inputName.val(taskData.name);
    if(taskData.description){
        inputDesc.val(taskData.description);
    }
    if(taskData.alarm){
        taskAlarm = taskData.alarm;
    }

    async function updateThis(){
        var newTaskData = {};
        if(inputDesc.val() !== inputDesc.curVal){
            inputDesc.curVal = inputDesc.val();
            newTaskData['description'] = inputDesc.val();
        }
        if(inputName.val() !== inputName.curVal){
            inputName.curVal = inputName.val();
            newTaskData['name'] = inputName.val();
        }
        if(fpInst.selectedDates[0] !== inputAlarm.curVal){
            inputAlarm.curVal = fpInst.selectedDates[0];
            newTaskData['alarm'] = fpInst.selectedDates[0];
        }
        if(Object.entries(newTaskData).length !== 0){
            newTaskData['taskid']=taskData.taskid;
            await updateTask(newTaskData);
            await loadData();
        }
    }

    inputName.focusout(()=>{
        updateThis();
    });

    inputDesc.focusout(()=>{
        updateThis();
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

    const fpInst = flatpickr(inputAlarm, {
        enableTime: true,
        altInput: true,
        defaultDate: taskData.alarm,
        time_24hr: true,
        defaultDate: taskAlarm,
        altFormat: "M d Y H:i", //d.m.Y\nH:i
        dateFormat: "Z",
        onClose: (dateArr, dateStr, instance)=>{
            updateThis();
        }
    });

    buttonDelete.click(()=>{
        deleteTask(taskData.taskid);
        newTask.remove();
    });
    newTask.bind('destroyed', ()=>{
        fpInst.destroy();
        inputName.remove();
        inputDesc.remove();
        inputAlarm.remove();
        buttonDelete.remove();
        newTask.empty();
        newTask.remove();
        console.log("Removed newtask");
    });
    if(taskData.alarm){
        addAlarm(taskData);
    }
    taskScreen.append(newTask);
    return true;
}

async function addAlarm(taskData){
    const curDate = new Date();
    const taskDate = new Date(taskData.alarm);
    var dateDiff = taskDate.getTime() - curDate.getTime();
    if(dateDiff > 0){
        if(Notification.permission === 'denied') await Notification.requestPermission();
        if(Notification.permission === 'granted'){
            timeouts.push(setTimeout(()=>{
                if(Notification.permission === 'granted'){
                    new Notification(taskData.name, {
                        body: taskData.description,
                    });
                }
            }, dateDiff));
        }
    }


}

async function clearAlarms(){
    for (const elem of timeouts) {
        clearTimeout(elem);
    }
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
        clearAlarms();
        await $('div.flatpickr-calendar').remove();
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

async function updateTask(newTask, counter=0){
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
    if(!newTask.taskid){
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
        if(!newTask.description) newTask.description = null;
        const res = await auth.post('/updateTask', {
            data: newTask
        });
        if(res.data.success){
            hide(modal);
            hide(spinner);
            hideError();
            return true;
        }else{
            counter++;
            showError(`Server error: ${res.data.error}`);
            return updateTask(newTask, counter);
        }
    } catch (error) {
        counter++;
        showError(error);
        return updateTask(newTask, counter);
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