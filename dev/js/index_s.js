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


// =========================================
    // 视频
// =========================================
   console.log(h);
    $('.masking').css("height",h)
   console.log($('.masking').height());

        $('#layer_btn').click(function() {
            event.preventDefault;
            $('.masking').fadeIn();
            $(".video-text").hide()
        })

        $('.masking').click(function(event) {
            event.preventDefault;
            $(".video").style("pointer-events","none");
            $(this).hide();
        });

        $("#btns").click(function () {
            $('.masking').hide();
        })

// =========================================
    // 团队
// =========================================
     $(".person-show").hover(function () {
         $(this).css({
             "background":"rgba(119,91,250,1)",
             "box-shadow":"3px 3px 10px #8a7aee",
         });
         $(this).children($(".names")).css("color","#fff");
         $(this).children($(".infos")).css("display","block");
         $(this).children($(".position")).css("color","#fff");

     },function () {
         $(this).css('background','')  ;
         $(this).css("box-shadow","none");
         $(this).children($(".names")).css("color","");
         $(this).children($(".infos")).css("display","");
         $(this).children($(".position")).css("color","");
     })


// =========================================
    //新闻公告：取文字
// =========================================

    $.ajax({
        type: "post",
        url: cms_host + "/alist",
        data: {
            'lang':language,
            'channelType': "announcement",
        },
        contentType: 'application/x-www-form-urlencoded',
        dataType: "json",
        success:function (res) {
            // console.log(res.data);
            // console.log('duiddidudidi');
            let data = res.data;


            for(var i=0;i<data.length;i++){
                console.log(data);
                let uuid = data[i].uuid;
                let url  = data[i].articleUrl;
                console.log(url);

                $(".box-uls").append(` 
                <li class="li-btns" style="cursor: pointer">
                  <span class="lefts"><span class="iconfont icon-xiaolaba icons"></span>${data[i].articleTitle}</span>
                  <span class="rights">${data[i].createTimeStr.substring(0,10)}</span>   
                </li>
                
                `);

                setInterval(function() {
                    $(".boxss li").eq(0).slideUp(1000,function () {
                        $(this).appendTo($(this).parent()).show();
                    });
                }, 5000);

                // 点击公告跳转
                $('.li-btns').click(e => {
                    url ? window.open(url) : window.location.href = 'news_details.html?id=' + uuid;
                })

            }
        },
        error:function (e) {
            console.log(e);
        }
    })

// =========================================
//     第一屏显示
// =========================================
    var  big_titleHeight ;

    console.log($(".nav").height());
    console.log( $(".big-title").height());
    console.log( $(".announcement").height());
    console.log("宽度" + w);



      if(w <= 599){
          big_titleHeight = h - 500 - $(".announcement").height();
          $(".big-title").css("height",big_titleHeight);

      }else if (w <= 768){
          big_titleHeight = h - 420 - $(".announcement").height();
          $(".big-title").css("height",big_titleHeight);

      }else if( w <= 1024){
       big_titleHeight = h - 536 - $(".announcement").height();
          $(".big-title").css("height",big_titleHeight);


      }else if(w <=  1085){
          big_titleHeight = h - $(".nav").height() - 600 - $(".announcement").height();
          $(".big-title").css("height",big_titleHeight);


      }else if(w <= 1240){
          big_titleHeight = h - 650 - $(".announcement").height();
          $(".big-title").css("height",big_titleHeight);

      }else{
          big_titleHeight = h - 700 - $(".announcement").height();
          $(".big-title").css("height",big_titleHeight);

      }




// =========================================/
   //超级节点换字
// =========================================

    $(".hide1").hide();
    $(".hide2").hide();
      $(".box1").hover(function () {
          console.log(this);
          $(".name1").hide();
          $(".details1").hide();
          $(".hide1").fadeIn(1500);
    },function () {
          $(".name1").show();
          $(".details1").show();
          $(".hide1").hide();
    });

    $(".box2").hover(function () {
        console.log(this);
        $(".name2").hide();
        $(".details2").hide();
        $(".hide2").fadeIn(1500);
    },function () {
        $(".name2").show();
        $(".details2").show();
        $(".hide2").hide();
    });

});



