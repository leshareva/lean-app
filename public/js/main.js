/**
 * Created by ruslan on 10.07.16.
 */
var socket = io('http://localhost:3000');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

socket.on('test', function(t){
    console.log(t);
});

socket.on('reload', function(){
    document.location = "/";
});

function test(){
    socket.emit('test', name);
}