let select_role_clicked = function () {
};
let add_label = function () {
};
let is_role_list_set = false;

let formsOfProcess = [];
let onlineForms = [];

let xmlHttpFormsOfProcess = new XMLHttpRequest();
let params = "?processStructureName=" + processStructureName + '&fromWaiting='+(diagramContext==='viewProcessStructure'?('true&mongoId='+mongoId) :'false');
xmlHttpFormsOfProcess.onreadystatechange = function () {
    if (xmlHttpFormsOfProcess.readyState === 4 && xmlHttpFormsOfProcess.status === 200) {
        formsOfProcess = JSON.parse(xmlHttpFormsOfProcess.responseText)
    }
};
xmlHttpFormsOfProcess.open("GET", '/processStructures/getFormsOfProcess/' + params, true);
xmlHttpFormsOfProcess.send(null);

let xmlHttpOnlineForms = new XMLHttpRequest();
xmlHttpOnlineForms.onreadystatechange = function () {
    if (xmlHttpOnlineForms.readyState === 4 && xmlHttpOnlineForms.status === 200) {
        onlineForms = JSON.parse(xmlHttpOnlineForms.responseText);
    }
};
xmlHttpOnlineForms.open("GET", '/onlineForms/getAllOnlineFormsNames/', true);
xmlHttpOnlineForms.send(null);

$(document).ready(function () {
    var modal = document.getElementById('select_role_modal');
    var span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
        modal.style.display = "none";
    };

    var modal1 = document.getElementById('see_forms_modal');

    var modal2 = document.getElementById("select_number_modal");
    var span2 = document.getElementsByClassName("close")[1];
    span2.onclick = function () {
        modal2.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
        else if (event.target === modal1) {
            modal1.style.display = "none";
        }
        else if (event.target === modal2){
            modal2.style.display = "none";
        }
        else{

        }
    };

    if(diagramContext !== "editProcessStructure"){
        document.getElementById("deleteButton").style.display = "none";
    }
});

var rolesToColor = [];

function onDrop_extension(type, command, figure,kind) {
    if (diagramContext === 'addProcessStructure' || diagramContext === 'editProcessStructure' || diagramContext === 'viewProcessStructure') {
        select_role_clicked = function () {
            let selector = document.getElementById("role_selector");
            if (kind === 'ByRole') {
                figure.label = new draw2d.shape.basic.Label({
                    text: selector.options[selector.selectedIndex].innerText,
                    angle: 0,
                    fontColor: "#FFFFFF",
                    fontSize: 18,
                    stroke: 0,
                    /*editor: new draw2d.ui.LabelInplaceEditor({onCommit:function(){
                            figure.setHeight(Math.max(figure.getHeight(),figure.label.getWidth()));
                        }})*/
                });
                figure.setBackgroundColor(rolesToColor[selector.options[selector.selectedIndex].innerText]);
            } else {
                let aboveCreatorText = document.getElementById("number-selector").value;
                figure.label = new draw2d.shape.basic.Label({
                    text: kind === 'ByColor' ? "" : (kind === "Creator" ? "יוצר התהליך" :"דרגות מעל יוצר התהליך: " +aboveCreatorText),
                    angle: 0,
                    fontColor: "#FFFFFF",
                    fontSize: 18,
                    stroke: 0,
                });
                if(kind === 'ByColor'){
                    figure.setBackgroundColor("#0003ff");
                }
                else{
                    figure.setBackgroundColor("#000000");
                }
            }
            figure.add(figure.label, new draw2d.layout.locator.CenterLocator());
            app.view.getCommandStack().execute(command);
            figure.setWidth(Math.max(figure.label.getWidth(), figure.getWidth()));
            figure.setHeight(figure.height + 30);
            document.getElementById("select_role_modal").style.display = "none";
            document.getElementById("select_number_modal").style.display = "none";
        };

        if(kind !== 'ByRole'){
            if(kind === 'AboveCreator'){
                document.getElementById("select_number_modal").style.display = "block";
            }
            else{
                select_role_clicked();
            }
        }
        else{
            if (is_role_list_set) {
                document.getElementById("select_role_modal").style.display = "block";
            } else {
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                        let selector = document.getElementById("role_selector");

                        JSON.parse(xmlHttp.responseText).forEach((role) => {
                            let option = document.createElement('option');
                            option.value = role._id;
                            option.innerText = role.roleName;
                            selector.appendChild(option);
                            rolesToColor[role.roleName] = role.color;
                        });
                        is_role_list_set = true;
                        document.getElementById("select_role_modal").style.display = "block";
                    }
                };
                xmlHttp.open("GET", '/usersAndRoles/getAllRoles/', true);
                xmlHttp.send(null);
            }
        }
    }
}


function deleteRoleById(id) {

}

function deleteStructureClicked() {
    alertify.confirm('', 'האם אתה בטוח שברצונך למחוק את מבנה התהליך ' + processStructureName +"?", function(){
        let data = {
            structureName: processStructureName
        };

        $.ajax({
                url: '/processStructures/removeProcessStructure/',
                method: "POST",
                xhrFields: {
                    withCredentials: true
                },
                data: data,
            }
        ).done(function (responseText, status)
        {
            if (status === "success") {
                if (responseText === "success") {
                    alert("מבנה התהליך נמחק בהצלחה");
                    window.location.href = '/Home/';
                }
                else {
                    alert(responseText);
                }
            }
        });
    },()=>{});
}

function confirm() {
    if (diagramContext === 'addProcessStructure' || diagramContext === 'editProcessStructure' || diagramContext === 'viewProcessStructure') {
        app.fileSave()
    }
}

function seeFormsOpened() {
    let formsDiv = document.getElementById("forms-div");
    formsDiv.innerHTML = '';
    if (formsOfProcess !== undefined) {
        formsOfProcess.forEach((formName) => {
            let div = document.createElement("div");
            div.style.marginTop = "5px";
            let button = document.createElement("button");
            button.class = "btn";
            button.innerText = '-';
            button.onclick = () => {
                let index = formsOfProcess.indexOf(formName);
                if (index > -1) {
                    formsOfProcess.splice(index, 1);
                }
                seeFormsOpened();
            };
            let a = document.createElement("a");
            a.style.color = "#ce8900";
            a.style.marginRight = "10px";
            a.innerText = formName;
            a.title = formName;
            a.href = "";

            a.onclick = function () {
                window.open("/onlineForms/display?formName=" + formName);
                return false;
            };

            div.appendChild(button);
            div.appendChild(a);
            formsDiv.append(div);


        });
    } else formsOfProcess = [];
    let div = document.createElement("div");
    div.setAttribute("style", "display:flex; flex-direction: row; margin-top: 5px");
    let select = document.createElement("select");
    select.setAttribute("id", "selectForm");
    select.style.marginRight = "10px";

    onlineForms.forEach((formName) => {
        let optionElement = document.createElement('option');
        optionElement.appendChild(document.createTextNode(formName));
        select.appendChild(optionElement);
    });

    let button = document.createElement("button");
    button.class = "btn";
    button.innerText = '+';
    button.onclick = () => {
        let selectValue = select.options[select.selectedIndex].innerText;
        let found = false;
        formsOfProcess.forEach(formName => {
            if (formName === selectValue) {
                found = true;
                alert('טופס כבר קיים בתהליך זה');
            }
        });
        if (!found) {
            formsOfProcess.push(selectValue);
            seeFormsOpened();
        }
    };
    div.appendChild(button);
    div.appendChild(select);
    formsDiv.append(div);
    document.getElementById("see_forms_modal").style.display = "block";
}