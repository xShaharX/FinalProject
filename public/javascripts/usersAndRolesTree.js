let add_label = function () {};

let roleToEmails = {};     // roleName to usersEmail
let idToRole = {};
let emailToFullName = {};

var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
    {
        roleToEmails = JSON.parse(xmlHttp.responseText)
    }
};
xmlHttp.open("GET", '/usersAndRoles/getRoleToEmails/', true);
xmlHttp.send(null);


var xmlHttp1 = new XMLHttpRequest();
xmlHttp1.onreadystatechange = function() {
    if (xmlHttp1.readyState === 4 && xmlHttp1.status === 200)
    {
        emailToFullName = JSON.parse(xmlHttp1.responseText)
    }
};
xmlHttp1.open("GET", '/usersAndRoles/getEmailToFullName/', true);
xmlHttp1.send(null);

$(document).ready(()=>{
    var modal = document.getElementById('select_users_modal');

    window.onclick = function(event)
    {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    var xmlHttp2 = new XMLHttpRequest();
    xmlHttp2.onreadystatechange = function() {
        if (xmlHttp2.readyState === 4 && xmlHttp2.status === 200)
        {
            idToRole = JSON.parse(xmlHttp2.responseText);
        }
    };
    xmlHttp2.open("GET", '/usersAndRoles/getIdToRole/', true);
    xmlHttp2.send(null);
});

function onDrop_extension(type, command, figure) {
    alertify.prompt("הכנס את שם התפקיד","",(evt,role_name)=>{
        if(role_name != null){
            if(roleToEmails[role_name] === undefined){
                idToRole[figure.id] = role_name;
                roleToEmails[role_name] = [];
                figure.label = figure.label = new draw2d.shape.basic.Label({
                    text: role_name,
                    angle: 0,
                    fontColor: "#FFFFFF",
                    fontSize: 18,
                    stroke: 0,
                    editor: new draw2d.ui.LabelInplaceEditor({
                        onCommit: function () {
                            figure.setWidth(Math.max(figure.getWidth(), figure.label.getWidth()));
                        }
                    })
                });
                figure.add(figure.label, new draw2d.layout.locator.CenterLocator());
                app.view.getCommandStack().execute(command);
                figure.setWidth(Math.max(figure.getWidth(), figure.label.getWidth()));
                figure.setHeight(figure.height+30);
            }
            else{
                alertify.alert('A role with that name already exists');
            }
        }
    });
}


function rolesToHTML(roleName)
{
    let users_div = document.getElementById("users-div");
    users_div.innerHTML = '';

    roleToEmails[roleName].forEach((userEmail) =>
    {
        let outerDiv = document.createElement("div");
        outerDiv.style.display = "flex";
        outerDiv.style.flexDirection = "row";
        outerDiv.style.alignItems = "center";
        outerDiv.style.justifyContent = "space-between";

        let div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "row";
        div.style.alignItems = "center";

        let a = document.createElement("a");
        a.innerHTML = '<i class="ion ion-android-remove-circle" style="font-size: 30px"></i>';
        a.style.marginRight = "10px";
        a.onclick = ()=>{
            let index = roleToEmails[roleName].indexOf(userEmail);
            if(index > -1){
                roleToEmails[roleName].splice(index,1);
                delete emailToFullName[userEmail];
            }
            rolesToHTML(roleName);
        };

        let label = document.createElement("label");
        label.innerText = userEmail;
        div.appendChild(a);
        div.appendChild(label);

        outerDiv.append(div);

        label = document.createElement("label");
        label.innerText = emailToFullName[userEmail];
        outerDiv.append(label);

        users_div.append(outerDiv);
    });
    let div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    let a = document.createElement("a");
    a.innerHTML = '<i class="ion ion-android-add-circle" style="font-size: 30px"></i>';
    a.onclick = () =>
    {
        alertify.prompt("הכנס אימייל:","",(evt,email)=>{
            if (email != null) {
                let found = false;
                Object.keys(roleToEmails).forEach(roleName=>{
                    roleToEmails[roleName].forEach(userEmail=>{
                        if(email === userEmail){
                            found = true;
                            alertify.alert('המייל כבר בשימוש, בתפקיד: '+roleName)
                        }
                    })
                });
                if(!found){
                    setTimeout(()=>{
                        alertify.prompt("הכנס שם מלא:","",(evt,fullName)=>{
                            emailToFullName[email] = fullName;
                            roleToEmails[roleName].push(email);
                            rolesToHTML(roleName);
                        });
                    },400);
                }
            }
        });
    };
    users_div.appendChild(document.createElement("br"));
    div.appendChild(a);
    users_div.append(div);
}

function deleteRoleById(id){
    let emails = roleToEmails[idToRole[id]];
    emails.forEach(email=>{
       delete emailToFullName[email];
    });
    delete roleToEmails[idToRole[id]];
    delete idToRole[id];
}

function confirm() {
    app.fileSave()
}