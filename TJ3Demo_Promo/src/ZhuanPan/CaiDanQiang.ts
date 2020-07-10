import CaiDanData from "./CaidanData";
import SkinItem from "./SkinItem";
import { lwg } from "../script/Lwg_Template/lwg";
import ADManager from "../TJ/Admanager";

export default class CaiDanQiang extends Laya.Script {

    //#region  数据处理
    /***********方式一  Xml加载 数据组较大 不方便放在程序组 异步加载 慢 *********/


    LoadXml() {
        let self = this;
        let loadXml = function () {
            //解析xml代码
            self.LoadXml2()
        }
        Laya.loader.load("CaiDanQIang/CaiDanConfig.xml", Laya.Handler.create(this, function () {
            //加载完毕
            loadXml();
        }));
    }

    LoadXml2() {
        let xmlDom = Laya.Loader.getRes("CaiDanQIang/CaiDanConfig.xml");
        console.log(xmlDom);
        let attr = xmlDom.childNodes[0].childNodes;
        for (var i = 0; i < attr.length; i++) {
            let temp = new CaiDanData();
            for (var j = 0; j < attr[i].attributes.length; j++) {
                if (attr[i].attributes[j].nodeName == "ID") {
                    temp.ID = parseInt(attr[i].attributes[j].nodeValue);
                }
                else if (attr[i].attributes[j].nodeName == "Name") {
                    temp.Name = attr[i].attributes[j].nodeValue;
                }
                else if (attr[i].attributes[j].nodeName == "MesLiayuan") {
                    temp.MesLiayuan = attr[i].attributes[j].nodeValue;
                }
                else if (attr[i].attributes[j].nodeName == "MesFangshi") {
                    temp.MesFangshi = attr[i].attributes[j].nodeValue;
                }
                else if (attr[i].attributes[j].nodeName == "Info") {
                    temp.Info = attr[i].attributes[j].nodeValue;
                }
            }
            console.log(temp);
            this.CaiDanDatas1.push(temp);
        }
    }

    /**************方式二  Jison加载代码字段 数据较少 直接卸载代码里 同步加载 快 ***************/
    icon = [
        { ID: 0, Name: "黄皮耗子", Info: "", MesLiayuan: "转盘", MesFangshi: "直接把它从转盘拖出来", Tip: lwg.Enum.CaidanPifuName.huangpihaozi },

        { ID: 1, Name: "自闭鸭子", Info: "", MesLiayuan: "转盘", MesFangshi: "转盘抽奖获得", Tip: lwg.Enum.CaidanPifuName.zibiyazi },

        { ID: 2, Name: "仓鼠公主", Info: "", MesLiayuan: "从彩蛋墙上的神蛋获得", MesFangshi: "点击左边的神蛋", Tip: lwg.Enum.CaidanPifuName.cangshugongzhu },

        { ID: 3, Name: "柯基公主", Info: "", MesLiayuan: "召唤神龙许愿概率获得", MesFangshi: "同时点击彩弹墙的两个彩蛋", Tip: lwg.Enum.CaidanPifuName.kejigongzhu },

        { ID: 4, Name: "塞牙人", Info: "（也可能不是）", MesLiayuan: "彩蛋墙内神秘操作获得", MesFangshi: "长按这个皮肤的剪影3秒", Tip: lwg.Enum.CaidanPifuName.saiyaren },

        { ID: 5, Name: "海绵公主", Info: "", MesLiayuan: "主界面神秘操作获得", MesFangshi: "同时点击皮肤和彩蛋墙按钮", Tip: lwg.Enum.CaidanPifuName.haimiangongzhu },
    ]
    Caidan = []
    LoadJson() {
        for (let i = 0; i < this.icon.length; i++) {
            let temp = new CaiDanData();
            temp.ID = this.icon[i].ID;
            temp.Name = this.icon[i].Name;
            temp.Info = this.icon[i].Info;
            temp.MesLiayuan = this.icon[i].MesLiayuan;
            temp.MesFangshi = this.icon[i].MesFangshi;
            temp.Tip = this.icon[i].Tip;
            this.CaiDanDatas2.push(temp);
        }
    }

    //#endregion


    CaiDanDatas1: CaiDanData[] = [];
    CaiDanDatas2: CaiDanData[] = [];

    //#region  彩蛋墙界面\
    Caidanqiang: Laya.Box;
    List0: Laya.Box;
    List1: Laya.Box;
    MesShow: Laya.Image;
    Icon: Laya.Image;
    IconUp: Laya.Image;//裁影
    IconDown: Laya.Image;//实图
    MesLaiyuan: Laya.Label;
    MesFangshi: Laya.Label;
    Name: Laya.Label;
    Info: Laya.Label;
    LaiyuanADSafe: Laya.Image;
    FangshiADSafe: Laya.Image;

    CaiDanShow: Laya.Box;

    Skin: Laya.Box[] = [];
    Skinitems: SkinItem[] = [];

    NowCaidanDataq: CaiDanData;

    //0_0_0   是否解锁_来源是否解锁_方式是否解锁
    StorageInit() {
        let firstuse = Laya.LocalStorage.getItem("firstuse");//第一次初始化
        if (firstuse) {
            if (firstuse == "0")//非彩蛋版本 第一次添加
            {
                this.CaiDanDatas2.forEach((v) => {
                    Laya.LocalStorage.setItem("Caidanskin" + v.ID, "0_0_0");
                })
                Laya.LocalStorage.setItem("firstuse", "1");
            }
            else {
                //检测和之前的版本彩蛋数据差异
                this.CaiDanDatas2.forEach((v) => {
                    if (Laya.LocalStorage.getItem("Caidanskin" + v.ID))//判断是否有这个数据
                    {
                        //有这组数据保持不变
                    }
                    else {
                        Laya.LocalStorage.setItem("Caidanskin" + v.ID, "0_0_0");//没有这个数据添加这一组
                    }
                })
            }
        }
        else {
            this.CaiDanDatas2.forEach((v) => {
                Laya.LocalStorage.setItem("Caidanskin" + v.ID, "0_0_0");
            })
            Laya.LocalStorage.setItem("firstuse", "1");
        }

        if (lwg.Global._huangpihaozi) {
            let skin = Laya.LocalStorage.getItem("Caidanskin" + 5);
            if (skin) {
                let strs = skin.split("_");
                Laya.LocalStorage.setItem("Caidanskin" + 0, "1" + "_" + strs[1] + "_" + strs[2]);
            } else {
                Laya.LocalStorage.setItem("Caidanskin" + 0, "1" + "_" + 0 + "_" + 0);
            }
        }

        if (lwg.Global._zibiyazi) {
            let skin = Laya.LocalStorage.getItem("Caidanskin" + 5);
            if (skin) {
                let strs = skin.split("_");
                Laya.LocalStorage.setItem("Caidanskin" + 1, "1" + "_" + strs[1] + "_" + strs[2]);
            } else {
                Laya.LocalStorage.setItem("Caidanskin" + 1, "1" + "_" + 0 + "_" + 0);
            }
        }

        if (lwg.Global._haimiangongzhu) {
            let skin = Laya.LocalStorage.getItem("Caidanskin" + 5);
            if (skin) {
                let strs = skin.split("_");
                Laya.LocalStorage.setItem("Caidanskin" + 5, "1" + "_" + strs[1] + "_" + strs[2]);
            } else {
                Laya.LocalStorage.setItem("Caidanskin" + 5, "1" + "_" + 0 + "_" + 0);
            }
        }
    }

    onAwake()//加载需放在 start之前初始化
    {
        // this.LoadXml();//大表推荐
        this.LoadJson();//小表推荐 

        this.Caidanqiang = this.owner as Laya.Box;

        this.CaiDanShow = this.Caidanqiang.getChildByName("CaiDanShow") as Laya.Box;
        this.List0 = this.CaiDanShow.getChildByName("List0") as Laya.Box;
        this.List1 = this.CaiDanShow.getChildByName("List1") as Laya.Box;
        this.MesShow = this.Caidanqiang.getChildByName("MesShow") as Laya.Image;
        this.Icon = this.MesShow.getChildByName("Icon") as Laya.Image;
        this.IconDown = this.Icon.getChildByName("IconDown") as Laya.Image;
        this.IconUp = this.Icon.getChildByName("IconUp") as Laya.Image;
        this.MesLaiyuan = this.MesShow.getChildByName("MesLaiyuan") as Laya.Label;
        this.MesFangshi = this.MesShow.getChildByName("MesFangshi") as Laya.Label;
        this.Name = this.MesShow.getChildByName("Name") as Laya.Label;
        this.Info = this.MesShow.getChildByName("Info") as Laya.Label;
        this.LaiyuanADSafe = this.MesShow.getChildByName("LaiyuanADSafe") as Laya.Image;
        this.FangshiADSafe = this.MesShow.getChildByName("FangshiADSafe") as Laya.Image;

        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.LaiyuanADSafe, this, null, null, this.LaiyuanADcLICK, null);
        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.FangshiADSafe, this, null, null, this.FangshiADClick, null);
        lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.owner.scene['BtnBack'], this, null, null, this.btnBackUP, null);

        this.CaidanRewardPanelinit1();
        this.CaiDanInit();
    }

    btnBackUP(): void {
        this.owner.scene.close();
    }

    onStart() {
        this.StorageInit();
        for (let i = 0; i < this.CaiDanShow.numChildren; i++) {
            let listitem = this.CaiDanShow.getChildAt(i) as Laya.Box;
            let itembox = listitem.getChildByName("ItermBox") as Laya.Box;
            for (let j = 0; j < itembox.numChildren; j++) {
                this.Skin.push(itembox.getChildAt(j) as Laya.Box);
                let a = itembox.getChildAt(j).getComponent(SkinItem) as SkinItem;
                this.Skinitems.push(a);
            }
        }
        this.Skinitems.forEach((v, i) => {
            v.Fell(this.CaiDanDatas2[i], this.Caidanqiang);
        })
        if (lwg.Global._pickPaintedNum) {
            this.CaiDanDatas2.forEach((v, i) => {

                if (v.ID === lwg.Global._pickPaintedNum) {
                    this.NowCaidanDataq = v;
                }


                else {


                }
            });
        }
        else {
            this.NowCaidanDataq = this.CaiDanDatas2[0];
        }


    }

    //刷新界面 每次处理过之后要刷新菜单展示
    RefreshView(skindata: CaiDanData) {

        this.NowCaidanDataq = skindata;
        lwg.Global._pickPaintedNum = this.NowCaidanDataq.ID;
        this.IconDown.skin = skindata.GetIconPath();
        this.IconUp.skin = skindata.GetIconPath();
        this.MesFangshi.text = skindata.MesFangshi;
        this.MesLaiyuan.text = skindata.MesLiayuan;
        this.Name.text = skindata.Name;
        this.Info.text = skindata.Info;
        let itemstorage = Laya.LocalStorage.getItem("Caidanskin" + skindata.ID);
        let strs = itemstorage.split("_");
        this.IconUp.visible = strs[0] == "0";
        this.LaiyuanADSafe.visible = strs[1] == "0";
        this.FangshiADSafe.visible = strs[2] == "0";

        this.Skinitems.forEach((v, i) => {
            v.lightChange(skindata.ID);
        })
    }

    FangshiADClick()//方式解锁
    {
        ADManager.ShowReward(() => {
            let skin = Laya.LocalStorage.getItem("Caidanskin" + this.NowCaidanDataq.ID);
            let strs = skin.split("_");
            Laya.LocalStorage.setItem("Caidanskin" + this.NowCaidanDataq.ID, strs[0] + "_" + strs[1] + "_" + "1");
            this.RefreshView(this.NowCaidanDataq);
        })

    }
    LaiyuanADcLICK()//来源解锁
    {
        ADManager.ShowReward(() => {
            let skin = Laya.LocalStorage.getItem("Caidanskin" + this.NowCaidanDataq.ID);
            let strs = skin.split("_");
            Laya.LocalStorage.setItem("Caidanskin" + this.NowCaidanDataq.ID, strs[0] + "_" + "1" + "_" + strs[2]);
            this.RefreshView(this.NowCaidanDataq);
        })

    }
    //#endregion


    //#region  获取界面
    CaidanRewardPanel1: Laya.Box;
    RewardBg1: Laya.Image;
    ADGetReward1: Laya.Image;
    CloseRewardBtn1: Laya.Image;
    CaidanRewardPanelinit1() {
        this.CaidanRewardPanel1 = this.Caidanqiang.getChildByName("CaidanRewardPanel") as Laya.Box;
        console.log(this.CaidanRewardPanel1);
        this.RewardBg1 = this.CaidanRewardPanel1.getChildByName("RewardBG") as Laya.Image;
        console.log(this.RewardBg1);
        this.ADGetReward1 = this.RewardBg1.getChildByName("ADGetReward") as Laya.Image;
        this.CloseRewardBtn1 = this.RewardBg1.getChildByName("CloseRewardBtn") as Laya.Image;
        console.log(this.ADGetReward1);
        console.log(this.CloseRewardBtn1);

        this.CaidanJiemianHide1();
        this.ADGetReward1.on(Laya.Event.CLICK, this, this.ADGetRewardClick1)
        this.CloseRewardBtn1.on(Laya.Event.CLICK, this, this.CaidanJiemianHide1)
    }

    CaidanJiemianShow1() {
        this.CaidanRewardPanel1.visible = true;
    }
    CaidanJiemianHide1() {
        this.CaidanRewardPanel1.visible = false;
    }
    ADGetRewardClick1() {
        //看广告   彩蛋皮肤 编码4  
        ADManager.ShowReward(() => {
            console.log('看广告');
            let skin = Laya.LocalStorage.getItem("Caidanskin" + 4);
            let strs = skin.split("_");
            Laya.LocalStorage.setItem("Caidanskin" + 4, "1" + "_" + strs[1] + "_" + strs[2]);
            this.CaidanJiemianHide1();
            this.Skinitems.forEach((v, i) => {
                v.Fell(this.CaiDanDatas2[i], this.Caidanqiang);
            })
            lwg.Global._createHint_01(lwg.Enum.HintType.saiyaren);
        })
    }

    //#endregion

    //#region  彩蛋1触发   点击一个蛋  弹出界面

    Caidan1: Laya.Box;
    Caidan2: Laya.Box;
    CaidanRewardPanel2: Laya.Box;
    CaiDanInit() {
        this.Caidan1 = this.Caidanqiang.getChildByName("Caidan1") as Laya.Box;
        this.Caidan2 = this.Caidanqiang.getChildByName("Caidan2") as Laya.Box;

        this.Caidan1Init();
        this.Caidan2Init();
    }

    /***********触发1***************/
    Caidan1Init() {
        this.Caidan1.on(Laya.Event.CLICK, this, this.CaidanJiemianShow2);
        this.CaidanRewardPanelinit2();
    }
    /*************彩蛋1获取************* */
    RewardBg2: Laya.Image;
    ADGetReward2: Laya.Image;
    CloseRewardBtn2: Laya.Image;
    CaidanRewardPanelinit2() {
        this.CaidanRewardPanel2 = this.Caidanqiang.getChildByName("CaidanRewardPanel2") as Laya.Box;
        this.RewardBg2 = this.CaidanRewardPanel2.getChildByName("RewardBG") as Laya.Image;
        this.ADGetReward2 = this.RewardBg2.getChildByName("ADGetReward") as Laya.Image;
        this.CloseRewardBtn2 = this.RewardBg2.getChildByName("CloseRewardBtn") as Laya.Image;
        this.CaidanJiemianHide2();
        this.ADGetReward2.on(Laya.Event.CLICK, this, this.ADGetRewardClick2)
        this.CloseRewardBtn2.on(Laya.Event.CLICK, this, this.CaidanJiemianHide2)
    }

    CaidanJiemianShow2() {
        lwg.Animation.leftRight_Shake(this.Caidan1, 20, 100, 0, f => {
            lwg.Animation.leftRight_Shake(this.Caidan1, 20, 100, 0, f => {
                let skin = Laya.LocalStorage.getItem("Caidanskin" + 2);
                let strs = skin.split("_");
                if (strs[0] == "1") {

                }
                else {
                    this.CaidanRewardPanel2.visible = true;
                }
            });
        });
    }
    CaidanJiemianHide2() {
        this.CaidanRewardPanel2.visible = false;
    }
    ADGetRewardClick2() {
        //看广告   彩蛋皮肤 编码2
        ADManager.ShowReward(() => {
            let skin = Laya.LocalStorage.getItem("Caidanskin" + 2);
            let strs = skin.split("_");
            Laya.LocalStorage.setItem("Caidanskin" + 2, "1" + "_" + strs[1] + "_" + strs[2]);
            this.CaidanJiemianHide2();
            this.Skinitems.forEach((v, i) => {
                v.Fell(this.CaiDanDatas2[i], this.Caidanqiang);
            })

            lwg.Global._createHint_01(lwg.Enum.HintType.cangshugongzhu);

        })
    }



    /*********** 彩蛋2触发****************/
    ImageX: number = 0;
    ImageY: number = 0;
    caidanDan: Laya.Image;


    xmin = 160;
    xmax = 255;
    ymin = 103;
    ymax = 210;
    Caidan2Init() {
        this.xmax = this.Caidan1.x + 100;
        this.xmin = this.Caidan1.x - 100;
        this.ymax = this.Caidan1.y + 100;
        this.ymin = this.Caidan1.y - 100;

        this.caidanDan = this.Caidan2.getChildAt(0) as Laya.Image;
        console.log(this.caidanDan);
        this.caidanDan.on(Laya.Event.MOUSE_DOWN, this, this.CaiDanDown);
        this.caidanDan.on(Laya.Event.MOUSE_UP, this, this.CaiDanUp);
        this.caidanDan.on(Laya.Event.MOUSE_OUT, this, this.CaidanMoveOut);
        this.ImageX = this.caidanDan.x;
        this.ImageY = this.caidanDan.y;
        this.CaidanRewardPanelinit3();
    }
    CaiDanDown() {
        console.log("彩蛋点击事件");
        this.Caidanqiang.addChild(this.caidanDan);
        this.caidanDan.x = this.Caidanqiang.mouseX;
        this.caidanDan.y = this.Caidanqiang.mouseY;
        this.caidanDan.on(Laya.Event.MOUSE_MOVE, this, this.CaiDanMove);

    }
    CaiDanMove() {
        this.caidanDan.x = this.Caidanqiang.mouseX;
        this.caidanDan.y = this.Caidanqiang.mouseY;
        console.log(this.caidanDan.x, this.caidanDan.y);
        console.log(this.Caidanqiang.mouseX, this.Caidanqiang.mouseY);
    }
    CanGet: boolean = false;
    CaidanMoveOut()//快速移动时 鼠标脱离物体
    {
        this.CaiDanUp();
    }
    CaiDanUp() {


        this.Caidan2.addChild(this.caidanDan);

        this.caidanDan.off(Laya.Event.MOUSE_MOVE, this, this.CaiDanMove);

        let x = this.caidanDan.x;
        let y = this.caidanDan.y;
        console.log(x, y);
        if (x > this.xmin && x < this.xmax && y > this.ymin && y < this.ymax) {
            console.log("展示神龙");
            this.CaidanRewardPanelShow();
        }
        else {
            console.log("位置恢复,不触发");
        }
        this.caidanDan.x = this.ImageX;
        this.caidanDan.y = this.ImageY;

    }

    /*************彩蛋2获取**************/
    CaidanRewardPanel3: Laya.Box;
    Bg: Laya.Image;
    Props: Laya.Image;
    props: Laya.Image[] = [];
    ShenLongWenzi: Laya.Label;
    ADGetReward: Laya.Image;
    GetReward: Laya.Label;
    CaidanRewardPanelinit3() {
        this.CaidanRewardPanel3 = this.Caidanqiang.getChildByName("CaidanRewardPanel3") as Laya.Box;
        this.Bg = this.CaidanRewardPanel3.getChildByName("Bg") as Laya.Image;
        this.Props = this.Bg.getChildByName("Props") as Laya.Image;
        this.ShenLongWenzi = this.Bg.getChildByName("ShenLongWenzi") as Laya.Label;
        for (let index = 0; index < this.Props.numChildren; index++) {
            this.props.push(this.Props.getChildAt(index) as Laya.Image);
        }

        this.ADGetReward = this.Bg.getChildByName("ADGetReward") as Laya.Image;
        this.GetReward = this.Bg.getChildByName("GetReward") as Laya.Label;
        this.ADGetReward.on(Laya.Event.CLICK, this, this.ADGetRewardClick);
        this.GetReward.on(Laya.Event.CLICK, this, this.GetRewardClick);


        console.log("this.props", this.props);

        this.CaidanRewardPanelHide();
    }
    CaidanRewardPanelShow() {
        //第一次显示文字
        this.ShenLongWenzi.visible = this.Rewardindex == 5;;
        this.Props.visible = !this.ShenLongWenzi.visible;
        (this.ADGetReward.getChildAt(1) as Laya.Image).visible = !this.ShenLongWenzi.visible;
        this.CaidanRewardPanel3.visible = true;
    }
    CaidanRewardPanelHide() {
        this.CaidanRewardPanel3.visible = false;
    }
    Rewardindex = 5;

    ShowReward()//每次调用展示就要随机一次
    {

        let ran = this.randomInRange_i(0, 100);
        if (ran >= 0 && ran < 1) {
            this.Rewardindex = 0;
        }
        else if (ran >= 1 && ran < 36) {
            this.Rewardindex = 1;
        }
        else if (ran >= 36 && ran < 66) {
            this.Rewardindex = 2;
        }
        else if (ran >= 66 && ran < 68) {
            this.Rewardindex = 3;
        }
        else if (ran >= 68 && ran < 100) {
            if (lwg.Global._kejigongzhu) {
                this.Rewardindex = 3;

            } else {
                this.Rewardindex = 4;
            }

        }
        if (this.Rewardindex == 5)//空礼物 显示文字
        {

        }
        else {
            this.props.forEach((v, i) => {
                if (this.Rewardindex == i) {
                    v.visible = true;
                }
                else {
                    v.visible = false;
                }
            });
        }
        this.ShenLongWenzi.visible = this.Rewardindex == 5;
        this.Props.visible = !this.ShenLongWenzi.visible;;
        (this.ADGetReward.getChildAt(1) as Laya.Image).visible = !this.ShenLongWenzi.visible;
    }

    ADGetRewardClick() {
        ADManager.ShowReward(() => {
            //看视频获取----------------------------------------->
            console.log("看广告");
            this.ShowReward();//展示奖励
            this.RewardGet();
        })
    }

    ClosePanel() {
        this.RewardGet();
        this.ClosePanel();
    }
    GetRewardClick()//点击不谢谢 礼物获得 礼物清零
    {
        this.RewardGet();

        this.Rewardindex = 5;
        this.CaidanRewardPanelHide();
    }

    RewardGet()//获取展示到的奖励
    {
        if (this.Rewardindex == 0)//空礼物 显示文字
        {
            lwg.Global._addExecution(2);
            console.log("礼物", this.Rewardindex);
        }
        else if (this.Rewardindex == 1) {
            lwg.Global._addExecution(3);
            console.log("礼物", this.Rewardindex);
        }
        else if (this.Rewardindex == 2) {
            lwg.Global._addGold(20);
            console.log("礼物", this.Rewardindex);
        }
        else if (this.Rewardindex == 3) {
            lwg.Global._addGold(30);
            console.log("礼物", this.Rewardindex);
        }
        else if (this.Rewardindex == 4) {
            lwg.Global._kejigongzhu = true;
            lwg.LocalStorage.addData();
            let skin = Laya.LocalStorage.getItem("Caidanskin" + 3);
            let strs = skin.split("_");
            Laya.LocalStorage.setItem("Caidanskin" + 3, "1" + "_" + strs[1] + "_" + strs[2]);
            console.log("礼物", this.Rewardindex);
            lwg.Global._createHint_01(lwg.Enum.HintType.kejigongzhu);

        }
        else if (this.Rewardindex == 5) {
            console.log("无礼物");
        }
        this.Skinitems.forEach((v, i) => {
            v.Fell(this.CaiDanDatas2[i], this.Caidanqiang);
        })
    }

    randomInRange_i(x: number, y: number, s = null): number {
        let rs;
        if (x == y) {
            rs = x;
        } else if (y > x) {
            let v = (y - x) * (s == null ? Math.random() : s) + x;
            rs = v.toFixed();
        } else {
            throw `x > y`;
        }
        return Number(rs);
    }

    onDisable(): void {
        let skin = Laya.LocalStorage.getItem("Caidanskin" + this.NowCaidanDataq.ID);
        let strs = skin.split("_");
        if (strs[0] === '1') {
            lwg.Global._currentPifu = this.NowCaidanDataq.Tip;
            lwg.LocalStorage.addData();
        }
        console.log(this.NowCaidanDataq);
        console.log(lwg.Global._currentPifu);
    }

    //#endregion
}