//  setTimeout(()=>{
//                 alert('Script triggered!')
//             },2500)

setTimeout( ()=> {
    var h1 = document.getElementsByTagName('h1')[0];
    console.log('running /scripts.js', h1);
   // h1.textContent = 'CHANGED THE HEADING! '
}, 1500)