class activeProcess {

    constructor(processName,creatorRoleID, processDate,processUrgency, creationTime, notificationTime, currentStages, initials, stages, lastApproached) {
        this._processName = processName;
        this._creatorRoleID = creatorRoleID;
        this._processDate = processDate;
        this._processUrgency = processUrgency;
        this._creationTime = creationTime;
        this._notificationTime = notificationTime;
        this._currentStages = currentStages;
        this._initials = initials;
        this._stages = stages;
        this._lastApproached = lastApproached;
    }

    get processName() {
        return this._processName;
    }

    set processName(value) {
        this._processName = value;
    }

    get creatorRoleID() {
        return this._creatorRoleID;
    }

    set creatorRoleID(value) {
        this._creatorRoleID = value;
    }

    get creationTime() {
        return this._creationTime;
    }

    set creationTime(value) {
        if (this.creationTime === undefined)
            this._creationTime = value;
        else throw new Error();
    }

    get processDate() {
        return this._processDate;
    }

    set processDate(value) {
        this._processDate = value;
    }

    get processUrgency() {
        return this._processUrgency;
    }

    set processUrgency(value) {
        this._processUrgency = value;
    }

    get notificationTime() {
        return this._notificationTime;
    }

    set notificationTime(value) {
        this._notificationTime = value;
    }

    get currentStages() {
        return this._currentStages;
    }

    set currentStages(value) {
        this._currentStages = value;
    }

    get initials() {
        return this._initials;
    }

    set initials(value) {
        this._initials = value;
    }

    get stages() {
        return this._stages;
    }

    set stages(value) {
        this._stages = value;
    }

    get lastApproached() {
        return this._lastApproached;
    }

    set lastApproached(value) {
        this._lastApproached = value;
    }

    attachOnlineFormToStage(stageNum, formName) {
        let stage = this.getStageByStageNum(stageNum);
        stage.attachOnlineForm(formName);
    }

    addCurrentStage(stageNum) {
        if(Number.isInteger(stageNum) && !this._currentStages.includes(stageNum))
        {
            this._currentStages.push(stageNum);
        }
        else
        {
            throw new Error("invalid stage number");
        }
    }

    removeCurrentStage(stageNum) {
        if(Number.isInteger(stageNum) && this._currentStages.includes(stageNum))
        {
            let index = this._currentStages.indexOf(stageNum);
            this._currentStages.splice(index, 1);
        }
        else
        {
            throw new Error("invalid stage number");
        }
    }

    getStageByStageNum(stageNum) {
        let foundStage = null;
        this._stages.every((stage) => {
            if (stage.stageNum === stageNum) {
                foundStage = stage;
                return false;
            }
            return true;
        });
        if (foundStage === null)
            throw new Error("stage does not exist");
        return foundStage;
    }

    getCoverage(startingStages) {
        let coverage = [];
        for(let i=0;i<startingStages.length;i++)
        {
            if(!coverage.includes(startingStages[i]))
            {
                coverage.push(startingStages[i]);
            }
            let stage = this.getStageByStageNum(startingStages[i]);
            this.getCoverage(stage.nextStages,coverage).forEach((stage)=>{
                if(!coverage.includes(stage))
                {
                    coverage.push(stage);
                }
            });
        }
        return coverage;
    }

    removeStage(stageNum) {
        let _stage = this.getStageByStageNum(stageNum);
        _stage.nextStages.forEach((_stageNum) => {
            let stage = this.getStageByStageNum(_stageNum);
            let index = stage.stagesToWaitFor.indexOf(stageNum);
            stage.stagesToWaitFor.splice(index, 1);
        });

        this._stages.forEach((stage) => {
            let index = stage.nextStages.indexOf(stageNum);
            if (index >= 0) stage.nextStages.splice(index, 1);
        });

        let index = this._stages.indexOf(_stage);
        this._stages.splice(index, 1);
    }

    removePathStages(removePathStages, exclude) {
        let _this = this;
        let recursive = function (stageNum) {
            if (!exclude.includes(stageNum)) {
                let next = _this.getStageByStageNum(stageNum).nextStages;
                exclude.push(stageNum);
                _this.removeStage(stageNum);
                next.forEach((iStage) => recursive(iStage));
            }
        };
        removePathStages.forEach((stageNum) => recursive(stageNum));
    }

    handleStage(stageDetails) {
        let stage = this.getStageByStageNum(stageDetails.stageNum);
        stage.handleStage(stageDetails.filledForms, stageDetails.fileNames, stageDetails.comments);
        for(let i=0;i<stage.nextStages.length;i++)
        {
            let currentStage = this.getStageByStageNum((stage.nextStages[i]));
            currentStage.removeStagesToWaitFor([stageDetails.stageNum]);
        }
    }

    advanceProcess(stageNum, nextStages) {
        let stage = this.getStageByStageNum(stageNum);
        this.removeCurrentStage(stageNum);
        let nextChosenStages = stage.nextStages.filter((value) => nextStages.includes(value));
        let nextNotChosenStages = stage.nextStages.filter((value) => !nextStages.includes(value));
        let chosenPath = this.getCoverage(nextStages,[]);
        let notChosenPath = this.getCoverage(nextNotChosenStages,[]);
        let stagesToRemoveFromStagesToWaitFor = notChosenPath.filter((value) => !chosenPath.includes(value));
        for(let i=0;i<stage.nextStages.length;i++)
        {
            let nextStage = this.getStageByStageNum(stage.nextStages[i]);
            if(nextStage.haveNoOneToWaitFor())
            {
                if(nextChosenStages.includes(nextStage.stageNum))
                {
                    this.addCurrentStage(nextStage.stageNum);
                }
                else
                {
                    stage.removeStagesToWaitFor(stagesToRemoveFromStagesToWaitFor);
                }
            }
        }

    }

    isWaitingForUser(roleID,userEmail){
        for(let i=0;i<this._stages.length;i++)
        {
            if (this._currentStages.includes(this._stages[i].stageNum) && this._stages[i].roleID.toString() === roleID.toString() && this._stages[i].userEmail === userEmail) {
                return true;
            }
        }
        return false;
    }

    isAvailableForRole(roleID){
        for(let i=0;i<this._stages.length;i++)
        {
            if (this._currentStages.includes(this._stages[i].stageNum) && this._stages[i].roleID.toString() === roleID.toString() && this._stages[i].userEmail === null) {
                return true;
            }
        }
        return false;
    }

    isParticipatingInProcess(userEmail){
        for(let i=0;i<this._stages.length;i++)
        {
            if(this._stages[i].userEmail === userEmail)
            {
                return true;
            }
        }
        return false;
    }

    returnProcessToCreator(){
        let flag = true;
        for(let i=0;i<this._stages.length;i++)
        {
            this._stages[i].stagesToWaitFor = this._stages[i].originStagesToWaitFor;
            if(this._initials.includes(this._stages[i].stageNum) && this._stages[i].roleID === this._creatorRoleID)
            {
                if(flag)
                {
                    this._currentStages = [this._stages[i].stageNum];
                }
                else
                {
                    throw new Error("two initials with same roles");
                }
            }
        }
        return this._currentStages[0].userEmail;
    }

    getStageNumberForUser(userEmail){
        for(let i=0;i<this._stages.length;i++)
        {
            if(this._stages[i].userEmail === userEmail)
            {
                return this._stages[i].stageNum;
            }
        }
        return -1;
    }

    assignUserToStage(roleID,userEmail){
        for(let i=0;i<this._currentStages.length;i++)
        {
            let currentStage = this.getStageByStageNum(this._currentStages[i]);
            if(currentStage.roleID.id.equals(roleID.id) && this._currentStages[i].userEmail === undefined)
            {
                currentStage.userEmail = userEmail;
            }
        }
        return -1;
    }

    unAssignUserToStage(roleID,userEmail){
        for(let i=0;i<this._currentStages.length;i++)
        {
            let currentStage = this.getStageByStageNum(this._currentStages[i]);
            if(currentStage.roleID.id.equals(roleID.id) && this._currentStages[i].userEmail === userEmail)
            {
                currentStage.userEmail = undefined;
            }
        }
        return -1;
    }

    isFinished()
    {
        return this._currentStages.length === 0;
    }

    getParticipatingUsers(){
        let userEmails = [];
        for(let i=0;i<this.stages.length;i++)
        {
            if(this.stages[i].userEmail !== null && this.stages[i].userEmail !== undefined && !userEmails.includes(this.stages[i].userEmail))
            {
                userEmails.push(this.stages[i].userEmail);
            }
        }
        return userEmails;
    }
}

module.exports = activeProcess;
