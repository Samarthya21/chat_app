//This application is not practical 
//no encryption or authorization alas , no security
const net= require("net");
const readline=require("readline/promises")
//To create a connection you need IP address and port
//This client is actually a Duplex Stream
const rl=readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const clearLine=(dir) => {
    return new Promise((resolve,reject)=>{
        process.stdout.clearLine(dir , ()=>{
            resolve();
        })
    })
   
}
const moveCursor=(dx,dy) =>{
    return new Promise((resolve,reject) =>{
        process.stdout.moveCursor(dx,dy,()=>{
            resolve();
        }) 
    })
}
let id
const socket=net.createConnection({host:"127.0.0.1",port:3008}, async()=>{
    
    console.log("connected to the server");
    const ask=async() =>{
        const message= await rl.question("Enter a message > ");
       
        //move the cursor one line up
        await moveCursor(0,-1);
        //clear the current line that the cursor is on
        await clearLine(0);

        socket.write(`${id}-message-${message}`);
    }
    ask();

    //This is coming from the server.
    socket.on("data", async (data)=>{
        //when we are getting the message
            //log an empty line
            console.log();
            //move the cursor up
            await moveCursor(0,-1);
            //clear the line 
            await clearLine(0);
        if(data.toString("utf-8").substring(0,2) == "id"){
            //when we are getting the id
            id=data.toString('utf-8').substring(3); //everything from the 3rd character up until the end
            console.log(`Your id is ${id}\n`);
        }
        else{
            
            console.log(data.toString("utf-8"));
        }
        
        ask();
})
    
    
     
});

socket.on("end",()=>{
    console.log("Ended");
})
