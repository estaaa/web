/* 
* @Author: hailun
* @Date:   2016-10-25 13:13:36
* @Last Modified time: 2016-10-25 13:16:24
*/
/**
 * 检查登录
 */
function check_login()
{
    if (window.localStorage) {
        if(window.localStorage.getItem('agentNum') || window.localStorage.getItem('agentPass') || window.localStorage.getItem('agentPhone'))
        {
            window.location.href = config.login_url;
        }
        
    }
}