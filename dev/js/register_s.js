$(() => {

    /*=============================
        REGISTER
    =============================*/

    //简写控制台报错
    function err(str) {
        throw new Error(lang(str))
    }

    //验证部分
    let form = {
        phone_input: undefined,

        password_input: undefined,

        password_again_input: undefined,

        graphic_code_input: undefined,

        msg_code_input: undefined,

        address_input: undefined,

        delegate_name_input: undefined,

        phone_select_num: undefined,

        phone_select_id: undefined,
    };

    //获取提示框
    let tip = $('#tip');

    //提示信息
    function tip_(str) {
        tip.empty().text(str);
    }

    //获取图形验证码
    let graphic_code_box = $('.pic-code');
    get_new_graphic_code(graphic_code_box);

    //点击验证码获取新的验证码
    graphic_code_box.click(() => {
        get_new_graphic_code();
    });

    //获取国家信息
    getNationInfo(form);

    //获取默认区号
    form.phone_select_num = $('.select_default').data('num');
    form.phone_select_id = $('.select_default').data('id');

    //获取用户输入信息
    $('.login-input').bind('input propertychange', e => {
        let id = e.target.id, val = $('#' + id).val();

        form[id] = val;
    });

    //发送短信验证码
    let send_btn = $('#send_msg');

    send_btn.click(() => {
        if (!send_btn.hasClass('send_waite')) {
            tip.empty();

            if (form.phone_input && test_phone(form.phone_input)) {
                send_msg(tip_,send_btn,form.phone_input,form.phone_select_num,1);
            } else {
                tip_(lang('phone_format_error'));
            }
        }
    });

    //点击注册按钮
    $('#register_submit').click(() => {
        let num = 0;

        Object.keys(form).forEach(function (key) {
            form[key] ? num++ : num;
        });

        if (num >= 8 || (num === 8 && !form.address_input)) {

            //手机号验证
            if (!test_phone(form.phone_input)) {
                tip_(lang('phone_format_error'));
                return false;
            }

            //二次密码是否相等
            if (!(form.password_input === form.password_again_input)) {
                tip_(lang('password_not_same'));
                return false;
            }

            //密码格式验证
            if (!(test_password(form.password_again_input))) {
                tip_(lang('password_format_error'));
                return false;
            }

            //验证节点名
            // l(!(test_delegate_name(form.delegate_name_input)));
            if (!(test_delegate_name(form.delegate_name_input))) {
                tip_(lang('delegate_name_format_error'));
                return false;
            }

            l(form);

            ajax_('/register', {
                phone: form.phone_input, //手机号
                password: md5(form.password_input), //密码
                passwordAgain: md5(form.password_again_input), //再次确认
                smscode: form.msg_code_input, //短信
                shareRate: null, //分红
                withdrawAddress: form.address_input, //地址
                pictureId: pictureId,
                signcode: form.graphic_code_input,
                delegateName: form.delegate_name_input,
                nationNumber: form.phone_select_num,
                nationId: form.phone_select_id,
            }).then(data => {
                get_new_graphic_code();

                window.location.href = 'login.html';

                tip_(data.retMsg);
            }).catch((data) => {
                tip_(data.retMsg);
            });


            tip.empty();
        } else {
            tip_(lang('info_incomplete'));
        }
    })
});