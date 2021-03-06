/**
 *  add/update @myForms according to the filled form (formName)
 * @var myForms
 * @param formName
 * @param info - array of maps {field:, value:}
 * @param shouldLock if should lock the form or not
 */
function receiveFormInfo(formName, info, shouldLock) {
    let xhr = new XMLHttpRequest();
    let data = new FormData();
    data.append('processName', processName);
    data.append('formName', formName);
    data.append('shouldLock', shouldLock);
    data.append('info', JSON.stringify(info));
    xhr.open("POST", '/onlineForms/updateOrAddFilledForm', true);
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        }
    };
    xhr.send(data);
}

/**
 * called whenever @formName is clicked
 * @param formName
 * @param processName
 * @returns {boolean}
 */
function formClick(formName, processName) {
    window.open("/onlineForms/fill?formName=" + formName + "&processName=" + processName);
    return false;
}