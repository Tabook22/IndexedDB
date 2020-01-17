const productdb =(dbname,table)=>{
//create database
//here first we create an instance of Dexie class, and we give it the name of our database
const db=new Dexie(dbname);
//here we are creating the version of our database and the name of the store which we going to create
db.version(1).stores(table);

db.open();

//here we returned the db so we can access it later on, because we are here using what is called pure function
// a pure JavaScript funcitons takes some imputs and returns output, we have our inputs "dbname, table", and we now returning our "db"
return db;
}

//insert function
const bulkcreate=(dbtable,data)=>{
    //first we are going to check if there is any data added or not before saving the data
   let flag=  empty(data);
    if(flag){
        //store the data in the database
        dbtable.bulkAdd([data]);
        console.log("data inserted successfully...!");
    }else{
       console.log("Please provide data ...!"); 
    }
    return flag;

}

//check textbox validation
//create a function called empty and specify a prameter called object
const empty = object =>{
    let flag=false;
    
    //create for loop function
    for(const value in object){
        //checking the value of the object
        if(object[value]!="" && object.hasOwnProperty(value)){
            flag=true;
        }else{
            flag=false;
        }
    }
    return flag;
}



//getting data from the database
const getData=(dbtable, fn)=>{
    let index=0;
    let obj={};

    //count how many records in my database
    dbtable.count((count)=>{
        if(count){
            dbtable.each(table =>{
               obj= Sortobj(table);
               fn(obj, index++)
            })
        }else{
            fn(0);
        }
    })
}

//sort object
//here we are creating a funciton to sort the data in the way we want it to be for example we want to be id, name, seller and price
const Sortobj=sortobj =>{
    let obj={};
    obj={
        id:sortobj.id,
        name: sortobj.name,
        seller: sortobj.seller,
        price: sortobj.price

    }
    return obj;
}



export default productdb;
export {
    bulkcreate,
    getData
};