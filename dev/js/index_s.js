$(() => {
    //----- Pop FadeInUp Animate -----//

    var pop = new WOW(
        {
            boxClass: 'fadeInUp',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset: 0,          // distance to the element when triggering the animation (default is 0)
            mobile: true,       // trigger animations on mobile devices (default is true)
            live: true,       // act on asynchronously loaded content (default is true)
            callback: function (box) {
                $(box).css({"animation-play-state": "running"})
            },
            scrollContainer: null // optional scroll container selector, otherwise use window
        }
    );

    pop.init();
});