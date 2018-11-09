$(() => {
    /*=============================
            LOGIN
     =============================*/
    //验证部分
    let form = {

        phone_select_num: undefined,

        phone_select_id: undefined,
    };


    //获取提示框
    let tip = $('#tip');


    //提示信息
    function tip_(str) {
        tip.empty().text(str);
    }


    //获取国家信息
    getNationInfo(form);


    //获取默认区号
    form.phone_select_num = $('.select_default').data('num');
    form.phone_select_id = $('.select_default').data('id');


    //点击登录按钮时
    $('.btn-login').click(e => {
        let phone = $('#user-number').val();
        let password = $('#user-password').val();

        if (phone && password) {

            if (test_phone(phone) && test_password(password)) {

                ajax_('/login', {
                    phone: phone,
                    password: md5(password),
                    nationNumber: form.phone_select_num,
                    nationId: form.phone_select_id,
                }).then((data) => {
                    // l(data);
                    let token = data.token;

                    window.localStorage.setItem("token", token);
                    setTimeout(window.location.href = 'userinfo.html', 500);
                    tip_(data.retMsg);

                }).catch((data) => {
                    tip_(data.retMsg);
                })
            } else {
                if (!test_phone(phone)) {
                    tip_(lang('phone_format_error'))
                } else if (!test_password(password)) {
                    tip_(lang('password_format_error'))
                }
            }
        } else {
            tip_(lang('incomplete'));
        }
    });
});



