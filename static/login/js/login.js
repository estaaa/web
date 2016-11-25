
$(document).ready(function (){
          //  check_login();
            var wincall = null;
            var sockeIsLogin = false;
            // 初始化连接
            $('#init').ready(function () {
                var wintel_server_ip = config.server_ip;
                var vccCode = config.vccCode;
                var wintelapi_url = config.wintelapi_url;
                wincall = new WinCall({
                    wintel_server_ip: wintel_server_ip,
                    //wintel_server_port: '6050',
                    wintelapi_url: wintelapi_url,
                    vcc_code: vccCode,
                    busy_reasons: {},
                    debug: false,
                    event_listener:listen
                    
                });
                wincall.init();
                sockeIsLogin = true;
                $('#buttons').removeClass('hidden');
                $('#btn_login').removeAttr('disabled');
                $(this).hide();
            });

            
            //登录
            $('#btn_login').click(function(){
                var agentNum = $('#agentNum').val();
                var agentPass = $.md5($('#agentPass').val());
                var agentPhone = $('#agentPhone').val();
                var info = wincall.fn_login(agentNum,agentPass,agentPhone,1,0);
              
                
            });

            function listen(response){
                console.log(response.msg)
                if(response.msg == config.login_status){
                    // 记录登录的信息
                    if (window.localStorage) {
                        window.localStorage.setItem('agentNum', $('#agentNum').val());
                        window.localStorage.setItem('agentPass', $.md5($('#agentPass').val()));
                        window.localStorage.setItem('agentPhone', $('#agentPhone').val());
                    }
                    window.location.href = config.login_url;
                }else{
                    var txt = '';
                    if(response.code == '001811'){
                        txt = '坐席号不能为空!'
                    }else if(response.code == '001813'){
                        txt = '分机号不能为空!'
                    }
                    if(txt != ''){
                         error_tips_hide(txt)
                    }else{
                         error_tips_hide(response.msg+"\r\n")
                    }
                                    
                 }
            }
});