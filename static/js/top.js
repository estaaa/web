/* 
* @Author: anchen
* @Date:   2016-10-25 15:37:34
* @Last Modified by:   anchen
* @Last Modified time: 2016-10-26 09:33:22
*/
$(document).ready(function (){
    // 初始化连接
    var agentNum = window.localStorage.getItem('agentNum');
    var agentPass = window.localStorage.getItem('agentPass');
    var agentPhone = window.localStorage.getItem('agentPhone');
    var sockeIsLogin = false;
    var busy_reasons = {};
    $('#init').ready(function () {
        wincall = new WinCall({
            wintel_server_ip: config.server_ip,
            //wintel_server_port: '6050',
            wintelapi_url: config.wintelapi_url,
            vcc_code: config.vccCode,
            busy_reasons: busy_reasons,
            debug: true,
            event_listener: eventListener
        });
        wincall.init();
        sockeIsLogin = true;
        $('#buttons').removeClass('hidden');
        $('#btn_login').removeAttr('disabled');
        $(this).hide();
        // 获取企业配置的置忙原因
        $.ajax({
            url: wincall.opts.wintelapi_url+'/v2/wintelapi/api/busyreason/list',
            data: {vcc_code: wincall.opts.vcc_code},
            dataType: 'jsonp',
            timeout: 5000,
            async: false,
            jsonp: 'jsonpcallback',
            success: function (response) {
               var resCode = response.code || '';
               if (resCode == 200) {
                   $.each(response.data, function (index, value) {
                       busy_reasons[value.id] = value.stat_reason;
                   });
               } else {
                   wincall.log(response);
               }
            }
        });

                 
    });


    
    /**
     * 登录
     */
    $('#btn_login').click(function(){
        
        wincall.fn_login(agentNum,agentPass,agentPhone,1,0);
        // 处理置忙原因
        if (!$.isEmptyObject(busy_reasons)){
            var $busyDiv = '';
            $.each(busy_reasons, function (index, value) {
                $busyDiv += '<div class="color-swatch"><button class="btn btn-primary btn-sm btn_busy_detail" id="'+index+'"  style="background: transparent url('+"./static/images/btn_busy_e.gif"+') repeat scroll center center; cursor: default;">'+value+'</button></div>';;
            });
            $('#busyDiv').html($busyDiv);
            $('#buttons').delegate('.btn_busy_detail','click', function () {
                wincall.fn_busy($(this).attr('id'));
        //                      $('.btn_busy_detail').attr('disabled', 'disabled');
            });
        } else {
            $('.btn_busy_detail').click(function (){
                wincall.fn_busy(1);
            });
        }
    });

                //注销
                $('#btn_logout').click(function (){
                    sockeIsLogin = false;
    //              $('.btn_busy_detail').attr('disabled', 'disabled');
                    wincall.fn_logout();
                });

                //示闲
                $('#btn_unbusy').click(function (){
                    wincall.fn_unbusy();
    //              $('.btn_busy_detail').removeAttr('disabled');
                });

                //保持
                $('#btn_hold').click(function (){
                    wincall.fn_hold();
                });

                //恢复
                $('#btn_restore').click(function (){
                    wincall.fn_restore();
                });

                //呼叫内线
                $('#btn_dialinner').click(function (){
                    var callerid = $('#callerid').val();
                    $.ajax({
                        url: wincall.opts.wintelapi_url+'/v2/wintelapi/api/agent/free',
                        data: {vcc_code: wincall.opts.vcc_code},
                        dataType: 'jsonp',
                        timeout: 5000,
                        async: false,
                        jsonp: 'jsonpcallback',
                        success: function (response) {
                            var resCode = response.code || '';

                            if (resCode == 200) {
                                var resData = response.data || {};
                                var $tr = '';
                                console.log(resData);
                                $.each(resData, function (index, value) {
                                if (value.ag_num != wincall.loginInfo.agentNum) {
                                   $tr += '<tr><td class="ag_id">'+value.ag_id+'</td><td>'+value.ag_num+'</td><td>'+value.ag_name+'</td><td>'+value.pho_num+'</td></tr>';

                                    
                                                            }
                                });
                                parent.add($tr,callerid);                   
                            } else {
                                wincall.log(response);
                            }
                        }
                    });
                    $('#free-agent-modal').modal({});
                });

                //呼叫外线
                $('#btn_dialouter').click(function (){
                    /*var callerid = '4000901936';
                    var groupid = parseInt($('#groupid').val());
                    alert(groupid);
                    var called = $('#called').val();
                    // var outchan = parseInt($('#outchan').val());
                    wincall.fn_dialouter(called,callerid,groupid);*/
                    var callerid = '4000901936';
                    var groupid = parseInt($('#groupid').val());
                    var called = $('#called').val();
                    var outchan = parseInt($('#outchan').val());
                    wincall.fn_dialouter(called,callerid,groupid,outchan);
                });

                //挂断
                $('#btn_hangup').click(function (){
                    wincall.fn_hangup();
                });
                //挂断
                $('#btn_answer').click(function (){
                    wincall.fn_answer();
                });

                //咨询内线
                $('#btn_consultinner').click(function (){
                    $.ajax({
                        url: wincall.opts.wintelapi_url+'/v2/wintelapi/api/agent/free',
                        data: {vcc_code: wincall.opts.vcc_code},
                        dataType: 'jsonp',
                        timeout: 5000,
                        async: false,
                        jsonp: 'jsonpcallback',
                        success: function (response) {
                            var resCode = response.code || '';
                            if (resCode == 200) {
                                var resData = response.data || {};
                                var $tbody = $('#tbody');
                                $.each(resData, function (index, value) {
                                    $tbody.empty();
                                    if (value.ag_num != wincall.loginInfo.agentNum) {
                                        var $tr = $('<tr><td>'+value.ag_id+'</td><td>'+value.ag_num+'</td><td>'+value.ag_name+'</td><td>'+value.pho_num+'</td></tr>');
                                        $tbody.append($tr);
                                        $tr.on('click', function () {
                                            wincall.fn_consultinner(value.ag_id);
                                            $('#free-agent-modal').modal('hide');
                                        });
                                    }
                                });
                            } else {
                                wincall.log(response);
                            }
                        }
                    });
                    $('#free-agent-modal').modal({});
                });

                //咨询外线
                $('#btn_consultouter').click(function (){
                    var called = $('#called').val();
                    wincall.fn_consultouter(called);
                });
                //咨询接回
                $('#btn_consultback').click(function (){
                    wincall.fn_consultback();
                });

                //三方
                $('#btn_threeway').click(function (){
                    wincall.fn_3way();
                });

                //三方接回
                $('#btn_threewayback').click(function (){
                    wincall.fn_3wayback();
                });

                //转接
                $('#btn_transfer').click(function (){
                    wincall.fn_transfer();
                });

                //监听
                $('#btn_chanspy').click(function (){
                    $.ajax({
                        url: wincall.opts.wintelapi_url+'/v2/wintelapi/api/agent/ontheline',
                        data: {vcc_code: wincall.opts.vcc_code},
                        dataType: 'jsonp',
                        timeout: 5000,
                        async: false,
                        jsonp: 'jsonpcallback',
                        success: function (response) {
                            var resCode = response.code || '';
                            if (resCode == 200) {
                                var resData = response.data || {};
                                var $tbody = $('#online-agent-tbody');
                                $tbody.empty();
                                $.each(resData, function (index, value) {
                                    var $tr = $('<tr><td>'+value.ag_id+'</td><td>'+value.pho_num+'</td><td>'+value.ag_time+'</td></tr>');
                                    $tbody.append($tr);
                                    $tr.on('click', function () {
                                        wincall.fn_chanspy(value.ag_id);
                                        $('#online-agent-modal').modal('hide');
                                    });
                                });
                            } else {
                                wincall.log(response);
                            }
                        }
                    });
                    $('#online-agent-modal').modal({});
                });

                //强插
                $('#btn_breakin').click(function (){
                    wincall.fn_breakin();
                });

                //拦截
                $('#btn_intercept').click(function (){
                    wincall.fn_intercept();
                });

                //转满意度
                $('#btn_evaluate').click(function (){
                    wincall.fn_evaluate();
                });

                //自动外呼进入
                $('#btn_enable_autocall').click(function (){
                    var proid = parseInt($('#proid').val());
                    wincall.fn_autocallin(proid);
                });
                //自动外呼退出
                $('#btn_disable_autocall').click(function (){
                    wincall.fn_autocallout();
                });

                //发送dtmf码
                $('#callnum').on('keyup', function(){
                    var num = $('#callnum').val();
                    var dtmf = num.charAt(num.length - 1);
                    wincall.fn_dtmf(dtmf);
                });
                //转IVR
                $('#btn_transivr').click(function(){
                    wincall.fn_transivr();
                });
                //转技能组
                $('#btn_transque').click(function(){
                    $.ajax({
                        url: wincall.opts.wintelapi_url+'/v2/wintelapi/api/jsonp/queue/list',
                        data: {vcc_code: wincall.opts.vcc_code},
                        dataType: 'jsonp',
                        timeout: 5000,
                        async: false,
                        jsonp: 'jsonpcallback',
                        success: function (response) {
                            var resCode = response.code || '';
                            if (resCode == 200) {
                                var resData = response.data || {};
                                var $tbody = $('#queue-tbody');
                                $tbody.empty();
                                $.each(resData, function (index, value) {
                                    var $tr = $('<tr><td>'+value.id+'</td><td>'+value.que_name+'</td></tr>');
                                    $tbody.append($tr);
                                    $tr.on('click', function () {
                                        wincall.fn_transque(value.id);
                                        $('#queue-modal').modal('hide');
                                    });
                                });
                            } else {
                                wincall.log(response);
                            }
                        }
                    });
                    $('#queue-modal').modal({});
                });
                //盲转
                $('#btn_blindtrans').click(function(){
                    var called = $('#called').val();
                    var callerid = $('#callerid').val();
                    wincall.fn_bindtrans(called, callerid);
                });



})

function eventListener(response) {
            var $message = $('#message');
            if (response.agStatus) {
                $('#seat_state').html(response.agStatus);
            }
            if (response.queStatus) {
                $('#queue_state').html(response.queStatus);
            }
            $('#obj_content').html(response.msg);
            $message.append(response.msg+"\r\n");

            $.each(response.disableActions, function (index, value) {
                
                $('#btn_'+value).attr('disabled', 'disabled').css({'background':'transparent url('+"./static/images/btn_"+value+'_d.gif)  repeat scroll center center'});

                if(value == 'busy'){
                    $('.btn_busy_detail').attr('disabled', 'disabled').css({'background':'transparent url('+"./static/images/btn_busy_d.gif"+')  repeat scroll center center'});
                    }
            });

            $.each(response.enableActions, function (index, value) {
                $('#btn_'+value).removeAttr('disabled').css({'background':'transparent url('+"./static/images/btn_"+value+'_e.gif)  repeat scroll center center'});
                if(value == 'busy'){
                    $('.btn_busy_detail').removeAttr('disabled').css({'background':'transparent url('+"./static/images/btn_busy_e.gif"+')  repeat scroll center center'});
                }
            });

            switch (response.type) {
                case 'login_action':
                    //设置技能组
                    var ag_ques = wincall.fn_get_que();
                    var $groupid = $('#groupid');
                    $groupid.empty();
                    $.each(ag_ques, function (index,item) {
                        $groupid.append($('<option value="'+item+'">'+item+'</option>'))
                    });
                    // 设置主叫号码
                    var ag_callers = wincall.fn_get_caller();
                    var $callerid = $('#callerid');
                    $callerid.empty();
                    $.each(ag_callers, function (index,item) {
                        $callerid.append($('<option value="'+item+'">'+item+'</option>'))
                    });
                    break;
                case 'ring_queue_event'://技能组分配来电
                    var $caller = wincall.fn_getParam('Caller');
                    

                    var $caller_areacode = wincall.fn_getParam('CallerAreaCode');
                    var $caller_areaname = wincall.fn_getParam('CallerAreaName');
                    $message.append($caller+'['+$caller_areacode+'-'+$caller_areaname+ ']'+'来电\r\n');
                     var $callid=wincall.fn_getParam('CallId');//++
                    // alert($callid);
                    /**
                     * 直接调用应答函数
                     * 需要注意的是来电时有两个需要应答，一个是wincall中需要应答，
                     * 还有一个是软电话或者PSTN电话也需要应答，那么这样就可能导致操作的不方便，
                     * 因为wincall中的JS SDK是无法控制软电话和PSTN电话的，所以来电后必须手动点击接听按钮，
                     * 如此情况下，我们就在来电事件中自动调用wincall中的应答函数，这样就只需要手动点击
                     * 软电话或PSTN电话接听按钮就可以了，不需要两个都去点击接听
                     */
                    wincall.fn_answer();
                    /**
                     * 自定义来电的操作，可以实现弹屏的功能，例如弹出一个页面，将主叫的信息传递到页面中
                     * 实现自定义的查询功能，如根据主叫来电查询对应的客户信息等
                     */
                    // 实现代码...      
                                    
//                  alert($caller);
                                        window.parent.document.cookie="caller="+$caller+"_"+$caller_areacode+"_"+$caller_areaname;
                                        
                                        window.parent.document.getElementById("main-frame").src="{pigcms{$config.site_url}/index.php?g=index&c=wincall&a=add_user_base_info&caller=" + $caller+"&agent_num="+$('#agentNum').html();//刷新子页面
                                         window.parent.document.getElementById("main-frame").src="{pigcms{$config.site_url}/index.php?g=index&c=wincall&a=add_user_base_info&caller=" + $caller+"&callid=" + $callid+"&agent_num="+$('#agentNum').html();//刷新子页面
//                                    /*
//                  ;!function(){
//                      layer.ready(function(){ 
//                          //官网欢迎页
//                          layer.open({
//                              type: 2,
//                              //skin: 'layui-layer-lan',
//                              title: '来电信息',
//                              fix: false,
//                              shadeClose: true,
//                              maxmin: true,
//                              area: ['1200px', '700px'],
//                              content: 'http://www.2580001_new.com/index.php?g=index&c=wincall&a=reg&phone='+$caller+'&caller_areacode='+$caller_areacode+'&caller_areaname='+$caller_areaname,
                                
//                          });
//                         //alert('http://www.258000.com/index.php?g=index&c=wincall&a=reg&phone='+$caller+'&caller_areacode='+$caller_areacode+'&caller_areaname='+$caller_areaname);
//                         // layer.msg($caller+'['+$caller_areacode+'-'+$caller_areaname+ ']'+'来电\r\n',{time:6000});
                            
//                          //使用相册
//                          layer.photos({
//                              photos: '#photosDemo'
//                          });
//                      });

//                      }();*/

                    break;
                case 'ring_outbound_event'://外呼来电中
                    var called = wincall.fn_getParam('Called');
                    var CallerAreaCode = wincall.fn_getParam('CallerAreaCode');
                    var CallerAreaName = wincall.fn_getParam('CallerAreaName');
                    $message.append('呼叫外线号码'+called+'['+CallerAreaCode+'-'+CallerAreaName+']\r\n');
                    break;
                case 'call_afterwards_event'://事后处理
                    var $call_afterwards_secs = wincall.fn_getParam('CallAfterwardsSecs');
                    $message.append('事后处理时长为['+$call_afterwards_secs+']\r\n');
                    break;
                case 'system_busy_event'://系统置忙
                    var $busy_reason = wincall.fn_getParam('BusyReason');
                    $message.append('具体置忙原因为['+$busy_reason+']\r\n');
                    break;
            }
        }