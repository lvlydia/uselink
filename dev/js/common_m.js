$(() => {
    /*===================================*
	            GLOBAL VARIABLE
	*===================================*/


    //获取URL
    window.url = window.location.href;

    //全局页面加入弹窗
    $('body').append(`
                        <div class="_pop_win_">
                            <div class="card"></div>
                        </div>
                    `);


    //全局弹窗脚本
    window.pop = (str, type) => {
        let pop = $('._pop_win_');

        if (!type) {
            $('._pop_win_').addClass('_red_');
        } else {
            $('._pop_win_').addClass('_green_');
        }

        let status = pop.css('display');

        l(status);

        pop.children().empty().text(str);

        if (status === 'none') {
            show();
            setTimeout(hide, 3000);
        }

        function show() {
            pop.css({display: "block", opacity: "1"}).animate({}, function () {
                $(this).removeClass('fadeOutUp').addClass('fadeInDown')
            });
        }


        function hide() {
            pop.animate({}, function () {
                $(this).addClass('fadeOutUp').removeClass('fadeInDown').fadeOut(300, function () {
                    $(this).css({display: "none"})
                })
            });
        }
    };


    /*开发IP地址
    dev_ip 本地ip  run_host 线上接口地址  dev_host  测试接口地址
    */
    let dev_ip = 'http://127.0.0.1:63342', run_host = 'https://mgm.uselink.cc',
        dev_host = 'http://192.168.0.57:9002', dev_cms = 'http://192.168.0.158:9001/cms',
        run_cms = 'https://cms.uselink.cc/cms';


    //设置语言
    const language_list = [
        {
            val: 'en',
            text: 'English'
        },
        {
            val: 'zh',
            text: '简体中文'
        },
        {
            val: 'zh-TW',
            text: '繁體中文'
        },
        {
            val: 'ko',
            text: '한국어'
        },
    ];


    //页面名字列表
    window.url_list = {
        login: 'login.html',
        news_details: 'news_details.html',
        home: 'index.html',
    };


    // 页面跳转
    window.href = url => {
        window.location.href = url_list[url];
    };


    //页面重新加载
    window.reload = time => {
        setTimeout(function () {

            location.reload()

        }, time);
    };


    //时间转换
    window.getTime = time => {
        let year = time.getFullYear();
        let month = time.getMonth() < 10 ? '0' + time.getMonth() : time.getMonth();
        let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        let hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        let minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();

        return year + '/' + month + '/' + date + ' ' + hours + ':' + minute;
    };


    //获取当前语言
    let url_arr, url_len, language;
    url_arr = url.split('/');
    url_len = url_arr.length;
    language = url_arr[url_len - 2];


    //设置语言
    window.language = url_arr[url_len - 2];


    // if (language === 'en') {
    //     $('.en_hide').hide()
    // }


    window.language_list = language_list;


    //简写打印函数
    window.l = str => {
        console.log(str);
        console.log('---------')
    };


    //获取当前开发模式
    window.dev_type = () => {
        l(url.includes(dev_ip));
        if (url.includes(dev_ip)) {
            return 'dev';
        } else {
            return 'run';
        }
    };


    //页面滚动一定距离navbar背景色变为不透明/ 底部按钮点击回顶部
    $(".top-btns").hide();
    let winScrollHeight = $(document).scrollTop();
    winScrollHeight >= 10 ? $('.nav').addClass('navActive') : $('.nav').removeClass('navActive');

    $(window).scroll(e => {
        l($(document).scrollTop());

        $(document).scrollTop() >= 10 ? $('.nav').addClass('navActive') : $('.nav').removeClass('navActive');
        // 底部按钮点击回顶部
        $(document).scrollTop() >= 100 ? $(".top-btns").show() : $(".top-btns").hide();

    });


    // 设置开发接口地址与上线正式接口地址
    if (dev_type() === 'dev') {
        window.host = dev_host;
        window.cms_host = dev_cms;
        console.log('dev');
    } else {
        window.host = run_host;
        window.cms_host = run_cms;
        console.log('run');
    }


    //发送短信验证码
    window.send_msg = (tip_, send_btn, phone, nationNumber, type_) => {
        ajax_('/sendCode', {
            phone: phone,
            nationNumber: nationNumber,
            type: type_
        }).then(data => {
            let time = 60;
            send_btn.addClass('send_waite').empty().text(time);
            let default_send_text = send_btn[0].dataset.text;

            function num() {
                if (time <= 0) {
                    time = 60;
                    clearInterval(interval);
                    send_btn.removeClass('send_waite').empty().text(default_send_text);
                } else {
                    send_btn.empty().text(time);
                    time--
                }
            }

            var interval;
            num();
            interval = setInterval(num, 1000)
        }, data => {
            tip_(data.retMsg);
        });
    };


    //js多语言列表
    window.lang_list = {
        en: {
            'incomplete': 'Incomplete information',
            'account': 'Account',
            'votes': 'Votes',
            'ranking': 'Ranking',
            'share': 'Dividend proportion',
            'help_vote': 'Vote for me',
            'node_error': 'Incorrect node name format',
            'password_format_error': 'Incorrect password format',
            'phone_format_error': 'Incorrect mobile phone number format',


            'network_error': 'Network error',
            'info_incomplete': 'Incomplete information',
            'password_not_same': 'Inconsistent passwords',
            'delegate_name_format_error': 'Incorrect super-node name format',

            //userinfo
            'close': 'Close',
            'change_pwd': 'Modify the password',
            'change': 'Modify',
            'bind': 'Bind',
            'bind_address': 'Bind the withdrawal address',
            'change_address': 'Modify the withdrawal address',
            'withdrawAddress_empty': 'The withdrawal address cannot be blank',
            'dividend_rate_error': 'Dividend proportion verification failure',
            'save_success': "Saved successfully",
            // 'submit_win_title': 'Application Information',
            'submit_success': 'Successfully submitted',

            'submitted': 'Submitted',
            'unauthorized': 'Unauthenticated',
            'did_not_pass': 'Did not pass',
            'waiting_for_processing': 'Waiting for processing',
            'verification_passed': 'Verification passed',

            'node_name_cant_null': 'Supernode name cannot be empty',
            'exit': 'exit',
            'exit_transfer': 'Exit the transfer',
            'exit_success': 'Exit the success',
            'none': 'none',
            'detail': 'Detail',
            'success': 'Success',
            'empty': 'No content yet',

            //提币详情
            'init': 'Init',
            'notSure': 'N',
            'sure': 'Y',
            'noAddress': 'N',
            'error1': 'N',
            'error2': 'N',

            //提币记录
            'time': 'Time',
            'vote': 'Votes',
            'reward': 'Award',
            'share_': 'Individual dividend',
            'isno': 'Reward issued or not',
            'operation': 'Operation',

            //退出基本信息
            'verification': 'Under review',


        },

        zh: {
            //vote
            'incomplete': '信息不完整',
            // QRcode
            'account': '账户',
            'votes': '票数',
            'ranking': '排名',
            'share': '分红比例',
            'help_vote': '帮我拉票',
            // Search
            'node_error': '节点名格式错误',
            'password_format_error': '密码格式错误',
            'phone_format_error': '手机号格式错误',

            //register
            'network_error': '网络错误',
            'info_incomplete': '信息不完整',
            'password_not_same': '两次密码输入不一致',
            'delegate_name_format_error': '超级节点名格式错误',

            //userinfo
            'close': '关闭',
            'change_pwd': '修改密码',
            'change': '修改',
            'bind': '绑定',
            'bind_address': '绑定提币地址',
            'change_address': '修改提币地址',
            'withdrawAddress_empty': '提币地址不能为空',
            'dividend_rate_error': '分红比例错误',
            'save_success': "保存成功",
            'submit_success': '提交成功',

            'submitted': '已提交',
            'unauthorized': '未认证',
            'did_not_pass': '未通过',
            'waiting_for_processing': '待处理',
            'verification_passed': '审核通过',

            'node_name_cant_null': '超级节点名不能为空',
            'exit': '退出',
            'exit_transfer': '退出转账',
            'exit_success': '退出成功',
            'none': '无',
            'detail': '详情',
            'success': '成功',
            'empty': '暂无内容',

            //提币详情
            'init': '初始化',
            'notSure': 'N',
            'sure': 'Y',
            'noAddress': 'N',
            'error1': 'N',
            'error2': 'N',

            //提币记录
            'time': '时间',
            'vote': '票数',
            'reward': '奖励',
            'share_': '个人分红',
            'isno': '是否发放奖励',
            'operation': '操作',

            //退出基本信息
            'verification': '审核中',

        },

        'zh-TW': {
            //vote
            'incomplete': '信息不完整',
            // QRcode
            'account': '賬戶',
            'votes': '票數',
            'ranking': '排名',
            'share': '分紅比例',
            'help_vote': '幫我拉票',
            // Search
            'node_error': '節點名格式錯誤',
            'password_format_error': '密碼格式錯誤',
            'phone_format_error': '手機號格式錯誤',

            //register
            'network_error': '網絡錯誤',
            'info_incomplete': '信息不完整',
            'password_not_same': '兩次密碼輸入不一致',
            'delegate_name_format_error': '超級節點名格式錯誤',

            //userinfo
            'close': '關閉',
            'change_pwd': '修改密碼',
            'change': '修改',
            'bind': '綁定',
            'bind_address': '綁定提幣地址',
            'change_address': '修改提幣地址',
            'withdrawAddress_empty': '提幣地址不能為空',
            'dividend_rate_error': '分紅比例錯誤',
            'save_success': "保存成功",
            'submit_success': '提交成功',

            'submitted': '已提交',
            'unauthorized': '未認證',
            'did_not_pass': '未通過',
            'waiting_for_processing': '待處理',
            'verification_passed': '審核通過',

            'node_name_cant_null': '超級節點名不能為空',
            'exit': '退出',
            'exit_transfer': '退出轉賬',
            'exit_success': '退出成功',
            'none': '無',
            'detail': '詳情',
            'success': '成功',
            'empty': '暫無內容',

            //提币详情
            'init': '初始化',
            'notSure': 'N',
            'sure': 'Y',
            'noAddress': 'N',
            'error1': 'N',
            'error2': 'N',

            //提币记录
            'time': '時間',
            'vote': '票數',
            'reward': '獎勵',
            'share_': '個人分紅',
            'isno': '是否發放獎勵',
            'operation': '操作',

            //退出基本信息
            'verification': '審核中',


        },

        ko: {
            //vote
            'incomplete': '불완전한 정보',
            // QRcode
            'account': '계정',
            'votes': '표수',
            'ranking': '순위',
            'share': '배당 비례',
            'help_vote': '표 끌어 모으기',
            // Search
            'node_error': '노드 이름 형식 오류',
            'password_format_error': '잘못된 암호 형식',
            'phone_format_error': '휴대폰 형식 오류',

            //register
            'network_error': '네트워크 오류',
            'info_incomplete': '불완전한 정보',
            'password_not_same': '입력한 비밀번호가 불일치',
            'delegate_name_format_error': '슈퍼 노드 이름 형식 오류',

            //userinfo
            'close': '닫기',
            'change_pwd': '비밀번호 수정',
            'change': '수정',
            'bind': '바인딩',
            'bind_address': '바인딩 화폐 주소',
            'change_address': '조화 주소 수정',
            'withdrawAddress_empty': '동전 주소를 입력하십시오',
            'dividend_rate_error': '배당비례 점검오류',
            'save_success': "성공적으로 저장되었습니다",
            'submit_success': '성공을 제출하다',

            'submitted': '이미 제출',
            'unauthorized': '인증하지 않음',
            'did_not_pass': '통과 할 수 없다',
            'waiting_for_processing': '처리 대기 중',
            'verification_passed': '제출 완료',

            'node_name_cant_null': '슈퍼 노드 이름은 비워 둘 수 없습니다',
            'exit': '로그 아웃',
            'exit_transfer': '출구 전송',
            'exit_success': '성공적으로 종료',
            'none': '아니요',
            'detail': '세부 정보',
            'success': '성공',
            'empty': '내용 없음',

            //提币详情
            'init': '초기화',
            'notSure': 'N',
            'sure': 'Y',
            'noAddress': 'N',
            'error1': 'N',
            'error2': 'N',

            //提币记录
            'time': '시간',
            'vote': '표수',
            'reward': '보너스',
            'share_': '개인배당',
            'isno': '보너스를 배분하겠습니까',
            'operation': '실행',

            //退出基本信息
            'verification': '검토 중',

        }
    };


    //js多语言方法
    window.lang = (str) => {
        return lang_list[language][str];
    };




    //promise ajax 简写
    window.ajax_ = (url, data, headers, hosts) => {
        return new Promise((resolve, reject) => {
            if (hosts) {
                //自定义接口地址
                $.ajax({
                    type: "post",
                    contentType: 'application/x-www-form-urlencoded',
                    url: hosts + url,
                    dataType: "json",
                    async: true,
                    data: data,
                    success: function (res) {
                        if (res.retCode === 200) {
                            resolve(res.data);
                        } else {
                            reject(res)
                        }
                    },
                    error: function (e) {
                        reject(e)
                    }, beforeSend: request => {
                        if (headers) {
                            request.setRequestHeader("token", window.localStorage.getItem('token'));
                            request.setRequestHeader("language", language);
                        }
                    },
                });
            } else {
                $.ajax({
                    type: "post",
                    contentType: 'application/json; charset=utf-8',
                    url: host + url,
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: function (res) {
                        if (res.retCode === 200) {
                            resolve(res.data);
                        } else {
                            reject(res)
                        }
                    },
                    error: function (e) {
                        reject(e)
                    }, beforeSend: request => {
                        if (headers) {
                            request.setRequestHeader("token", window.localStorage.getItem('token'));
                            request.setRequestHeader("language", language);
                        }
                    },
                });
            }
        });
    };


    //获取窗口宽高
    window.w = $(window).width();
    window.h = $(window).height();


    if (w > 1024) {
        window.type = 'pc';
    } else {
        window.type = 'mobile';
    }

    if(w < 599){
        $(".top-btns").click(function () {
            $('html, body').animate({scrollTop: 0}, '500');
            console.log('执行了');
        })
    }
    //pc端隐藏menu
    $(window).resize(() => {
        if ($(window).width() > 1024) {
            $('.menu_box').hide(300);

            window.type = 'pc';
        } else {
            window.type = 'mobile';
        }
    });


    function no_login() {
        //展示个人信息按钮
        $('.user_info_btn').removeClass('show').addClass('hide');

        //隐藏登录按钮
        $('.login_btn').removeClass('hide').addClass('show');
    }


    function login() {
        //隐藏登录按钮
        $('.login_btn').removeClass('show').addClass('hide');

        //展示个人信息按钮
        $('.user_info_btn').removeClass('hide').addClass('show');
    }


    //判断页面是否登录
    window.check_login = () => {
        if (window.localStorage.getItem('token')) {
            ajax_('/getUser', {}, 1).then(data => {
                let phone = data.userInfo.user.phone;
                var phones = phone.substr(0,7)+"****" + phone.substr(11);

                $('#phone').empty().html(`
                    <span class="iconfont icon-yonghu usericon"></span>
                    ${phones}
                    <i></i>
                `);

                $('#mob-useinfo').empty().html(`
                    ${phones}
                `);

                login();
            }).catch(() => {
                no_login()
            })
        } else {
            no_login()
        }
    };


    check_login();


    //退出登录
    $('#logout').click(e => {
        logout();
    });

    $('#mobile_logout').click(e => {
        logout();
    });

    function logout() {
        ajax_('/loginOut', {}, 1).then(data => {
            window.localStorage.removeItem('token');
            href('login');
        }).catch(() => {
            no_login();
            href('login');
        })
    }


    //点击个人信息按钮时切换下拉菜单
    $('.user_info_btn').click(e => {
        let obj = e.currentTarget.children[1];
        list_animate($(obj), 'fadeInUp_', 'fadeOutDown_');

        $('.menu_box').animate({}, () => {
            $('.menu_box').addClass('fadeOut').removeClass('fadeIn').fadeOut(300, () => {
                $('.menu_box').css({display: "none"});
            });
        });

        $('.pc_language_menu').animate({}, () => {
            $('.pc_language_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_language_menu').css({display: "none"});
            });
        });
    });


    //获取图形验证码
    window.get_new_graphic_code = (box, form) => {
        ajax_('/getImage', {}).then(data => {
            l(box);
            l(form);
            l(data);
            l('((((((((((((((');
            if (data.image) {
                let res = data.image;
                let dataUrl = 'data:image/jpg;base64,' + res.body;
                l(dataUrl);
                let img = new Image();
                window.pictureId = res.headers.pictureId[0];

                img.src = dataUrl;

                img.onload = () => {
                    box.html(img);
                };

                if (form) {
                    form.pictureId = res.headers.pictureId[0];
                }
            }
        }).catch(() => {
            pop(lang('network_error'));
        });
    };


    //获取国家信息
    window.getNationInfo = form => {
        ajax_('/getNationInfo', {}).then(data => {
            if (data.nationInfo) {
                let list = data.nationInfo;

                for (let q of list) {
                    //AU 那行加一条分界线
                    $('.select_list').append(`
                        <li class="hover select_country" data-icon="${q.nationFlag}" data-num="${q.nationNumber}" data-country="${language === 'zh' ? q.nationNameZh : q.nationAbbreviate}" data-id="${q.nationId}" style="${q.nationAbbreviate === 'AU' ? 'border-top: 1px solid #ddd;' : ''}">                         
                             <a href="javascript:void(0);">
                                 <img src="${q.nationFlag}">
                                 <span>+${q.nationNumber}</span>
                                 <span>${language === 'zh' ? q.nationNameZh : q.nationNameEn}</span>
                             </a>
                         </li>
                `)
                }

                //加载结束
                $('.select_default').removeClass('loading');

                //下拉列表逻辑
                $('.select_box').click(() => {
                    $('.select_box').hasClass('active') ? $('.select_box').removeClass('active') :
                        $('.select_box').addClass('active');

                    //显示或隐藏列表
                    list_animate($('.select_list'), 'fadeInUp', 'fadeOutDown');
                });

                $(document).click(() => {
                    event.stopPropagation();
                    $('.select_list').animate({}, () => {
                        $('.select_list').addClass('fadeOutDown').removeClass('fadeInUp').fadeOut(300, () => {
                            $('.select_list').css({display: "none"});
                        });
                    });
                });

                //选择国家
                $('.select_country').click(e => {
                    let data = e.currentTarget.dataset, num = data.num, country = data.country, icon = data.icon,
                        id = data.id;

                    // l(country);

                    $('.select_default').empty().append(`
                        <span>
                            <img src="${icon}">
                        </span>
                        
                        <span>+${num} ${country}</span>
                    `).attr('data-num', num);

                    form.phone_select_num = parseInt(num);
                    form.phone_select_id = parseInt(id);
                })
            } else {
                pop(lang('network_error'));
            }
        }).catch(() => {
            pop(lang('network_error'));
        });
    };


    /*===================================*
            验证部分
    *===================================*/

    //手机号验证
    window.test_phone = phone => {
        let reg = /^([0-9]\d{8,15})$/;

        if (reg.test(phone)) {
            return true
        } else {
            return false;
        }
    };


    //密码验证
    window.test_password = password => {
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$/;

        if (reg.test(password)) {
            return true
        } else {
            return false
        }
    };


    //节点名验证
    window.test_delegate_name = delegate_name => {
        let reg = /^[a-z][a-z0-9_]{4,62}$/;

        if (reg.test(delegate_name)) {
            return true
        } else {
            return false
        }
    };


    let white_paper_zh = 'http://oss.uselink.cc/white/UselinkWhiteCN.pdf';
    let white_paper_en = 'http://oss.uselink.cc/white/UselinkWhiteEN.pdf';


    //白皮书地址 中文情况下跳中文白皮书  其他情况跳英文
    language === 'zh' ? window.white_paper_url = white_paper_zh :
        window.white_paper_url = white_paper_en;

    $('.' + language + '_hide').hide();



    // 服务协议: 中文情况下跳转中文繁体文,英文情况下跳转英文韩文;

    let server_zh = 'https://spv.uselink.cc/lw/USE_service.html?version=4&walletId=1a22977b16e7df2f96ff5dbc019a927b440b2459';
    let server_en = 'https://spv.uselink.cc/lw/USE_service_en.html?version=4&walletId=1a22977b16e7df2f96ff5dbc019a927b440b2459';

    language === 'zh' || language === 'zh-TW' ? window.server_url = server_zh : window.server_url = server_en;

    // 隐私政策: 中文情况下跳转中文繁体文,英文情况下跳转英文韩文;
    let policy_zh = 'https://spv.uselink.cc/lw/USE_privacy.html?version=4&walletId=1a22977b16e7df2f96ff5dbc019a927b440b2459';
    let policy_en = 'https://spv.uselink.cc/lw/USE_privacy_en.html?version=4&walletId=1a22977b16e7df2f96ff5dbc019a927b440b2459';

    language === 'zh' || language === 'zh-TW' ? window.policy_url = policy_zh : window.policy_url = policy_en;

    /*===================================*
	        NAV SCRIPT
	*===================================*/

    //置入语言列表中的语言
    language_list.forEach(el => {
        $('.pc_language_menu').append(` 
            <li>
                <a href="javascript:void(0);" class="language_item" data-val="${el.val}">${el.text}</a>
            </li>
        `);
    });


    //显示或关闭语言列表
    $('.change_language_btn').click(e => {
        let obj = e.currentTarget.children[1];
        list_animate($(obj), 'fadeInUp_', 'fadeOutDown_');

        $('.menu_box').animate({}, () => {
            $('.menu_box').addClass('fadeOut').removeClass('fadeIn').fadeOut(300, () => {
                $('.menu_box').css({display: "none"});
            });
        });

        $('.pc_userinfo_menu').animate({}, () => {
            $('.pc_userinfo_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_userinfo_menu').css({display: "none"});
            });
        });
    });

    //点击按钮显示或隐藏对象方法
    window.list_animate = function list_animate(obj, fadeIn, fadeOut) {
        l(obj);
        event.stopPropagation();
        var status = obj.css('display');

        if (status === 'none') {
            obj.css({display: "block", opacity: "1"}).animate({}, () => {
                obj.removeClass(fadeOut).addClass(fadeIn);
            });
        } else {
            obj.animate({}, () => {
                obj.addClass(fadeOut).removeClass(fadeIn).fadeOut(300, () => {
                    obj.css({display: "none"});
                });
            });
        }
    };


    //点击窗口关闭menu
    $(document).click(e => {
        e.stopPropagation();

        $('.pc_language_menu').animate({}, () => {
            $('.pc_language_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_language_menu').css({display: "none"});
            });
        });

        $('.pc_userinfo_menu').animate({}, () => {
            $('.pc_userinfo_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_userinfo_menu').css({display: "none"});
            });
        });

        $('.menu_box').animate({}, () => {
            $('.menu_box').addClass('fadeOut').removeClass('fadeIn').fadeOut(300, () => {
                $('.menu_box').css({display: "none"});
            });
        });
    });


    //change language
    $('.language_item').click(e => {
        let lang_val;
        e.target.dataset.val ? lang_val = e.target.dataset.val : lang_val = e.currentTarget.dataset.val;
        window.location.href = url.replace(language, lang_val);
    });


    /*===================================*
            OTHER SCRIPT
    *===================================*/

    //跳转至白皮书
    $('.white_paper').click(e => {
        window.open(white_paper_url);
    });


    //跳转至服务协议
    $('.server_btn').click(e => {
        window.open(server_url);
    });

    //跳转至隐私政策
    $('.policy_btn').click(e =>{
        window.open(policy_url);
    })




    //关闭弹窗
    $('.pop_win_close,.pop_win_bg').click(e => {
        event.stopPropagation();

        $('.pop_win').animate({}, () => {
            $('.pop_win').addClass('fadeOut').removeClass('fadeIn').fadeOut(300, () => {
                $('.pop_win').css({display: "none"});
            });
        });
    });


    //点击更多弹出窗口
    $('.more_btn').click(e => {
        let win = $('.pop_win');
        let text = e.target.dataset.text;
        win.find('p').text(text);

        list_animate(win, 'fadeIn', 'fadeOut');
    });


    //菜单的显示与隐藏
    let scrollheight = $(document).scrollTop();
    console.log(scrollheight);
    $('.menu_btn').click(e => {
        list_animate($('.menu_box'), 'fadeIn', 'fadeOut');

        $('.pc_language_menu').animate({}, () => {
            $('.pc_language_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_language_menu').css({display: "none"});
            });
        });

        $('.pc_userinfo_menu').animate({}, () => {
            $('.pc_userinfo_menu').addClass('fadeOutDown_').removeClass('fadeInUp_').fadeOut(300, () => {
                $('.pc_userinfo_menu').css({display: "none"});
            });
        });
    });


    // 手机端导航菜单点击时候的滚动条向下
    $('.menu_btn').click(function () {
        if(scrollheight == 0){
            $("body,html").animate({
                "scrollTop": scrollheight+10
            },10);
        }else{
            $(".nav").css("background","transparents");
        }
    })




    //自动设置body padding_bottom高度
    $('body').css({"padding-bottom": $('.footer')[0].clientHeight});

    $(window).resize(() => {
        $('body').css({"padding-bottom": $('.footer')[0].clientHeight});
    })


    // 判断是否为当前页面，如果是，对应导航下加白线
    var linkUrl = window.url;
    var num = linkUrl.lastIndexOf("/")+1;
    var res = linkUrl.substr(num);

    if($(".index").attr("href") === res){
        $(".index").addClass("borders");
    };

    if($(".vote").attr("href") === res){
        $(".vote").addClass("borders");
    };

    if($(".news").attr("href") === res){
        $(".news").addClass("borders");
    };

    if($(".wallet").attr("href") === res){
        $(".wallet").addClass("borders");
    };

});