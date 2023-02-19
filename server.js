console.log('HI! I AM UP!');
const http = require('http');
const fs = require('fs');
const server = http.createServer((request, response)=>{
  console.log(request.url, request.method);


  //set header content typ
  response.setHeader('Content-Type', 'text/html');
  
let path = './views/';
switch(request.url){
case'/':
path += 'index.html';
response.statusCode=200;
break;
case '/about':
path+='about.html';
response.statusCode=200;
break;
case '/about-me':
path+='about.html';
response.statusCode=301;
response.setHeader('Location', '/about');
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

server.listen(3000, 'localhost', ()=>{
    console.log('listening for requests at port 3000');
});