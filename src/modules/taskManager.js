class TaskManager{
    constructor(){
        this.currentTasks = [];
        console.log(taskManager);
    }
    
    insertTask = async(newTask)=>{
        const newTaskInstance = new Task(newTask, this);
        const newTaskDOM = await newTaskInstance.init();
        this.currentTasks.push(newTaskInstance);
        taskScreen.append(newTaskDOM);
        return true;
    }

    loadData = async()=>{
        const res = await net.post('/getTask/all');
        const resData = res.data;
        taskScreen.empty();
        clearAlarms();
        await $('div.flatpickr-calendar').remove();
        if(resData.success){
            for (const task of resData.tasks) {
                this.insertTask(task);
            }
        }else{
            throw new Error(resData.error);
        }
    }


    updateTask = async(newTask)=>{
        if(!newTask.taskid){
            throw new Error('No task id');
        }else{
            const res = await net.post('/updateTask', {
                data: newTask
            });
            if(res.data.success){
                return true;
            }else{
                throw new Error(res.data.error)
            }
        }
    }

    clearTasks = async()=>{

    }
    
    addAlarm = async(taskData)=>{
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
                        return true;
                    }
                }, dateDiff));
            }
            return true;
        }
        return false;
    }
}