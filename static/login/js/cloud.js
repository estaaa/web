$(function(){
    $('.loginbox').css({'position':'absolute','left':($(window).width()-692)/2});
    $(window).resize(function(){  
    $('.loginbox').css({'position':'absolute','left':($(window).width()-692)/2});
    })  
    $("input").keydown(function () {
            if ($(this).attr("class") == 'empty'){
                $(this).val("").removeClass("empty").addClass("inputFocus");
            }
        }).blur(function () {
                if ($(this).val() == "") {
                    $(this).val($(this).attr("title")).removeClass("inputFocus").addClass("empty");
                }
            })
    })



    //隐藏错误提示
    var t = 0;

    function error_tips_hide(msg) {
        $("#err_m").html(msg);
        $("#error_tips").show();
        clearTimeout(t);
        t = setTimeout(function () {
            $("#error_tips").hide();
        }, 3000);
    }

    //文本框焦点处理
    $(function(){
        $("input[name='username']").focus(function(){
            if($(this).val() == "帐号"){
                $(this).val("");
            }
        })
        $("input[name='code']").focus(function(){
            if($(this).val() == "验证码"){
                $(this).val("");
            }
        })
    })
    //验证字段是否为空
    function formCheck() {
        if ($("#agentNum").val() == "") {
            error_tips_hide("您还没有输入座机号！");
            return false;
        }
        if ($("#agentPhone").val() == "") {
            error_tips_hide("您还没有输入分机号！");
            return false;
        }
    /*    if($("input[name='username']").val().length<6 || $("input[name='username']").val().length >20){
            error_tips_hide("账号长度为6-20位");
            return false;
        }*/
        if ($("#agentPass").val() == "") {
            error_tips_hide("您还没有输入密码！");
            return false;
        }
        /*if ($("input[name='code']").val() == "验证码") {
            error_tips_hide("您还没有输入验证码！");
            return false;
        }
        if ($("input[name='code']").val() == "") {
            error_tips_hide("您还没有输入验证码！");
            return false;
        }*/
        $("#error_tips").css("display", "none").hide();
        return true;
    }    
function fleshVerify(url){
	var time = new Date().getTime();
	$('#verifyImg').attr('src',url+"&time="+time);
}
// Cloud Float...
    var $main = $cloud = mainwidth = null;
    var offset1 = 450;
	var offset2 = 0;
	
	var offsetbg = 0;
    
    $(document).ready(
        function () {
            $main = $("#mainBody");
			$body = $("body");
            $cloud1 = $("#cloud1");
			$cloud2 = $("#cloud2");
			
            mainwidth = $main.outerWidth();
         
        }
    );

    /// 飘动
    setInterval(function flutter() {
        if (offset1 >= mainwidth) {
            offset1 =  -580;
        }

        if (offset2 >= mainwidth) {
			 offset2 =  -580;
        }
		
        offset1 += 1.1;
		offset2 += 1;
        $cloud1.css("background-position", offset1 + "px 100px")
		
		$cloud2.css("background-position", offset2 + "px 460px")
    }, 70);
	
	
	setInterval(function bg() {
        if (offsetbg >= mainwidth) {
            offsetbg =  -580;
        }

        offsetbg += 0.9;
        $body.css("background-position", -offsetbg + "px 0")
    }, 90 );
	