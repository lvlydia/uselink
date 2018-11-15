$(() => {
    /*=============================
            USER INFO
     =============================*/
    //验证部分
    let form = {
        phone: undefined,
        password: undefined,
        passwordAgain: undefined,
        smscode: undefined,
        pictureId: undefined,
        signcode: undefined,
        withdrawAddress: undefined,
        shareRate: undefined,
        shareNum: undefined,
        delegateName: undefined,
        delegateId: undefined
    };


    //首次加载获取图形验证码 new
    let graphic_code_box = $('.pic-code');
    get_new_graphic_code(graphic_code_box, form);


    //点击获取验证码 new
    graphic_code_box.click(() => {
        get_new_graphic_code(graphic_code_box, form);
    });

    let tip = $('.tip');


    //提示信息 new
    function tip_(str, obj) {
        if (obj) {
            obj.empty().text(str);
        } else {
            tip.empty().text(str);
        }
    }


    //切换显示 new
    $('.tab').click(e => {
        let index = $(e.target).index();
        let card = $('.item');

        $('.tab').removeClass('active');
        $(e.target).addClass('active');

        //切换右侧卡片
        card.removeClass('active');
        card.eq(index).addClass('active');
    });


    //默认一屏高度 new
    $('#userInfo').css({'min-height': $(window).height() - $('.footer').height()});


    //分红函数
    function changeShareRate(type) {
        let shareNum = $('.shareNum'), val = shareNum.val();

        if (type === 1 && parseInt(val) + 10 < 100) {
            shareNum.val(parseInt(val) + 10);
            form.shareRate = (parseInt(val) + 10) / 100;
            form.shareNum = (parseInt(val) + 10) / 100;
            // l(form.shareRate);
        }

        if (type === -1 && parseInt(val) - 10 > 0) {
            shareNum.val(parseInt(val) - 10);
            form.shareRate = (parseInt(val) - 10) / 100;
            form.shareNum = (parseInt(val) - 10) / 100;
            // l(form.shareRate);
        }

    }


    //验证必填信息
    function check_form() {
        if (form.signcode && form.smscode) {

            //验证分红比例
            if (!(form.shareRate > 0 && form.shareRate < 1)) {
                tip_(lang('dividend_rate_error'));
                return false;
            } else {
                //存在节点名
                if (form.delegateName) {
                    if (test_delegate_name(form.delegateName)) {
                        tip_('');
                        return true;
                    } else {
                        //节点名格式错误
                        tip_(lang('node_error'));
                        return false;
                    }
                } else {
                    //节点名不存在
                    tip_(lang('node_name_cant_null'));
                    return false;
                }
            }
        } else {
            tip_(lang('info_incomplete'));
            return false;
        }
    }


    //获取个人资料表单输入信息 new
    $('.form1_input').bind('input propertychange', e => {
        let q = $(e.target);
        let val = q.val();
        let type = q.data('type');
        // l(val);
        switch (type) {
            case 'delegateName':
                form.delegateName = val;
                break;
            case 'withDrawAddress':
                form.withdrawAddress = val;
                break;
            case 'shareNum':
                if (val !== '') {
                    form.shareRate = parseInt(val) / 100;
                    form.shareNum = parseInt(val) / 100;
                } else {
                    form.shareRate = undefined;
                    form.shareNum = undefined;
                }
                break;
            case 'signCode':
                form.signcode = val;
                break;
            case 'msgCode':
                form.smscode = val;
                break;
        }
    });


    /*    --------------
          申请成为候选节点
          --------------    */

    {
        let win_ = $('.change_pwd_win');

        function win() {
            if (win_.css('display') === 'none') {
                win_.fadeIn(400);
                $('body').css({
                    overflow: 'hidden',
                    height: '100%',
                })
            } else {
                win_.fadeOut(400);
                $('.win_tip').empty();
                $('body').css({
                    overflow: 'auto',
                    height: 'auto',
                })
            }
        }

        //点击修改密码按钮显示修改密码弹窗
        $('.change_pwd,#change_pwd_win_close').click(e => {
            win();
        });


        //点击黑色背景时弹窗隐藏
        win_.children('.bg').click(e => {
            event.stopPropagation();
            win();
        });

        //点击下一步显示第二步 new
        $('.next_step').click(e => {
            //显示第二步内容
            $('.step1_box').removeClass('active');
            $('.step2_box').addClass('active');

            //‘第二步’切换为选中效果
            $('.change_step_box').children().removeClass('active').eq(1).addClass('active');
        });


        //点击第一步第二步切换
        $('.change_step_box').children().click(e => {
            let index = $(e.target).index();
            $('.saveAndSubmit_b').children().removeClass('active').eq(index).addClass('active');
            $('.change_step_box').children().removeClass('active').eq(index).addClass('active');
        });

        //有提币地址的情况下点击修改按钮
        $('.changeWithDrawAddress').click(e => {
            //隐藏地址显示框与按钮
            $('.hasWithDrawAddress').hide(0);

            //显示地址输入框
            $('.userInfoAddress').show(0).select().parent().parent().removeClass('noLine');
        });


        //点击切换分红值 new
        $('.changeShareNumBtn').click(e => {
            let q = $(e.target), type = q.data('type');
            changeShareRate(type);
        });


        //提交为候选节点
        $('#submitForSuperNode').click(e => {

            // l(check_form())
            //验证
            if (check_form()) {

                //验证提币地址
                // l(form)
                if (form.withdrawAddress) {

                    //form添加shareNum 不知道是什么
                    ajax_('/application', form, 1).then(data => {
                        //获取新的图形验证码
                        get_new_graphic_code(graphic_code_box, form);
                        pop(lang('submit_success'), 1);

                        //刷新当前页
                        reload(2000);

                    }).catch(data => {
                        if (data.retCode === 400) {
                            href('login');
                        } else {
                            tip_(data.retMsg);
                        }
                    });

                } else {
                    tip_(lang('withdrawAddress_empty'));
                }
            }
        });

    }


    /*    --------------
             申请拒绝后
          --------------    */

    {
        //申请拒绝后点击重新申请 new
        $('.submitAgain').click(e => {
            //隐藏未通过页面
            $('.notPass').hide(0);

            //显示提交页面
            $('.saveAndSubmit').show(0);
        });

    }


    /*    --------------
               审核中
          --------------    */

    {

    }


    /*    --------------
              审核通过
          --------------    */

    {
        $('#saveNewMsg').click(e => {
            // l(check_form())
            // 验证
            if (check_form()) {

                //验证提币地址
                // l(form);
                if (form.withdrawAddress) {

                    //form添加shareNum 不知道是什么
                    ajax_('/modify', form, 1).then(data => {
                        //获取新的图形验证码
                        get_new_graphic_code(graphic_code_box, form);
                        pop(lang('submit_success'), 1);

                        //刷新当前页
                        reload(2000);

                    }).catch(data => {
                        if (data.retCode === 400) {
                            href('login');
                        } else {
                            tip_(data.retMsg);
                        }
                    });

                } else {
                    tip_(lang('withdrawAddress_empty'));
                }
            }
        })
    }


    //获取用户信息
    ajax_('/getUser', {}, 1).then(data => {
        //用户认证状态
        let isAuth = data.userInfo.user.isAuth;
        if (isAuth === 1) {
            //隐藏未认证提示 new
            $('.unverified').hide(0);


            //修改为“已通过”图片 new
            $('#user_icon').attr('src', '../img/user_icon.png');
        }


        //是否提交过申请
        if (!data.applicationInfo) {
            //显示提交表单 new
            $('.saveAndSubmit').show(0);
        } else {
            let applicationInfo = data.applicationInfo, status = applicationInfo.status;

            switch (status) {
                //未通过
                case -1:
                    //显示拒绝原因 new
                    $('.notPass').show(0);

                    //如果有未通过原因
                    if (data.applicationInfo.remarks) {
                        let remarks = data.applicationInfo.remarks;
                        $("#notPassReason").empty().text(remarks);
                        break;
                    }

                    $("#notPassReason").empty().text(lang('none'));

                    break;
                //审核中
                case 1:
                    //显示审核中内容 new
                    $('.review').show(0);

                    break;
                //通过
                case 2:


                    //未退出已认证或退出成功已认证
                    // l(data.quitInfo);
                    // l(data.quitInfo && data.quitInfo.status !== -3);
                    // l(!data.quitInfo && 1 === isAuth);

                    if ((data.quitInfo && data.quitInfo.status !== -3) || (!data.quitInfo && 1 === isAuth)) {

                        //显示保存信息页面 new
                        $('.submitted').show(0);

                    }

                    //未认证并且退出成功
                    if (data.quitInfo && -1 === isAuth && data.quitInfo.status === -3) {

                        //显示提交表单 new
                        $('.saveAndSubmit').show(0);
                    }

                    $('.tab').last().css({
                        display: "flex",
                    });


                    break;

                default:
                    pop(lang('network_error'), false);

            }
        }


        //是否提交过退出申请
        if (data.quitInfo) {
            let status = data.quitInfo.status, text;
            let rebackCount = data.rebackCount;
            let creatTime = getTime(new Date(data.quitInfo.createTime));
            let rebackTrxId = data.quitInfo.rebackTrxId;

            switch (status) {
                case -1:
                    text = lang('verification');
                    break;
                case -2:
                    text = lang('verification');
                    break;
                case -3:
                    text = lang('verification_passed');
                    break;
            }

            //如果不是退出后再次提交
            if (status !== -4) {

                //设置退出状态
                $('#exit_status').empty().text(text);


                //隐藏退出申请列表
                $('#exit_form').hide(0);


                //显示退出申请信息
                $('#exit_info').show(0);


                //设置退出信息内容
                $('#rebackCount').empty().text(rebackCount + `UL`);
                $('#createTime').empty().text(creatTime);
                $('#rebackTrxId').empty().text(rebackTrxId);

            }
        }


        // 将用户信息解析为一层
        let list = {
            rebackCount: data.rebackCount,
            admin: data.userInfo.admin,
            token: data.userInfo.token,
        }, user = data.userInfo.user;


        Object.keys(user).forEach(key => {
            list[key] = user[key];
        });


        let phone = list.phone, withdrawAddress = list.withdrawAddress,
            shareRate = list.shareRate, id = list.id;


        //如果该用户无节点名
        if (!list.delegateName) {

            //显示‘普通用户’
            $('.user_NoDelegateName').show(0);

            //隐藏‘账户：节点名’
            $('.user_delegateName').hide(0);

            //显示超级节点名输入框
            $('.info_delegateName').next().show(0);

        }


        let delegateName = list.delegateName;


        //form赋值
        form.phone = phone;
        form.withdrawAddress = withdrawAddress;
        form.shareRate = shareRate;
        form.shareNum = shareRate;
        form.delegateName = delegateName;
        form.delegateId = id;


        // 手机号
        $('.info_phone').empty().text(phone);

        l(delegateName);

        //超级节点名
        $('.info_delegateName,#user_delegateName').empty().text(delegateName);


        //隐藏超级节点名输入框
        $('.info_delegateName').next().hide(0);


        //向分红input中填入已有数据
        let info_shareRate = $('.shareNum');
        info_shareRate.val(parseInt(shareRate * 100));


        //修改密码表单
        const changePwdForm = {
            delegateName: form.delegateName ? form.delegateName : undefined,
            password: undefined,
            passwordAgain: undefined,
            oldPassword: undefined,
            phone: form.phone,
            pictureId: undefined,
            signcode: undefined,
            smscode: undefined,
        };


        get_new_graphic_code($('#send_apply'), changePwdForm);
        l('changePwdForm');
        l(changePwdForm);
        l('changePwdForm');

        $('#send_apply').click(e => {
            // l('hey');
            get_new_graphic_code($('#send_apply'), changePwdForm);
        });


        //修改密码表单录入
        $('.form2_input').bind('input propertychange', e => {
            let q = $(e.target);
            let val = q.val();
            let type = q.data('type');
            // l(val);
            // l(type);
            switch (type) {
                case 'delegateName':
                    changePwdForm.delegateName = val;
                    break;
                case 'oldPwd':
                    changePwdForm.oldPassword = val;
                    break;
                case 'newPwd':
                    changePwdForm.password = val;
                    break;
                case 'newPwdAgain':
                    changePwdForm.passwordAgain = val;
                    break;
                case 'signCode':
                    changePwdForm.signcode = val;
                    break;
                case 'msgCode':
                    changePwdForm.smscode = val;
                    break;
            }

            // l(changePwdForm);

        });

        //点击修改密码弹窗内的确认按钮
        $('.change_pwd_affirm').click(e => {
            //验证信息是否完整
            let len = 8, num = 0;
            // l(changePwdForm);
            Object.keys(changePwdForm).forEach(el => {
                if (changePwdForm[el]) {
                    num++;
                }
            });

            if (num >= len) {
                //验证新密码格式是否正确
                if (test_password(changePwdForm.password)) {
                    //判断新旧密码是否一致
                    if (changePwdForm.password === changePwdForm.passwordAgain) {
                        //清空提示
                        tip_('', $('.win_tip'));

                        //深拷贝表单
                        let new_changePwdForm = JSON.parse(JSON.stringify(changePwdForm));
                        new_changePwdForm.oldPassword = md5(new_changePwdForm.oldPassword);
                        new_changePwdForm.password = md5(new_changePwdForm.password);
                        new_changePwdForm.passwordAgain = md5(new_changePwdForm.passwordAgain);

                        ajax_('/changePassword', new_changePwdForm, 1).then(data => {
                            //获取新的图形验证码
                            get_new_graphic_code(graphic_code_box, form);
                            pop(lang('submit_success'), 1);

                            //刷新当前页
                            reload(2000);

                        }).catch(data => {
                            if (data.retCode === 400) {
                                href('login');
                            } else {
                                tip_(data.retMsg, $('.win_tip'));
                            }
                        });

                    } else {
                        tip_(lang('password_not_same'), $('.win_tip'));
                    }
                } else {
                    tip_(lang('password_format_error'), $('.win_tip'));
                }
            } else {
                tip_(lang('info_incomplete'), $('.win_tip'));
            }
        });


        //该用户是否绑定钱包地址
        if (withdrawAddress) {
            $('.address').empty().text(withdrawAddress);

            //将地址放入输入地址框的val
            $('.userInfoAddress').val(withdrawAddress);

            //隐藏地址框的线
            let li = $('.userInfoAddress').parent().parent();
            li.addClass('noLine');
        } else {
            //显示地址输入框
            $('.userInfoAddress').show(0);

            //隐藏地址显示框与修改按钮
            $('.hasWithDrawAddress').hide(0);
        }


        //发送短信验证码
        let send_btn = $('.mes-code');

        send_btn.click(() => {
            if (!send_btn.hasClass('send_waite')) {
                tip.empty();
                let phone_arr = phone.split(' ');
                let num = phone_arr[0].split('+')[1];
                let phone_num = phone_arr[1];
                send_msg(tip_, send_btn, phone_num, num, 2);
            }
        });


        //隐藏登录按钮
        $('.login_btn').removeClass('show').addClass('hide');


        //展示个人信息按钮
        $('.user_info_btn').removeClass('hide').addClass('show');

        // 退出form
        let exitForm = {
            delegateName: form.delegateName,
            phone: form.phone,
            pictureId: undefined,
            withdrawAddress: form.withdrawAddress,
            password: undefined,
            signcode: undefined,
            smscode: undefined,
        };


        //退出节点获取图形验证码
        let exitSignCode = $('.exitSignCode');
        get_new_graphic_code(exitSignCode, exitForm);

        exitSignCode.click(e => {
            get_new_graphic_code(exitSignCode, exitForm);
        });


        //获取退出表单输入
        $('.form3_input').bind('input propertychange', e => {
            let q = $(e.target);
            let val = q.val();
            let type = q.data('type');
            // l(val);
            // l(type);
            switch (type) {
                case 'pwd':
                    exitForm.password = val;
                    break;
                case 'signCode':
                    exitForm.signcode = val;
                    break;
                case 'msgCode':
                    exitForm.smscode = val;
                    break;
            }

            // l(exitForm);

        });


        //退出申请
        $('#exitSuperNodeSubmit').click(e => {
            //验证
            let len = 7, num = 0;

            Object.keys(exitForm).forEach(el => {
                if (exitForm[el]) {
                    num++;
                }
            });
            // l(num);

            if (num >= len) {
                //清空提示
                tip_('', $('.exitTip'));

                //加密密码
                let new_exitForm = JSON.parse(JSON.stringify(exitForm));
                new_exitForm.password = md5(new_exitForm.password);

                ajax_('/submitWithdraw', new_exitForm, 1).then(data => {
                    //获取新的图形验证码
                    get_new_graphic_code(graphic_code_box, form);
                    pop(lang('submit_success'), 1);

                    //刷新当前页
                    reload(2000);

                }).catch(data => {
                    if (data.retCode === 400) {
                        href('login');
                    } else {
                        tip_(data.retMsg, $('.exitTip'));
                    }
                });
            } else {
                tip_(lang('info_incomplete'), $('.exitTip'));
            }
        });


        //获取提币记录 未发放数量
        ajax_('/unconfirmedNums', {
            phone: form.phone.split(' ')[1]
        }, 1).then(data => {
            if (data) {
                $('.extract_token_num').empty().text(data)
            } else {
                $('.extract_token_num').empty().text(lang('none'))
            }
            // l(data);
        }).catch(data => {
            if (data.retCode === 400) {
                href('login');
            } else {
                tip_(data.retMsg);
            }
        });


        // 渲染分页按钮
        function render(begin, page_num) {
            //获取分页按钮容器
            let page_btn_box = $('.other_page');
            //清空容器
            page_btn_box.empty();

            //渲染
            for (let q = begin; q <= page_num; q++) {
                page_btn_box.append(`<div class="change_page" data-num="${q}">${q}</div>`);
            }
        }

        function for_(pc, mobile, list) {
            pc.empty();
            mobile.empty();
            list.forEach(el => {
                let newT = getTime(new Date(el.createTime));

                pc.append(`
                       <li>
                           <div class="time">${newT}</div>
                           <div class="vote">${el.voteNum}</div>
                           <div class="reward">${el.reward}</div>
                           <div class="share">${el.income}</div>
                           <div class="whether">${el.isShare}</div>
                           
                           <div>
                               <a class="details" href="share_details.html?payId=${el.id}&voteNum=${el.voteNum}&income=${el.income}&reward=${el.reward}">${lang('detail')}</a>
                           </div>
                       </li>
                    `);

                mobile.append(`<li>
                                    <ul>
                                        <li>
                                            <span>${lang('time')}</span>
                                            <span>${newT}</span>
                                        </li>

                                        <li>
                                            <span>${lang('vote')}</span>
                                            <span>${el.voteNum}</span>
                                        </li>

                                        <li>
                                            <span>${lang('reward')}</span>
                                            <span>${el.reward}</span>
                                        </li>

                                        <li>
                                            <span>${lang('share_')}</span>
                                            <span>${el.income}</span>
                                        </li>

                                        <li>
                                            <span>${lang('isno')}</span>
                                            <span>${el.isShare}</span>
                                        </li>

                                        <li>
                                            <span>${lang('operation')}</span>
                                            <span>
                                                <a class="details" href="share_details.html?payId=${el.id}&voteNum=${el.voteNum}&income=${el.income}&reward=${el.reward}">${lang('detail')}</a>
                                            </span>
                                        </li>
                                    </ul>
                                </li>`)
            });
        }

        //提币记录
        let pc = $('.table_pc').children('.content');
        let mobile = $('.table_mobile').children('.content');
        const rows = 20;
        ajax_('/withdraw', {
            page: 1,
            rows: rows,
            delegateName: form.delegateName,
            phone: null
        }, 1).then(data => {
            if (data.total > 0) {
                //隐藏暂无数据
                $('.record_b').children('.empty').hide(0);
                let list = data.rows;

                //渲染列表
                for_(pc, mobile, list);

                //手机渲染

            } else {
                //隐藏列表
                $('.record_b').children('.table').hide(0);
            }
        }).catch(data => {
            if (data.retCode === 400) {
                href('login');
            } else {
                tip_(data.retMsg);
            }
        });


    }).catch(data => {
        pop(data.retMsg, false);
        setTimeout(href('login'), 5000);
    });
});