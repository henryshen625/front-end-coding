// 1
var result = [];
var a = 3;
var total = 0;
function foo(a) {
  var i = 0;
  for (; i < 3; i++) {
    result[i] = function() {
      //console.log(a);
      total += i * a;
      //console.log(total);
    }//执行之前i已经等于3
  }
}
  
foo(1);//a=1
result[0]();//i=3 total=0+3*1=3
result[1]();//i=3 total=3+3*1=6
result[2]();//i=3 total=6+3*1=9
// 函数作用域问题：result[i]函数内部使用了它周围作用域for的i变量，然而i变量已经在foo()那里执行完毕了，已经等于3了

// 2
var obj = {
    a: 1,
    b: function () {
        alert(this.a);
    }
}
var fun = obj.b;
fun(); // undefined // windows没有a的属性

// 3
console.log(1);
let a = setTimeout(() => {
    console.log(2)
}, 0);
console.log(3);
Promise.resolve(4).then(b => {
    console.log(b);
    clearTimeout(a);
}) 
console.log(5); // 1 3 5 4

// 4
var myObject = {
    foo: "bar",
    func: function() {
        var self = this;
        console.log(this.foo);  
        console.log(self.foo);  
        (function() {
            console.log(this.foo);  
            console.log(self.foo);  
        }());
    }
};
myObject.func();
//bar bar undefined bar
// 1.第一个this.foo输出bar，因为当前this指向对象myObject。
// 2.第二个self.foo输出bar，因为self是this的副本，同指向myObject对象。
// 3.第三个this.foo输出undefined，因为这个IIFE(立即执行函数表达式)中的this指向window。
// 4.第四个self.foo输出bar，因为这个匿名函数所处的上下文中没有self，所以通过作用域链向上查找，从包含它的父函数中找到了指向myObject对象的self。


//5 
var foo=function(x,y){
    return x-y;
    }
function foo(x,y){
    return x+y;
}
var num = foo(1,2); // -1 当出现相同名称时，优先级为：变量声明 < 函数声明 < 变量赋值


// 6
var foo = {n:1};//此值为对象，属于引用类型
(function(foo){
    var foo;
    console.log(foo.n);//1
    foo.n = 3;//重新赋值，由于存在foo局部变量，那么对foo变量进行赋值foo={n:3}，同时更改了引用类型的参数值，全局foo变量被重新赋值foo={n:3}；
    foo = {n:2};//对局部变量重新赋值
    console.log(foo.n);//2
})(foo);//匿名函数传入foo自执行
console.log(foo.n);//全局变量 3  
//1
//2
//3

console.log(foo);
var foo = 1  //变量提升
console.log(foo)
foo();
function foo(){ //函数提升
   console.log('函数')
}
//-------------相当于------------------------
function foo(){
    console.log("函数")
}
console.log(foo);
var foo = 1;//有函数类型转变成了number类型
console.log(foo);
foo();//报错


// 7
var name = '123';

var obj = {
 name: '456',
 print: function() {
  function a() {
    console.log(this.name);
  }
  a();
 }
}

obj.print();

//  123 因为调用a()直接调用 默认为全局对象 123


// 8
foo();
var foo;
function foo(){
  console.log(1);
}
foo = function(){
  console.log(2);
}
// 1 同5


// 9
var name = 'window'
const obj = {
    name: 'obj',
    sayName:function() {
        console.log(this.name)
    },
}
obj.sayMyName = () => {
    console.log(this.name)
}
const fn1 = obj.sayName
const fn2 = obj.sayMyName
fn1() 
obj.sayName() 
fn2() 
obj.sayMyName() 
// window
// obj
// window
// window

// 10
function Foo(){
    Foo.a = function(){
        console.log(1);
    }
    this.a = function(){
        console.log(2)
    }
}
// 原型方法
Foo.prototype.a = function(){
    console.log(3);
}
// 静态方法
Foo.a = function(){
    console.log(4);
}

Foo.a(); // 4
let obj = new Foo(); // 实例
obj.a();//实例方法-》 this。a  === 2
Foo.a(); // 1 在创建新的实例时  静态方法被重写了

// 11
foo(typeof a);
function foo(p) {
  console.log(this);
  console.log(p);
  console.log(typeof b);
  let b = 0;
}


function Foo(x) {
    getName = function() { console.log(1); }
    return this;
}
Foo.getName = function() { console.log(2); }
Foo.prototype.getName = function() { console.log(3); }
var getName = function() { console.log(4); }
function getName() { console.log(5); }

Foo.getName();         // 2
getName();             // 4
Foo().getName();       // 1
getName();             // 1
new Foo().getName();   // 3
new Foo.getName();     // 2
new new Foo().getName(); // 3