class processStructure {

    constructor(structureName, initials, stages, sankey) {
        this.structureName = structureName;
        this.initials = initials;
        this.stages = stages;
        this.sankey = sankey;
    }

    getInitialStageByRoleID(roleID) {
        let initialStage = -1;
        this.stages.every((stage) => {
            let roleEqual = stage.roleID.toString() === roleID.toString();
            let initialsInclude = this.initials.includes(stage.stageNum);
            if (roleEqual && initialsInclude) {
                initialStage = stage.stageNum;
                return false;
            }
            return true;
        });
        return initialStage;
    }
    checkNotDupStagesInStructure()
    {
        for(let i=0;i<this.stages.length;i++)
        {
            for(let j=0;j<this.stages.length;j++)
            {
                if(i !== j)
                {
                    if(this.stages[i].stageNum === this.stages[j].stageNum)
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    checkInitialsExistInProcessStages()
    {
        for(let i=0;i<this.initials.length;i++)
        {
            let found = false;
            for(let j=0;j<this.stages.length;j++)
            {
                if(this.initials[i] === this.stages[j].stageNum)
                {
                    found = true;
                }
            }
            if(!found)
            {
                return false;
            }
        }
        return true;
    };
}

module.exports = processStructure;