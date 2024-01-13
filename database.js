const mongoose =require("mongoose")
class Database{
    constructor(){
        this.connect();
    }
    connect(){
.then(()=>{
console.log("con succes")
})
.catch((err)=>{
    console.log("con fail" + err)
    })
    }
}
module.exports = new Database()
