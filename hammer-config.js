(function() {
    const swipeElement = document.getElementById('main');
    const mc = new Hammer(swipeElement);    
    mc.on('swipeleft', ev => {
        console.log("gesture : swipeleft")
        nextPage()
    })
    mc.on('swiperight', ev => {
        console.log("gesture : swiperight")
        previousPage()
    })
})()