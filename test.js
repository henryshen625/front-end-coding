// function red() {
//     console.log('red');
// }
// function green() {
//     console.log('green');
// }
// function yellow() {
//     console.log('yellow');
// }
// const task = (timer, light) => 
//     new Promise((resolve, reject) => {
//         setTimeout(() => {
//             if (light === 'red') {
//                 red()
//             }
//             else if (light === 'green') {
//                 green()
//             }
//             else if (light === 'yellow') {
//                 yellow()
//             }
//             resolve()
//         }, timer)
//     })
// const step = () => {
//     task(3000, 'red')
//         .then(() => task(2000, 'green'))
//         .then(() => task(1000, 'yellow'))
//         .then(step)
// }
// step()

function hello(...arg) {
    console.log(...arg);
}

hello(1, 3 ,4,5,6,);