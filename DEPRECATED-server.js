console.log('HERE I AM!');
const http = require('http');
const fs = require('fs');

//"npm install" to install all dependency packages in package.json

const server = http.createServer((request, response)=>{
  console.log(request.url, request.method);


  //set header content typ
  response.setHeader('Content-Type', 'text/html');
  
let path = './';
switch(request.url){
case'/':
path += 'Index.html';
response.statusCode=200;
break;
case '/Index':
path+='index.html';
response.statusCode=200;
break;
case '/loginDashboard':
path+='about.html';
response.statusCode=301;
response.setHeader('Location', '/loginDashboard');
response.end();
break;
case '/about-us':
path+='about.html';
response.statusCode=301;
response.setHeader('Location', '/about');
response.end();
break;
default:
path+= '404.html';
response.statusCode=404;
break;
}

  //send an html file
  fs.readFile(path, (err, data)=>{
    if(err){
        console.log(err);
    }else{
        //response.write(data);
        //since we are only writing one thing we can send data directly to the .end method and it will do the same thing
        response.end(data);
    }
  })


  
});

server.listen(80, ()=>{
    console.log('listening for requests at port 80');
});