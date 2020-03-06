class Task{
    constructor(taskData){
        console.log($);
        this.taskData = taskData;
    }

    init = async()=>{
        console.log('running init', this.taskData);
        var newTask = await $(taskTemplate).clone();
        this.inputName = newTask.find('input.name')
        this.inputDesc = newTask.find('input.description')
        this.inputAlarm = newTask.find('input.alarm')
        this.buttonDelete = newTask.find('button.delete')
        var taskAlarm = null;
        this.inputName.val(this.taskData.name);
        if(this.taskData.description){
            this.inputDesc.val(this.taskData.description);
        }
        if(this.taskData.alarm){
            taskAlarm = this.taskData.alarm;
        }
        this.updateThis = async()=>{
            var newTaskData = {};
            if(this.inputDesc.val() !== this.inputDesc.curVal){
                this.inputDesc.curVal = this.inputDesc.val();
                newTaskData['description'] = this.inputDesc.val();
            }
            if(this.inputName.val() !== this.inputName.curVal){
                this.inputName.curVal = this.inputName.val();
                newTaskData['name'] = this.inputName.val();
            }
            if(fpInst.selectedDates[0] !== this.inputAlarm.curVal){
                this.inputAlarm.curVal = fpInst.selectedDates[0];
                newTaskData['alarm'] = fpInst.selectedDates[0];
            }
            if(Object.entries(newTaskData).length !== 0){
                newTaskData['taskid']=this.taskData.taskid;
                updateTask(newTaskData);
            }
        };
    
        this.inputName.focusout(()=>{
            this.updateThis();
        });
    
        this.inputDesc.focusout(()=>{
            this.updateThis();
        });
    
        this.inputDesc.keypress((event)=>{
            if(event.key === 'Enter'){
                this.inputDesc.blur();
            }
        });
    
        this.inputName.keypress((event)=>{
            if(event.key === 'Enter'){
                this.inputName.blur();
            }
        });
    
        const fpInst = flatpickr(this.inputAlarm, {
            enableTime: true,
            altInput: true,
            defaultDate: this.taskData.alarm,
            minDate: new Date(),
            time_24hr: true,
            defaultDate: taskAlarm,
            altFormat: "M d Y H:i", //d.m.Y\nH:i
            dateFormat: "Z",
            onClose: (dateArr, dateStr, instance)=>{
                this.updateThis();
            }
        });
    
        this.buttonDelete.click(()=>{
            deleteTask(this.taskData.taskid);
            newTask.remove();
        });
        newTask.bind('destroyed', ()=>{
            fpInst.destroy();
            this.inputName.remove();
            this.inputDesc.remove();
            this.inputAlarm.remove();
            this.buttonDelete.remove();
            newTask.empty();
            newTask.remove();
            console.log("Removed newtask");
        });
        if(this.taskData.alarm){
            addAlarm(this.taskData);
        }
        return newTask;
    }

    addAlarm = async function(){
        const curDate = new Date();
        const taskDate = new Date(this.taskData.alarm);
        var dateDiff = taskDate.getTime() - curDate.getTime();
        if(dateDiff > 0){
            if(Notification.permission === 'denied') await Notification.requestPermission();
            if(Notification.permission === 'granted'){
                timeouts.push(setTimeout(()=>{
                    if(Notification.permission === 'granted'){
                        new Notification(this.taskData.name, {
                            body: this.taskData.description,
                        });
                    }
                }, dateDiff));
            }
        }
    }

}
