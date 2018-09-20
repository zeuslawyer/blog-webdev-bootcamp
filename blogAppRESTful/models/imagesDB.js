let images = [
    'https://pbs.twimg.com/media/CnOSMtGXgAAiEO1.jpg:large',
    'https://cdn-images-1.medium.com/max/2000/1*3GPiftfo6SE68ZCW1cfh2g.jpeg' ,
    'https://images.unsplash.com/photo-1525972385596-02ad3049150b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=404a0e671507a75cc2cfeec1e074f845&auto=format&fit=crop&w=800&q=60',
    'http://jsforcats.com/images/yarnify.png',
    'http://hdwpro.com/wp-content/uploads/2016/12/Beautiful-Great-Wallpaper.jpg',
    'https://s.hswstatic.com/gif/great-white-shark-1.jpg',
    'http://images4.fanpop.com/image/photos/19700000/Horton-hears-a-who-pics-horton-hears-a-who-19717321-400-300.jpg',
    'https://images.unsplash.com/photo-1521335751419-603f61523713?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=da93af6c8bb9ba6b964fbb102f1f44f3&auto=format&fit=crop&w=800&q=60'
]

let getImage = () => {
    return images[Math.floor(Math.random()*images.length)];
}

// console.log(getImage())

module.exports = getImage;