# sSwitch

---[git@github.com:zuitaibai/sSwitch.git](git@github.com:zuitaibai/sSwitch.git)

v1.1

pic: ![pic](https://github.com/zuitaibai/sSwitch/blob/master/pic.jpg)

event delegate on document，even for live Dom  
兼容pc、移动，不依赖外部库。在window下暴露sSwitch对象。没做commonjs、requirejs兼容。by zuitaibai 2018/4/2

based on: css2/es3.0  (except: border-radius、querySelector/forEach)
```
use:  <span class="sSwitch"></span>

      sSwitch.reg().repain();                     //reg只一次就好

      //sSwitch.repain(document.body).repain(document.getElById('warp'));

      //sSwitch.repain(document.body,true);       //父容器dom，是否创建同名input:hidden

      //sSwitch.repain(true);                     //是否创建同名input:hidden
```
---------------------------------------------
```
 1.onchange: <span class="sSwitch" data-change="函数名"></span>               //function 函数名(boolean){ console.log(boolean) }

 2.开关label文字：<span class="sSwitch" data-open="开" data-close="关"></span>

 3.创建同名input:hidden：<span class="sSwitch" name="inputName名"></span>     //input:value：1:checked   0:unchecked

       sSwitch.repain(true)

       //sSwitch.repain(父容器dom,true)

 4.初始选中： <span class="sSwitch checked"></span>

 5.初始禁用： <span class="sSwitch disabled"></span>

 6.动态切换选中状态：<span class="sSwitch" id="eg"></span>

       document.getElementById('eg').setChecked(true,true);                   //是否选中,是否触发其onchange

 7.动态切换禁用状态：<span class="sSwitch" id="eg"></span>

       document.getElementById('eg').setDisabled(true);

 8.解绑： sSwitch.reg(false)
 ```


### Changelog


- v 1.1
    - 解决手动setChecked时，同状态下还触发onchange的bug
    - 代码初步整理