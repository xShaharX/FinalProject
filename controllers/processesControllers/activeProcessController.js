let processAccessor = require('../../models/accessors/processesAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let processStructureController = require('./processStructureController');
let activeProcess = require('../../domainObjects/activeProcess');
let activeProcessStage = require('../../domainObjects/activeProcessStage');
let onlineFormController = require('../onlineFormsControllers/onlineFormController');


/**
 * attach form to process stage
 *
 * @param activeProcessName | the process to attach the form
 * @param stageNum | the stage in the process to attach the form
 * @param formName | the name of the from from a predefined forms
 * @param callback
 */

module.exports.attachFormToProcessStage = (activeProcessName, stageNum, formName, callback) => {
    processAccessor.getActiveProcessByProcessName(activeProcessName, (err, process) => {
        if (err) callback(err);
        else {
            onlineFormController.getOnlineFormByName(formName, (err, form) => {
                if (err) callback(err);
                else {
                    if (form === null)
                        callback(new Error("no online form was found on db with the name: " + formName));
                    else {
                        try {
                            process.attachOnlineFormToStage(stageNum, formName);
                            processAccessor.updateActiveProcess({processName: activeProcessName}, {stages: process.stages}, callback)
                        } catch (e) {
                            callback(e);
                        }
                    }
                }
            });
        }
    })
};


/**
 * Starts new process from a defined structure
 *
 * @param userEmail | The userEmail that starts the process
 * @param processStructureName | The name of the structure to start
 * @param processName | The requested name for the active process
 * @param callback
 */

module.exports.startProcessByUsername = (userEmail, processStructureName, processName, callback) =>
{
    usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) =>
    {
        if (err) {
            callback(err);
        }
        else {
            processStructureController.getProcessStructure(processStructureName, (err, processStructure) =>
            {
                if (err) {
                    callback(err);
                }
                else {
                    processAccessor.getActiveProcessByProcessName(processName, (err, activeProcesses) =>
                    {
                        if (err) {
                            callback(err);
                        }
                        else {
                            if (activeProcesses === null) {
                                let initialStage = processStructure.getInitialStageByRoleID(roleID.id);
                                if (initialStage === -1) {
                                    callback(new Error(">>> ERROR: username " + userEmail + " don't have the proper role to start the process " + processStructureName));
                                    return;
                                }
                                let newStages = [];
                                processStructure.stages.forEach((stage) =>
                                {
                                    newStages.push({
                                        roleID: stage.roleID,
                                        userEmail: stage.stageNum === initialStage ? userEmail : null,
                                        stageNum: stage.stageNum,
                                        nextStages: stage.nextStages,
                                        stagesToWaitFor: stage.stageNum === initialStage ? [] : stage.stagesToWaitFor,
                                        originStagesToWaitFor: stage.stagesToWaitFor,
                                        timeApproval: null, //TODO: check if can be null | ORIGIN :new Date(-8640000000000000)
                                        onlineForms: stage.onlineForms,
                                        filledOnlineForms: [],
                                        attachedFilesNames: stage.attachedFilesNames,
                                    });
                                });
                                let today = new Date();
                                processAccessor.createActiveProcess({
                                    timeCreation: today,
                                    currentStages: [initialStage],
                                    processName: processName,
                                    initials: processStructure.initials,
                                    stages: newStages,
                                }, (err) =>
                                {
                                    if (err) callback(err);
                                    else addProcessReport(processName, today, callback);
                                });
                            }
                            else {
                                callback(new Error(">>> ERROR: there is already process with the name: " + processName));
                            }
                        }
                    });
                }
            });
        }
    });
};

/**
 * return array of active processesControllers for specific username
 *
 * @param userEmail
 * @param callback
 */
module.exports.getWaitingActiveProcessesByUser = (userEmail, callback) =>
{
    usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) =>
    {
        if (err) {
            callback(err);
        }
        else {
            let waitingActiveProcesses = [];
            processAccessor.findActiveProcesses({}, (err, activeProcesses) =>
            {
                if (err) callback(err);
                else {
                    activeProcesses.forEach((process) =>
                    {
                        if(process.isWaitingForUser(roleID,userEmail))
                        {
                            waitingActiveProcesses.push(process);
                        }
                    });
                    callback(null, waitingActiveProcesses);
                }
            });
        }
    });
};

/**
 * returns all active process for specific user
 * > FOR MONITORING <
 *
 * @param userEmail
 * @param callback
 */
module.exports.getAllActiveProcessesByUser = (userEmail, callback) =>
{
    usersAndRolesController.getRoleIdByUsername(userEmail, (err) =>
    {
        if (err) {
            callback(err);
        }
        else {
            processAccessor.findActiveProcesses({}, (err, activeProcesses) =>
            {
                if (err) callback(err);
                else {
                    let toReturnActiveProcesses = [];
                    /////////////
                    const processName1 = "TheProcessName";
                    const timeCreation = new Date();
                    const notificationTime = 10;
                    const currentStages = [0];
                    const initials = [0, 1];
                    let testProcess;
                    const onlineForms = [];
                    const filledOnlineForms = [];
                    const attachedFilesNames = [];
                    const comments = "";
                    const roleID = 0;
                    let stage0, stage1, stage2, stage3, stage4, stage5, stage6;
                    stage0 = new activeProcessStage(roleID, undefined, 0, [1], [], [], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
                    stage1 = new activeProcessStage(roleID, undefined, 1, [2, 3], [0], [0], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
                    stage2 = new activeProcessStage(roleID, undefined, 2, [4], [1], [1], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
                    stage3 = new activeProcessStage(roleID, undefined, 3, [5], [1], [1], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
                    stage4 = new activeProcessStage(roleID, undefined, 4, [6], [2], [2], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
                    stage5 = new activeProcessStage(roleID, undefined, 5, [6], [3], [3], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
                    stage6 = new activeProcessStage(roleID, undefined, 6, [], [4, 5], [4, 5], undefined, onlineForms, filledOnlineForms, attachedFilesNames, comments);
                    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
                    testProcess = new activeProcess(processName1, timeCreation, notificationTime, currentStages.slice(), initials, stages);
                    activeProcesses = [testProcess];
                    let rolesOfCurrentStages = [];
                    activeProcesses.forEach((process1) =>
                    {
                        let currentRoles = [];
                        process1.currentStages.forEach((process2) => {
                            usersAndRolesController.getRoleNameByRoleID(process2, (err, roleName) =>
                            {
                                if (err) callback(err);
                                else {
                                    currentRoles.push(roleName);
                                }
                            });
                        });
                        rolesOfCurrentStages.push(currentRoles);
                    }
                    );
                    /////////////
                    activeProcesses.forEach((process) =>
                    {
                       // if(process.isParticipatingInProcess(userEmail))
                            toReturnActiveProcesses.push(process);
                    });
                    callback(null, toReturnActiveProcesses);
                }
            });
        }
    });
};


/**
 * approving process and updating stages
 *
 * @param userEmail | the user that approved
 * @param processName | the process name that approved
 * @param stageDetails | all the stage details
 * @param filledForms | the filled forms
 * @param fileNames | added files
 * @param callback
 */
module.exports.handleProcess = (userEmail, processName, stageDetails, filledForms, fileNames, callback) =>
{
    processAccessor.getActiveProcessByProcessName(processName, (err, process) =>
    {
        if (err) callback(err);
        else {
            process.handleStage(stageDetails.stageNum, filledForms, fileNames, stageDetails.comments);
            processAccessor.updateActiveProcess({processName: processName}, {stages: process.stages},
                (err) =>
                {
                    if (err) callback(err);
                    else {
                        addActiveProcessDetailsToReport(processName, userEmail, stages.stageNum, today, stageDetails.comments, (err) =>
                        {
                            if (err) callback(err);
                            else {
                                advanceProcess(processName, stageDetails.nextStages, callback);
                            }
                        });
                    }
                });
        }
    });
};

/**
 * Advance process to next stage if able
 *
 * @param processName
 * @param nextStages
 * @param callback
 */
const advanceProcess = (processName, nextStages, callback) =>
{
    processAccessor.getActiveProcessByProcessName(processName, (err, process) =>
    {
        if (err) {
            callback(err);
        }
        else {
            process.advanceProcess(nextStages);
            processAccessor.updateActiveProcess({processName: processName}, {
                    currentStages: process.currentStages, stages: process.stages
                },
                (err, res) =>
                {
                    if (err) callback(new Error(">>> ERROR: advance process | UPDATE"));
                    else callback(null, res);
                });
        }
    });
};

const addProcessReport = (processName, timeCreation, callback) =>
{
    processAccessor.createProcessReport({
        processName: processName,
        status: 'activated',
        timeCreation: timeCreation,
        stages: []
    }, (err) =>
    {
        if (err) callback(err);
        else callback(null);
    });
};

const addActiveProcessDetailsToReport = (processName, userEmail, stageNum, timeApproval, comments, callback) =>
{
    processAccessor.findProcessReport({processName: processName}, (err, processReport) =>
    {
        if (err) callback(err);
        else {
            usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) =>
            {
                if (err) callback(err);
                else {
                    let newStage = {
                        roleID: roleID, userEmail: userEmail, stageNum: stageNum, timeApproval: timeApproval,
                        comments: comments
                    };
                    let stages = [];
                    processReport.stages.forEach((stage) =>
                    {
                        stages.push({
                            roleID: stage.roleID,
                            userEmail: stage.userEmail,
                            stageNum: stage.stageNum,
                            timeApproval: stage.timeApproval,
                            comments: stage.comments
                        })
                    });
                    stages.push(newStage);
                    processAccessor.updateProcessReport({processName: processName}, {stages: stages}, (err) =>
                    {
                        if (err) callback(err);
                        else callback(null);
                    });
                }
            });
        }
    });
};

module.exports.getAllActiveProcessDetails = (processName, callback) =>
{
    processAccessor.findProcessReport({processName: processName}, (err, processReport) =>
    {
        if (err) callback(err);
        else {
            let returnProcessDetails = {
                processName: processReport.processName, timeCreation: processReport.timeCreation,
                status: processReport.status
            };
            returnStagesWithRoleName(0, processReport.stages, [], (err, newStages) =>
            {
                callback(null, [returnProcessDetails, newStages]);
            });
        }
    });
};

const returnStagesWithRoleName = (index, stages, newStages, callback) =>
{
    if (index === stages.length) {
        callback(null, newStages);
    }
    else {
        let stage = stages[index];
        usersAndRolesController.getRoleNameByRoleID(stage.roleID, (err, roleName) =>
        {
            if (err) callback(err);
            else {
                newStages.push({
                    roleID: roleName, userEmail: stage.userEmail,
                    stageNum: stage.stageNum, timeApproval: stage.timeApproval, comments: stage.comments
                });
                returnStagesWithRoleName(index + 1, stages, newStages, callback);
            }
        });
    }
};

module.exports.takePartInActiveProcess = (processName, userEmail, callback) =>
{
    processAccessor.getActiveProcessByProcessName(processName, (err, process) =>
    {
        if (err) callback(err);
        else {
            usersAndRolesController.getRoleIdByUsername(userEmail, (err, roleID) =>
            {
                if (err) callback(err);
                else {
                    let newStages = [];
                    process.stages.forEach((stage) =>
                    {
                        newStages.push(
                            {
                                roleID: stage.roleID,
                                userEmail: (process.currentStages.includes(stage.stageNum) && stage.roleID.id.equals(roleID.id) ? userEmail : stage.userEmail),
                                stageNum: stage.stageNum,
                                nextStages: stage.nextStages,
                                stagesToWaitFor: stage.stagesToWaitFor,
                                originStagesToWaitFor: stage.originStagesToWaitFor,
                                timeApproval: stage.timeApproval,
                                onlineForms: stage.onlineForms,
                                filledOnlineForms: stage.filledOnlineForms,
                                attachedFilesNames: stage.attachedFilesNames,
                                comments: stage.comments
                            });
                    });
                    processAccessor.updateActiveProcess({processName: processName}, {stages: newStages}, callback);
                }
            });
        }
    });
};

module.exports.unTakePartInActiveProcess = (processName, userEmail, callback) =>
{
    processAccessor.getActiveProcessByProcessName(processName, (err, process) =>
    {
        if (err) callback(err);
        else {
            let newStages = [];
            process.stages.forEach((stage) =>
            {
                newStages.push(
                    {
                        roleID: stage.roleID,
                        userEmail: (process.currentStages.includes(stage.stageNum) && stage.userEmail === userEmail ? null : stage.userEmail),
                        stageNum: stage.stageNum,
                        nextStages: stage.nextStages,
                        stagesToWaitFor: stage.stagesToWaitFor,
                        originStagesToWaitFor: stage.originStagesToWaitFor,
                        timeApproval: stage.timeApproval,
                        onlineForms: stage.onlineForms,
                        filledOnlineForms: stage.filledOnlineForms,
                        attachedFilesNames: stage.attachedFilesNames,
                        comments: stage.comments
                    });
            });
            processAccessor.updateActiveProcess({processName: processName}, {stages: newStages}, callback);
        }
    });
};

module.exports.getActiveProcessByProcessName = function (processName, callback)
{
    processAccessor.findActiveProcesses({processName: processName}, (err, processArray) =>
    {
        if (err) callback(err);
        else {
            if (processArray.length === 0) callback(null, null);
            else callback(null, processArray[0]);
        }
    });
};

module.exports.getActiveProcessFromOriginal = function (oldProcessStructure)
{
    let processObj = new activeProcess(oldProcessStructure.processName, oldProcessStructure.timeCreation,
        oldProcessStructure.notificationTime, oldProcessStructure.currentStages, oldProcessStructure.initials, []);
    oldProcessStructure.stages.forEach((stage) =>
    {
        processObj.stages.push(
            new activeProcessStage(
                stage.roleID,
                stage.userEmail,
                stage.stageNum,
                stage.nextStages,
                stage.stagesToWaitFor,
                stage.originStagesToWaitFor,
                stage.timeApproval,
                stage.onlineForms,
                stage.filledOnlineForms,
                stage.attachedFilesNames,
                stage.comments))
    });
    return processObj;
};