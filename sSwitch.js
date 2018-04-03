/* [ sSwitch ]    ---git@github.com:zuitaibai/sSwitch.git
* v1.0
* event delegate on document，even for live Dom
* 兼容pc、移动，不依赖外部库。在window下暴露sSwitch对象。没做commonjs、requirejs兼容。by zjf 2018/4/2
* based on: css2/es3.0  (except: border-radius、querySelector/forEach)
* use:  <span class="sSwitch"></span>
*       sSwitch.reg().repain();                     //reg只一次就好
*       //sSwitch.repain(document.body).repain(document.getElById('warp'));
*       //sSwitch.repain(document.body,true);       //父容器dom，是否创建同名input:hidden
*       //sSwitch.repain(true);                     //是否创建同名input:hidden
* ---------------------------------------------
* 1.onchange: <span class="sSwitch" data-change="函数名"></span>              //function 函数名(boolean){ console.log(boolean) }
* 2.开关label文字：<span class="sSwitch" data-open="开" data-close="关"></span>
* 3.创建同名input:hidden：<span class="sSwitch" name="inputName名"></span>    //input:value：1:checked   0:unchecked
*       sSwitch.repain(true)
*       //sSwitch.repain(父容器dom,true)
* 4.初始选中： <span class="sSwitch checked"></span>
* 5.初始禁用： <span class="sSwitch disabled"></span>
* 6.动态切换选中状态：<span class="sSwitch" id="eg"></span>
*       document.getElementById('eg').setChecked(true,true);                   //是否选中,是否触发其onchange
* 7.动态切换禁用状态：<span class="sSwitch" id="eg"></span>
*       document.getElementById('eg').setDisabled(true);
* 8.解绑： sSwitch.reg(false)
* */
!(function () {
    var mvObj = {
            check: false,
            left: 0,
            warp: {$: null, width: 0},
            first: null,
            barWidth: 0,
            hideInput: null
        },
        tool = {
            isSupportTouch: "ontouchend" in document,
            getEvent: function (e) {return tool.isSupportTouch ? e.changedTouches[0] : e;},
            setChecked: function(dom,boolean,ifFireChange){
                var bar = dom.querySelector('.sSwitch-bar'),
                    switchL = dom.querySelector('.sSwitch-l'),
                    change = dom.getAttribute('data-change'),
                    hideInput = dom.querySelector('input[type=hidden]');
                if(boolean){
                    switchL.style.marginLeft = -parseInt(bar.clientWidth / 2, 10) - 1 + 'px';
                    dom.classList.add('checked');
                    ifFireChange && change && eval(change + '(true)');
                    if(hideInput) hideInput.value = 1;
                }else{
                    switchL.style.marginLeft = -dom.clientWidth + parseInt(bar.clientWidth / 2, 10) + 'px';
                    dom.classList.remove('checked');
                    ifFireChange && change && eval(change + '(false)');
                    if(hideInput) hideInput.value = 0;
                }
            }
        },
        bd_click = function (e) {
            var target = e.target;
            if (!target || target.nodeType !== 1 || target.classList.length === 0 || target.classList.contains('sSwitch-bar')) return;
            if (target.classList.contains('sSwitch-l') || target.classList.contains('sSwitch-r')) {
                var sw = target.parentNode.parentNode;
                if (sw.classList.contains('disabled')) return;
                tool.setChecked(sw,!target.classList.contains('sSwitch-l'),true);
            }
        },
        bd_msDown = function (e) {
            e.stopPropagation();
            var target = tool.getEvent(e).target;
            if (!target || target.nodeType !== 1 || target.classList.length === 0) return;
            if (target.classList.contains('sSwitch-bar')) {
                e.stopPropagation();
                var $switch = target.parentNode.parentNode.parentNode;
                if ($switch.classList.contains('disabled')) return;
                mvObj.warp.$ = $switch;
                mvObj.warp.width = $switch.clientWidth;
                mvObj.barWidth = target.clientWidth;
                mvObj.first = target.parentNode.parentNode.getElementsByClassName('sSwitch-l')[0];
                mvObj.hideInput = $switch.querySelector('input[type=hidden]');
                mvObj.left = parseInt(tool.getEvent(e).clientX, 10);
                mvObj.check = !!$switch.classList.contains('checked');
            }
        },
        bd_msUp = function (e) {
            e.stopPropagation();
            if (mvObj.warp.$) {
                var x = parseInt(tool.getEvent(e).clientX - mvObj.left, 10), halfbar = parseInt(mvObj.barWidth / 2, 10), isClose;
                if (x === 0 || (x < 0 && !mvObj.check) || (x > 0 && mvObj.check)) return mvObj.hideInput = mvObj.first = mvObj.warp.$ = null;
                if (x < 0) {
                    if (halfbar + x <= -(mvObj.warp.width - mvObj.barWidth) / 2) isClose = true;
                } else {
                    if (x - mvObj.warp.width + halfbar <= -(mvObj.warp.width - mvObj.barWidth) / 2) isClose = true;
                }
                mvObj.warp.$.classList.remove('moving');
                var change = mvObj.warp.$.getAttribute('data-change');
                if (isClose) {
                    mvObj.first.style.marginLeft = halfbar - mvObj.warp.width + 'px';
                    mvObj.warp.$.classList.remove('checked');
                    mvObj.check && change && eval(change + '(false)');
                    if(mvObj.hideInput) mvObj.hideInput.value = 0;
                } else {
                    mvObj.first.style.marginLeft = -halfbar - 1 + 'px';
                    mvObj.warp.$.classList.add('checked');
                    !mvObj.check && change && eval(change + '(true)');
                    if(mvObj.hideInput) mvObj.hideInput.value = 1;
                }
                return mvObj.warp.$ = mvObj.first = mvObj.hideInput = null;
            }
        },
        bd_msMove = function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (mvObj.warp.$) {
                mvObj.warp.$.classList.remove('checked');
                mvObj.warp.$.classList.add('moving');
                var x, halfbar = parseInt(mvObj.barWidth / 2, 10);
                if (mvObj.check) x = parseInt(tool.getEvent(e).clientX - mvObj.left, 10);
                else x = parseInt(tool.getEvent(e).clientX - mvObj.left - mvObj.warp.width, 10);
                if (x <= halfbar - mvObj.warp.width) {
                    x = halfbar - mvObj.warp.width;
                    mvObj.warp.$.classList.remove('moving');
                }
                if (x >= -halfbar - 1) {
                    x = -halfbar - 1;
                    mvObj.warp.$.classList.remove('moving');
                    mvObj.warp.$.classList.add('checked');
                }
                mvObj.first.style.marginLeft = x + 'px';
                return false;
            }
        },
        reg = function (_if) { // true或不传：绑定 ,  false：解绑
            var _if = _if === false ? _if : true, method;
            if (_if && sSwitch.ifRegYet) return sSwitch;
            if (_if) sSwitch.ifRegYet = true, method = 'addEventListener';
            else sSwitch.ifRegYet = false, method = 'removeEventListener';
            document[method]('click', bd_click, false);
            document[method](tool.isSupportTouch ? 'touchstart' : 'mousedown', bd_msDown, false);
            document[method](tool.isSupportTouch ? 'touchend' : 'mouseup', bd_msUp, false);
            document[method](tool.isSupportTouch ? 'touchmove' : 'mousemove', bd_msMove, false);
            return sSwitch;
        },
        repain = function (parentDom,ifHiddenInput){//参数可传：dom / dom,boolean / boolean / 不传
            var pD, ifHI;
            if(typeof parentDom==='boolean') ifHI = parentDom, pD = document;
            else if(typeof parentDom==='object') pD = parentDom, ifHI = ifHiddenInput;
            else pD = document, ifHI = false;
            pD.querySelectorAll('.sSwitch').forEach(function (v, i) {
                var name = v.getAttribute('name') || '',
                    t_open = v.getAttribute('data-open') || '',
                    t_close = v.getAttribute('data-close') || '',
                    str = '\
                        <span class="sSwitch-scroll">\n\
                            <span class="sSwitch-l">'+t_open+'</span>\n\
                            <span class="sSwitch-m"><span class="sSwitch-bar"></span></span>\n\
                            <span class="sSwitch-r">'+t_close+'</span>\n\
                        </span>',
                    value = ' value="'+(v.classList.contains('checked')?1:0)+'"';
                if(ifHI) str += '<input type="hidden" name="'+name+'" '+value+'>';
                v.innerHTML = str;
                var w = v.querySelector('.sSwitch-bar').clientWidth,
                    offset = v.classList.contains('checked') ? -parseInt(w / 2, 10)-1 : parseInt(w / 2, 10) - v.clientWidth;
                v.querySelector('.sSwitch-l').style.marginLeft = offset + 'px';
                v.setChecked = function(boolean,ifFireChange){ tool.setChecked(v,boolean,ifFireChange); };
                v.setDisabled = function(boolean){ v.classList[boolean?'add':'remove']('disabled'); };
            });
            return sSwitch;
        },
        sSwitch = {
            reg: reg,
            repain: repain,
            ifRegYet: false
        };
    window.sSwitch = window.sSwitch || sSwitch;
})(window,document);