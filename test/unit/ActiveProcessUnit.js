let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let expect = require('chai').expect;
let ActiveProcess = require('../../domainObjects/activeProcess');
let ActiveProcessStage = require('../../domainObjects/activeProcessStage');

const processName1 = "proc name 1";
let today = new Date();
const creationTime = new Date();
const notificationTime = 10;

let testProcess;

const onlineForms = [];
const filledOnlineForms = [];


let stage0, stage1, stage2, stage3, stage4, stage5, stage6;

let createActiveProcess1 = function () {

    /*
           +---+
           | 0 |
           +-+-+
             |
             v
           +---+
           | 1 |
           +-+-+
             |
             v
           +---+
           | 2 |
           +-+-+
             |
             v
           +-+-+
      +----+ 3 +----+
      |    +---+    |
      |             |
    +-v-+         +-v-+
    | 4 |         | 5 |
    +-+-+         +-+-+
      |             |
      |    +---+    |
      +----> 6 <----+
           +---+
    */
    stage0 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'ByDereg', dereg: '2', stageNum: 0, nextStages: [1], stagesToWaitFor: [], originStagesToWaitFor: [], userEmail: 'a@bgu.ac.il', assignmentTime: today, approvalTime: null, notificationsCycle:1});
    stage1 = new ActiveProcessStage({roleID: {id : Buffer.from('2')}, kind: 'ByDereg', dereg: '3', stageNum: 1, nextStages: [2], stagesToWaitFor: [0], originStagesToWaitFor: [0], userEmail: 'b@bgu.ac.il', assignmentTime:null, approvalTime: null, notificationsCycle:1});
    stage2 = new ActiveProcessStage({roleID: {id : Buffer.from('3')}, kind: 'ByRole', dereg: '', stageNum: 2, nextStages: [3], stagesToWaitFor: [1], originStagesToWaitFor: [1], userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1});
    stage3 = new ActiveProcessStage({roleID: {id : Buffer.from('2')}, kind: 'ByDereg', dereg: '3', stageNum: 3, nextStages: [4,5], stagesToWaitFor: [2], originStagesToWaitFor: [2], userEmail: 'b@bgu.ac.il', assignmentTime:null, approvalTime: null, notificationsCycle:1});
    stage4 = new ActiveProcessStage({roleID: {id : Buffer.from('4')}, kind: 'ByRole', dereg: '', stageNum: 4, nextStages: [6], stagesToWaitFor: [3], originStagesToWaitFor: [3], userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1});
    stage5 = new ActiveProcessStage({roleID: {id : Buffer.from('5')}, kind: 'ByRole', dereg: '', stageNum: 5, nextStages: [6], stagesToWaitFor: [3], originStagesToWaitFor: [3], userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1});
    stage6 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'Creator', dereg: '', stageNum: 6, nextStages: [], stagesToWaitFor: [4,5], originStagesToWaitFor: [4,5], userEmail: 'a@bgu.ac.il', assignmentTime:null, approvalTime: null, notificationsCycle:1});
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ActiveProcess({processName: processName1, creatorUserEmail: 'a@bgu.ac.il', processDate: new Date(), processUrgency: 3, creationTime: creationTime, notificationTime: notificationTime, currentStages: [0], onlineForms: onlineForms, filledOnlineForms: filledOnlineForms, lastApproached: new Date(), stageToReturnTo: stage0.stageNum}, stages);
};

let createActiveProcess2 = function () {

    /*
           +---+
           | 0 |
           +-+-+
             |
             v
           +---+
           | 1 |
           +-+-+
             |
             v
           +---+
           | 2 |
           +-+-+
             |
             v
           +-+-+
      +----+ 3 +----+
      |    +---+    |
      |             |
    +-v-+         +-v-+
    | 4 |         | 5 |
    +-+-+         +-+-+
      |             |
      |    +---+    |
      +----> 6 <----+
           +---+
    */
    stage0 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'ByDereg', dereg: '2', stageNum: 0, nextStages: [1], stagesToWaitFor: [], originStagesToWaitFor: [], userEmail: 'a@bgu.ac.il', assignmentTime:today, approvalTime: today, notificationsCycle:1});
    stage1 = new ActiveProcessStage({roleID: {id : Buffer.from('2')}, kind: 'ByDereg', dereg: '3', stageNum: 1, nextStages: [2], stagesToWaitFor: [], originStagesToWaitFor: [], userEmail: 'b@bgu.ac.il', assignmentTime:today, approvalTime: today, notificationsCycle:1});
    stage2 = new ActiveProcessStage({roleID: {id : Buffer.from('3')}, kind: 'ByRole', dereg: '', stageNum: 2, nextStages: [3], stagesToWaitFor: [], originStagesToWaitFor: [], userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1});
    stage3 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'Creator', dereg: '', stageNum: 3, nextStages: [4,5], stagesToWaitFor: [2], originStagesToWaitFor: [2], userEmail: 'a@bgu.ac.il', assignmentTime:null, approvalTime: null, notificationsCycle:1});
    stage4 = new ActiveProcessStage({roleID: {id : Buffer.from('4')}, kind: 'ByRole', dereg: '', stageNum: 4, nextStages: [6], stagesToWaitFor: [3], originStagesToWaitFor: [3], userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1});
    stage5 = new ActiveProcessStage({roleID: {id : Buffer.from('2')}, kind: 'ByDereg', dereg: '3', stageNum: 5, nextStages: [6], stagesToWaitFor: [3], originStagesToWaitFor: [3], userEmail: null, assignmentTime:null, approvalTime: null, notificationsCycle:1});
    stage6 = new ActiveProcessStage({roleID: {id : Buffer.from('1')}, kind: 'Creator', dereg: '', stageNum: 6, nextStages: [], stagesToWaitFor: [4,5], originStagesToWaitFor: [4,5], userEmail: 'a@bgu.ac.il', assignmentTime:null, approvalTime: null, notificationsCycle:1});
    let stages = [stage0, stage1, stage2, stage3, stage4, stage5, stage6];
    testProcess = new ActiveProcess({processName: processName1, creatorUserEmail: 'a@bgu.ac.il', processDate: new Date(), processUrgency: 3, creationTime: creationTime, notificationTime: notificationTime, currentStages: [2], onlineForms: onlineForms, filledOnlineForms: filledOnlineForms, lastApproached: new Date(), stageToReturnTo: stage0.stageNum}, stages);
};

describe('ActiveProcess', function () {

    describe('1.0 removeStage', function () {

        beforeEach(createActiveProcess1);

        it('1.1 remove existing stage', () => {
            testProcess.getStageByStageNum(1);
            assert.deepEqual(testProcess.getStageByStageNum(0).nextStages, [1]);
            assert.deepEqual(testProcess.getStageByStageNum(2).stagesToWaitFor, [1]);
            assert.deepEqual(testProcess.getStageByStageNum(2).originStagesToWaitFor, [1]);
            let result = testProcess.removeStage(1);
            assert.deepEqual(result instanceof Error, false);
            result = testProcess.getStageByStageNum(1);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "getStageByStageNum: stage doesn't exist");
            assert.deepEqual(testProcess.getStageByStageNum(0).nextStages, [2]);
            assert.deepEqual(testProcess.getStageByStageNum(2).stagesToWaitFor, [0]);
            assert.deepEqual(testProcess.getStageByStageNum(2).originStagesToWaitFor, [0]);
        });

        it('1.2 remove non existing stage', () => {
            let result = testProcess.getStageByStageNum(999);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "getStageByStageNum: stage doesn't exist");
            result = testProcess.removeStage(999);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "removeStage: stage doesn't exist");
        });

        it('1.3 remove non numeric stage', () => {
            let result = testProcess.getStageByStageNum('blah');
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "getStageByStageNum: stage not numeric");
            result = testProcess.removeStage('blah');
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "removeStage: stage isn't numeric");
        });
    });

    describe('2.0 addCurrentStage', function () {

        beforeEach(createActiveProcess1);

        it('2.1 add non existing current stage', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.addCurrentStage(1);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual([0, 1], testProcess.currentStages);
        });

        it('2.2 add existing current stage', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.addCurrentStage(0);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, 'addCurrentStage: stage already exists in current stages');
            assert.deepEqual([0], testProcess.currentStages);
        });

        it('2.3 add non existing stage to current stages', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.addCurrentStage(999);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "addCurrentStage: stage doesn't exist");
            assert.deepEqual([0], testProcess.currentStages);
        });

        it('2.4 add non numeric stage to current stages', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.addCurrentStage(undefined);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "addCurrentStage: stage isn't numeric");
            assert.deepEqual([0], testProcess.currentStages);
        });
    });

    describe('3.0 removeCurrentStage', function () {

        beforeEach(createActiveProcess1);

        it('3.1 remove existing current stage', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.removeCurrentStage(0);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual([], testProcess.currentStages);
        });

        it('3.2 remove non existing stage', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.removeCurrentStage(1);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "removeCurrentStage: stage doesn't exist in current stages");
            assert.deepEqual([0], testProcess.currentStages);
        });

        it('3.3 remove non existing stage from current stages', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.removeCurrentStage(999);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "removeCurrentStage: stage doesn't exist");
            assert.deepEqual([0], testProcess.currentStages);
        });

        it('3.4 remove non numeric stage to current stages', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.removeCurrentStage(undefined);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "removeCurrentStage: stage isn't numeric");
            assert.deepEqual([0], testProcess.currentStages);
        });
    });

    describe('4.0 getStageByStageNum', function () {

        beforeEach(createActiveProcess1);

        it('4.1 get existing stage', () => {
            assert.deepEqual(stage0, testProcess.getStageByStageNum(0));
            assert.deepEqual(stage1, testProcess.getStageByStageNum(1));
            assert.deepEqual(stage2, testProcess.getStageByStageNum(2));
            assert.deepEqual(stage3, testProcess.getStageByStageNum(3));
            assert.deepEqual(stage4, testProcess.getStageByStageNum(4));
            assert.deepEqual(stage5, testProcess.getStageByStageNum(5));
            assert.deepEqual(stage6, testProcess.getStageByStageNum(6));
        });

        it('4.2 get non existing stage', () => {
            let result = testProcess.getStageByStageNum(77);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "getStageByStageNum: stage doesn't exist");
        });

        it('4.3 get non numeric stage', () => {
            let result = testProcess.getStageByStageNum(undefined);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "getStageByStageNum: stage not numeric");
        });
    });


    describe('5.0 getCoverage', function () {

        beforeEach(createActiveProcess1);

        it('5.1 get existing paths', () => {
            assert.deepEqual([0, 1, 2, 3, 4, 5, 6], testProcess.getCoverage([0]).sort());
            assert.deepEqual([1, 2, 3, 4, 5, 6], testProcess.getCoverage([1]).sort());
            assert.deepEqual([2, 3, 4, 5, 6], testProcess.getCoverage([2]).sort());
            assert.deepEqual([3, 4, 5, 6], testProcess.getCoverage([3]).sort());
            assert.deepEqual([4, 6], testProcess.getCoverage([4]).sort());
            assert.deepEqual([5, 6], testProcess.getCoverage([5]).sort());
            assert.deepEqual([6], testProcess.getCoverage([6]).sort());
        });

        it('5.2 get path from not existing stage numbers', () => {
            let result = testProcess.getCoverage([100, 1, 2, 3]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "getCoverage: some stages don't exist");
        });

        it('5.3 get path from non numeric stage numbers', () => {
            let result = testProcess.getCoverage([4, undefined, 2, 3]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "getCoverage: some stages are not numeric");
        });
    });

    describe('6.0 handleStage', function () {

        beforeEach(createActiveProcess1);

        it('6.1 handle existing current stage', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.handleStage(0);
            assert.deepEqual(result instanceof Error, false);
            let nextStage = testProcess.getStageByStageNum(1);
            assert.deepEqual([], nextStage.stagesToWaitFor);
        });

        it('6.2 handle non existing stage', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.handleStage(1000);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "handleStage: stage doesn't exist");
        });

        it('6.3 handle non existing current stage', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.handleStage(1);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "handleStage: stage doesn't exist in current stages");
        });
    });

    describe('7.0 advanceProcess', function () {

        beforeEach(createActiveProcess1);

        it('7.1 advances with valid parameters', () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.handleStage(0);
            assert.deepEqual(result instanceof Error, false);
            result = testProcess.advanceProcess(0,[1]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual([1], testProcess.currentStages);
        });

        it("7.2 advances stage nextStages is not an array", () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.advanceProcess(0,4);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "advanceProcess: nextStages is not an array");
            assert.deepEqual([0], testProcess.currentStages);
        });

        it("7.3 advances stage that doesn't exist", () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.advanceProcess(1000,[1]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "advanceProcess: stage doesn't exist");
            assert.deepEqual([0], testProcess.currentStages);
        });

        it("7.4 advances stage that is not current", () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.advanceProcess(3,[1]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "advanceProcess: stage isn't a current stage");
            assert.deepEqual([0], testProcess.currentStages);
        });

        it("7.5 advances stage that hasn't been handled", () => {
            assert.deepEqual([0], testProcess.currentStages);
            let result = testProcess.advanceProcess(0,[1]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "advanceProcess: can't advance not handled stage");
            assert.deepEqual([0], testProcess.currentStages);
        });

        it("7.6 advances stage nextStages are invalid", () => {
            assert.deepEqual([0], testProcess.currentStages);
            testProcess.handleStage(0);
            let result = testProcess.advanceProcess(0,[1, 1000]);
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, "advanceProcess: nextStages are invalid");
            assert.deepEqual([0], testProcess.currentStages);
        });
    });

    describe('8.0 isWaitingForUser', function () {

        beforeEach(createActiveProcess1);

        it('8.1 check if process is waiting for the user when user exists in a current stage', () => {
            assert.equal(testProcess.isWaitingForUser('a@bgu.ac.il'), true);
        });

        it('8.2 check if process is waiting for the user when user doesnt exist in a current stage', () => {
            assert.equal(testProcess.isWaitingForUser('b@bgu.ac.il'), false);
        });
    });

    describe('9.0 isAvailableForRole', function () {

        beforeEach(createActiveProcess2);

        it('9.1 check if process is available to role true', () => {
            assert.equal(testProcess.isAvailableForRole({id : Buffer.from('3')}), true);
        });

        it('9.2 check if process is available to role false', () => {
            assert.equal(testProcess.isAvailableForRole({id : Buffer.from('1')}), false);
        });
    });

    describe('10.0 isParticipatingInProcess', function () {

        beforeEach(createActiveProcess1);

        it('10.1 check if user participates in process true', () => {
            assert.equal(testProcess.isParticipatingInProcess('a@bgu.ac.il'), true);
        });

        it('10.2 check if user participates in process false', () => {
            assert.equal(testProcess.isParticipatingInProcess('doesntparticipate@bgu.ac.il'), false);
        });
    });

    describe('11.0 returnProcessToCreator', function () {

        beforeEach(createActiveProcess2);

        it('11.1  return process to creator', () => {
            testProcess.getStageByStageNum(2).assignmentTime = new Date();
            let result = testProcess.handleStage(2);
            assert.deepEqual(result instanceof Error, false);
            result = testProcess.advanceProcess(2,[3]);
            assert.deepEqual(result instanceof Error, false);
            testProcess.getStageByStageNum(3).assignmentTime = new Date();
            result = testProcess.handleStage(3);
            assert.deepEqual(result instanceof Error, false);
            result = testProcess.advanceProcess(3,[4]);
            assert.deepEqual(result instanceof Error, false);
            result = testProcess.assignUserToStage({id : Buffer.from('4')},'c@bgu.ac.il');
            assert.deepEqual(result instanceof Error, false);
            result = testProcess.returnProcessToCreator();
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(testProcess.currentStages,[3]);
            assert.deepEqual(testProcess.stageToReturnTo, 3);
            let stageNumber3 = testProcess.getStageByStageNum(3);
            assert.deepEqual(stageNumber3 instanceof Error, false);
            let stageNumber4 = testProcess.getStageByStageNum(4);
            assert.deepEqual(stageNumber4 instanceof Error, false);
            assert.deepEqual(testProcess.creatorUserEmail, stageNumber3.userEmail);
            assert.deepEqual(stageNumber3.approvalTime, null);
            assert.deepEqual(stageNumber4.assignmentTime, null);
            assert.deepEqual(stageNumber4.approvalTime, null);
            assert.deepEqual(stageNumber4.stagesToWaitFor, stageNumber4.originStagesToWaitFor);
        });
    });

    describe('12.0 getCurrentStageNumberForUser', function () {

        beforeEach(createActiveProcess1);

        it('12.1 getCurrentStageNumberForUser correct', () => {
            assert.deepEqual(testProcess.getCurrentStageNumberForUser('a@bgu.ac.il'), 0);
        });

        it('12.2 getCurrentStageNumberForUser incorrect', () => {
            assert.deepEqual(testProcess.getCurrentStageNumberForUser('gg@bgu.ac.il'), -1);
        });
    });

    describe('13.0 assign and unassign', function () {

        beforeEach(createActiveProcess2);

        it('13.1 assign user and unassign correct', () => {
            let stage = testProcess.getStageByStageNum(2);
            assert.equal(stage.userEmail,null);
            let result = testProcess.assignUserToStage({id : Buffer.from('3')},'c@bgu.ac.il');
            assert.deepEqual(result instanceof Error, false);
            assert.equal(testProcess.getCurrentStageNumberForUser('c@bgu.ac.il'),2);
            stage = testProcess.getStageByStageNum(2);
            assert.equal(stage.userEmail,'c@bgu.ac.il');
            result = testProcess.returnProcessToCreator();
            assert.deepEqual(result instanceof Error, false);
            result = testProcess.handleStage(0);
            assert.deepEqual(result instanceof Error, false);
            result = testProcess.advanceProcess(0,[1]);
            assert.deepEqual(result instanceof Error, false);
            result = testProcess.unAssignUserToStage({id : Buffer.from('2')}, 'b@bgu.ac.il');
            assert.deepEqual(result instanceof Error, false);
            assert.equal(testProcess.getStageByStageNum(1).userEmail, null);
            assert.equal(testProcess.getStageByStageNum(5).userEmail, null);
            result = testProcess.assignUserToStage({id : Buffer.from('2')}, 'abcd@bgu.ac.il');
            assert.deepEqual(result instanceof Error, false);
            assert.equal(testProcess.getStageByStageNum(1).userEmail, 'abcd@bgu.ac.il');
            assert.equal(testProcess.getStageByStageNum(5).userEmail, 'abcd@bgu.ac.il');
        });

        it('13.2 assign user and unAssign incorrect', () => {
            let stage = testProcess.getStageByStageNum(2);
            assert.equal(stage.userEmail,null);
            let result = testProcess.assignUserToStage({id : Buffer.from('4')},'c@bgu.ac.il');
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, 'assignUserToStage: cant assign user');
            result = testProcess.unAssignUserToStage({id : Buffer.from('4')},'c@bgu.ac.il');
            assert.deepEqual(result instanceof Error, true);
            assert.deepEqual(result.message, 'unAssignUserToStage: cant unAssign user');
        });

    });

    describe('14.0 isFinishedProcess', function () {
        beforeEach(createActiveProcess2);
        it('14.1 get is finished process', () => {
            assert.deepEqual(testProcess.isFinished(), false);
            testProcess.getStageByStageNum(2).assignmentTime = new Date();
            testProcess.handleStage(2);
            testProcess.advanceProcess(2,[3]);
            testProcess.getStageByStageNum(3).assignmentTime = new Date();
            testProcess.handleStage(3);
            testProcess.advanceProcess(3,[4]);
            testProcess.getStageByStageNum(4).assignmentTime = new Date();
            testProcess.handleStage(4);
            testProcess.advanceProcess(4,[6]);
            testProcess.getStageByStageNum(6).assignmentTime = new Date();
            testProcess.handleStage(6);
            testProcess.advanceProcess(6,[]);
            assert.deepEqual(testProcess.isFinished(), true);
        });
    });

    describe('15.0 get participating users', function () {
        beforeEach(createActiveProcess1);
        it('15.1 get participating users', () => {
            assert.deepEqual(testProcess.getParticipatingUsers(),['a@bgu.ac.il','b@bgu.ac.il']);
        });
    });

    describe('16.0 is stage exists', function () {
        beforeEach(createActiveProcess1);
        it('16.1 is stage exists true', () => {
            assert.deepEqual(testProcess.isStageExists(0),true);
            assert.deepEqual(testProcess.isStageExists(1),true);
            assert.deepEqual(testProcess.isStageExists(2),true);
        });

        it('16.2 is stage exists false', () => {
            assert.deepEqual(testProcess.isStageExists(999),false);
            assert.deepEqual(testProcess.isStageExists(888),false);
            assert.deepEqual(testProcess.isStageExists(777),false);
        });
    });

    describe('17.0 increment notifications cycle', function () {
        beforeEach(createActiveProcess1);
        it('17.1 increment cycle', () => {
            let result = testProcess.incrementNotificationsCycle([0,1,2,3]);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(testProcess.getStageByStageNum(0).notificationsCycle,2);
            assert.deepEqual(testProcess.getStageByStageNum(1).notificationsCycle,2);
            assert.deepEqual(testProcess.getStageByStageNum(2).notificationsCycle,2);
            assert.deepEqual(testProcess.getStageByStageNum(3).notificationsCycle,2);
            assert.deepEqual(testProcess.getStageByStageNum(4).notificationsCycle,1);
        });
    });

    describe('18.0 removePathNotFromStage', function () {
        beforeEach(createActiveProcess1);
        it('18.1 removePathNotFromStage', () => {
            let result = testProcess.removePathNotFromStage(4);
            assert.deepEqual(result instanceof Error, false);
            assert.deepEqual(testProcess.getStageByStageNum(6).stagesToWaitFor, [4]);
        });
    });
});
