let processAccessor = require('../../models/accessors/processReportAccessor');
let usersAccessor = require('../../models/accessors/usersAccessor');
let processReportAccessor = require('../../models/accessors/processReportAccessor');
let usersAndRolesController = require('../usersControllers/usersAndRolesController');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let filledOnlineFormsController = require('../../controllers/onlineFormsControllers/filledOnlineFormController');
let moment = require('moment');

module.exports.addProcessReport = (processName, creationTime, processDate, processUrgency, processCreatorEmail, callback) => {

    usersAccessor.findUsername({userEmail: processCreatorEmail}, (err, result) =>
    {
        if (err) {
            callback(err);
        }
        else {
            processAccessor.createProcessReport({
                processName: processName,
                status: 'פעיל',
                processDate: processDate,
                processUrgency: processUrgency,
                processCreatorEmail: processCreatorEmail,
                processCreatorName: result[0].userName,
                creationTime: creationTime,
                stages: [],
                filledOnlineForms: []
            }, (err) => {
                if (err) callback(err);
                else callback(null);
            });
        }
    });
};

module.exports.addActiveProcessDetailsToReport = (processName, userEmail, stageDetails, approvalTime, callback) => {
    processAccessor.findProcessReport({processName: processName}, (err, report) => {
        if (err) callback(err);
        else {
            usersAndRolesController.getRoleNameByUsername(userEmail, (err, roleName) => {
                if (err) callback(err);
                else {
                    usersAndRolesController.getFullNameByEmail(userEmail, (err2, userName) => {
                        if (err2) {
                            callback(err2);
                        }
                        else {
                            let newStage = {
                                roleName: roleName,
                                userEmail: userEmail,
                                userName: userName,
                                stageNum: stageDetails.stageNum,
                                approvalTime: approvalTime,
                                comments: stageDetails.comments,
                                action: stageDetails.action,
                                attachedFilesNames: stageDetails.fileNames
                            };
                            let newAttachedFiles = [];
                            for (let i = 0; i < stageDetails.fileNames.length; i++) {
                                if (!report.attachedFilesNames.includes(stageDetails.fileNames[i])) {
                                    newAttachedFiles.push(stageDetails.fileNames[i]);
                                }
                            }
                            let status = report.status;
                            if(stageDetails.status !== undefined)
                                status = stageDetails.status;
                            processAccessor.updateProcessReport({processName: processName}, {
                                $push: {
                                    stages: newStage,
                                    attachedFilesNames: {$each: newAttachedFiles}
                                }
                                ,
                                $set : {
                                    status: status
                                }
                            }, (err) => {
                                if (err) callback(err);
                                else callback(null);
                            });
                        }
                    });
                }
            });
        }
    });
};

module.exports.getAllProcessesReportsInSystem = (callback) => {
    processReportAccessor.findProcessesReports({}, (err, processReports) => {
        if (err) callback(err);
        else {
            callback(null, processReports);
        }
    });
};

module.exports.getAllProcessesReportsByUser = (userEmail, callback) => {
    usersAndRolesController.getRoleIdByUsername(userEmail, (err) => {
        if (err) {
            callback(err);
        } else {
            processReportAccessor.findProcessesReports({}, (err, processReports) => {
                if (err) callback(err);
                else {
                    usersAndRolesController.getAllChildren(userEmail, (err, children) => {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if (processReports === null)
                            processReports = [];
                        let toReturnProcessReports = [];
                        let userEmailsArrays = [];
                        if (processReports !== null) {
                            processReports.forEach((process) => {
                                let flag = true;
                                let currUserEmails = [];
                                if (isExistInReport(process, userEmail)) {
                                    flag = false;
                                    toReturnProcessReports.push(process);
                                    currUserEmails = [userEmail];
                                }
                                children.forEach((child) => {
                                    if (isExistInReport(process, child)) {
                                        if (flag === false) {
                                            currUserEmails = currUserEmails.concat(child);
                                        }
                                        else {
                                            toReturnProcessReports.push(process);
                                            currUserEmails = [child];
                                            flag = false;
                                        }
                                    }
                                });
                                if (flag === false) {
                                    userEmailsArrays.push(currUserEmails);
                                }
                            });
                        }
                        activeProcessController.getWaitingActiveProcessesByUser(userEmail, (err2, waitingProcesses) => {
                            processReports.forEach((process) => {
                                waitingProcesses.forEach((waitingProc) => {
                                    if (process.processName === waitingProc.processName) {
                                        toReturnProcessReports.push(process);
                                    }
                                });
                            });
                            toReturnProcessReports = toReturnProcessReports.filter((report, index, self) =>
                                index === self.findIndex((x) => (
                                    x.processName === report.processName
                                ))
                            );
                            callback(null, toReturnProcessReports);
                        })
                    });
                }
            });
        }
    });
};

module.exports.processReport = function (processName, callback) {
    this.getProcessReportFromDB(processName, (err, result) => {
        if (err) callback(err);
        else {
            if(result === null) callback(null, null);
            else {
                result[0].creationTime = moment(result[0].creationTime).format("DD/MM/YYYY HH:mm:ss");
                result[0].processDate = moment(result[0].processDate).format("DD/MM/YYYY HH:mm:ss");
                for (let i = 0; i < result[1].length; i++) {
                    result[1][i]._doc.approvalTime = moment(result[1][i]._doc.approvalTime).format("DD/MM/YYYY HH:mm:ss");
                }
                filledOnlineFormsController.getFilledOnlineForms(result[0].filledOnlineForms, 0, [], (err, formsArr) => {
                    for (let i = 0; i < formsArr.length; i++) {
                        result[0].filledOnlineForms[i] = formsArr[i];
                    }
                    callback(null, result);
                });
            }
        }
    });
};

module.exports.getProcessReportFromDB = (processName, callback) => {
    processReportAccessor.findProcessReport({processName: processName}, (err, processReport) => {
        if (err) callback(err);
        else {
            if(processReport === null) callback(null, null);
            else
            {
                processReport = processReport._doc;
                let returnProcessDetails = {
                    processName: processReport.processName,
                    creationTime: processReport.creationTime,
                    status: processReport.status,
                    urgency: processReport.processUrgency,
                    processDate: processReport.processDate,
                    filledOnlineForms: processReport.filledOnlineForms,
                    attachedFilesNames: processReport.attachedFilesNames,
                    processCreatorName: processReport.processCreatorName
                };
                callback(null, [returnProcessDetails, processReport.stages]);
            }
        }
    });
};

function isExistInReport(report, userEmail) {
    for (let i = 0; i < report._doc.stages.length; i++) {
        if (report._doc.stages[i].userEmail === userEmail) {
            return true;
        }
    }
    return report.processCreatorEmail === userEmail;
}

module.exports.convertDate = (array) => {
    for (let i = 0; i < array.length; i++) {
        array[i]._doc.processDate = moment(array[i]._doc.processDate).format("DD/MM/YYYY HH:mm:ss");
    }
};

module.exports.isExistInReport = isExistInReport;