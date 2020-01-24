import productdb, {
    bulkcreate,
    getData,
    createEle,
    SortObj
} from './Modules.js';


// notice that ++id, will be increased all the time a new record is add
let db = productdb("Productdb", {
    products: `++id,name,seller,price`
});

//input tags
const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const seller = document.getElementById("seller");
const price = document.getElementById("price");

//create buttons
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

//notfound
const notfound = document.getElementById("notfound");

//event listerner for create button ------------------------
btncreate.onclick = (event) => {
    //we call the imported funciton bulkcreate, then we specify the database (db), and the table (products) as the first parameter, then the second parameter is my data
    // the flag variable will be used in the getMsg function bellow
    let flag = bulkcreate(db.products, {
        name: proname.value,
        seller: seller.value,
        price: price.value
    });

    //clear the input fields after inserting a new value
    proname.value = "";
    seller.value = "";
    price.value = "";

    //getting data for database =======================================================
    getData(db.products, data => {
        // here we display the last record id in our database then we add to it 1, and if there is no record (new database for exampe)then we add 1
        userid.value = data.id + 1 || 1;
    });
    table();

    let insertmsg = document.querySelector(".insertmsg");
    //call the function
    getMsg(flag, insertmsg);
   
};

//create event read =================================================================
btnread.onclick = table;


//update event ==================================================================
//here we are going to call the onlcikc event of the element btnupdate, and use an event handler to handle the click event
btnupdate.onclick = () => {
    //here we are going to get the user id value and store it in a variable
    // Notice the userid is in a string format so i have to convert it inot int
    const id = parseInt(userid.value || 0); //notice if i don't have any thing in the userid i just returned 0
    //if there is a value in the userid
    if (id) {
        //here am going to call the dexie update method, that method takes to arguments, the id of the record you are going to update and the values which you are going to update
        // for that we create an object to hold the values which we are going to updat
        db.products.update(id, {
            name: proname.value,
            seller: seller.value,
            price: price.value
            //if the value is updated then give a message
        }).then((updated) => {
            //let get = updated ? `date Updated` : `Couldn't Update Data`;
            let get=updated? true : false;
            let updatemsg=document.querySelector(".updatemsg");
            getMsg(get,updatemsg)
            proname.value =seller.value=price.value="";
        })
    }else{
        console.log(`Please Select id:${id}`);
    }
}

//Delete All Records ===============================================================
btndelete.onclick = () => {
    db.delete(); //this will delete all the database

    //here we created the database again
    db = productdb("Productdb", {
        products: `++di,name,seller,price`
    });

    db.open(); //here we opend the newlly created database
    table();
    textID(userid);
    let deletemsg=document.querySelector(".deletemsg");
    getMsg(true,deletemsg);
}


//Window onload event ===============================================================
//here i want to specify some features like display the product id if there is not id in the database
window.onload = event => {
    //display the product id even if there is no product records in the database, if so we display 1 instide
    textID(userid); //here we call a function to get the product id for us
}


//create dynamic table
function table() {
    const tbody = document.getElementById("tbody");

    //removing all the data in the table before adding a new records, this will prevent duplicated data
    while (tbody.hasChildNodes()) {
        //this while loop will ilitrate till all the child removed
        tbody.removeChild(tbody.firstChild);
    }

    //befor creating any dynamic element we have to get data from the databases
    getData(db.products, (data) => {
        if (data) {
            //if we have elements in the database then we are going to create a table row
            //here we created a new table tr, and append it to the tbody, then we use a function to access that table row
            createEle("tr", tbody, tr => {
                // in the for loop we are going to create a table td and then we are going to append it to the newlly create table row
                for (const value in data) {
                    //each value in the data we are going to put it in a different td
                    createEle("td", tr, td => {
                        //here we are going to user short hand if statment, and we are checking to see if the data is price, then add to it $ sign else write it normally
                        td.textContent = data.price === data[value] ? `$${data[value]}` : data[value];
                    })
                }

                // after the for -- loop we agoing to adding the edit, and delete buttons
                //first the edit button
                createEle("td", tr, td => {
                    createEle("i", td, i => {
                        i.className += "fas fa-edit btnedit";
                        //here we are going to add a new attribute the to the element i, the idea here is that new attribute will hod the id of the whole record which comes from the database
                        i.setAttribute(`data-id`, data.id) //here the name of the attribute is data-id, and the value which it holds is data.id

                        //here we are going to create onclick event to edit the data
                        i.onclick = editbtn; //editbtn is a function see bellow
                    })
                })
                //second the trash or delete button
                createEle("td", tr, td => {
                    createEle("i", td, i => {
                        i.className += "fas fa-trash btndelete";
                        i.setAttribute(`data-id`, data.id); //create a new "data attribute" for delete button element call it data-id
                        // it is important to know that all data attribute starts with "data-*", and we have to give a specific prefix for that data
                        // for example in our case we need to get the id of the so we call the data attribute "data-id", we can call it any thing like "data-name" for example, and give it the value of data id
                        i.onclick = deletebtn; //create assign onclick event to a function call it deletebtn
                    })
                })
            })
        } else {
            notfound.textContent = "No record found in the database ..!";

        }
    })

    //let td=document.createElement("td");
    //tbody.appendChild(td);


}

//function to eidt the records
const editbtn=(event) =>{
    //Notice using the event paramenter so we can access the element which asking or causing this event or fires this function 
    //We can use console.log(event.target); to get the element which causes the event
    //The idea here is get the "id" of the record.

    //first i need to get the targeted element, and then get the data id from it and i have to convert it into Integer, because the data-id is a string
    let id = parseInt(event.target.dataset.id); //notice the data-id which added it before in the element, now from the whole dataset we need the id
    db.products.get(id, function (data) {
        let newdata=SortObj(data);
        userid.value = newdata.id || 0; // here am sing that the user.id value is equal to data.id and if there is no value it will be equal to 0;
        proname.value = newdata.name || ""; // here am sing that the user.proname value is equal to data.name and if there is no value it will be equal to empty string;
        seller.value = newdata.seller || "";
        price.value = newdata.price || "";
    });
}

//function delete value from the table
const deletebtn=(event)=>{
    //here we create a variable we call it id which will take the value of the data attribute "data-id"
    let id = parseInt(event.target.dataset.id);
    //the dexie API has delete method, which we can use to delete the specific record using the id from the data attribute id
    db.products.delete(id);
    table();
}

//textbox id
function textID(textboxid){
    getData(db.products,data=>{
        textboxid.value=data.id +1 ||1;
    });
}

//function to add msg classes, it will take two parameters
function getMsg(flag, element) {
    // here we check to see if the flag is true
    if (flag) {
        //append or add a new class "movedown" to the element, notice the element is already has a class (e.g., insertmsg, or updatemsg or deletemsg), the new class will be added to it, so in our case the total classes will be two
        element.className += "movedown";
        //here am going to remove the newlly appended class after 4 seconds, because when we added it, it will be the last class in the list or array , before it there is one class for example insertmsg
        setTimeout(() => {
            //here the classList returns an array of the classes in the element (in our case we have two classes, for examle insermsg and movedown)
            // the classList will return the list of classes appended to that specific element
            element.classList.forEach(classname => {
                //here we are saying that if classname is equal to "movedown", then markit undefined or removed it from the list, keep in the mind that the first item in the class is not "movedown", it will be one of the following(insetmsg, or updatemsg or deletemsge), so defiently the movedown item will be removed
                classname == "movedown" ? undefined : element.classList.remove('movedown');
            });
        }, 4000);
    }
}