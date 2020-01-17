import productdb,{ 
    bulkcreate, getData
} from './Modules.js';


// notice that ++id, will be increased all the time a new record is add
let db=productdb("Productdb",{
    products:`++id,name,seller,price`
});

//input tags
const userid=document.getElementById("userid");
const proname=document.getElementById("proname");
const seller=document.getElementById("seller");
const price=document.getElementById("price");

//buttons
const btncreate=document.getElementById("btn-create");
const btnread=document.getElementById("btn-read");
const btnupdate=document.getElementById("btn-update");
const btndelete=document.getElementById("btn-delete");

//insert value useing create button
btncreate.onclick=(event)=>{
    //we call the imported funciton bulkcreate, then we specify the database (db), and the table (products) as the first parameter, then the second parameter is my data
let flag= bulkcreate(db.products,{
    name:proname.nodeValue,
    seller:seller.value,
    price:price.value
})
console.log(flag);

//clear the input fields after inserting a new value
    proname.value="";
    seller.value="";
    price.value="";


    getData(db.products,(data)=>{
        // here we display the last record id in our database then we add to it 1, and if there is no record (new database for exampe)then we add 1
        userid.value=data.id +1 || 1;
    });
}

