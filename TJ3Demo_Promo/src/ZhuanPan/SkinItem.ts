import CaiDanData from "./CaidanData";
import CaiDanQiang from "./CaiDanQiang";

export default class SkinItem extends Laya.Script {
    Skin: Laya.Box;
    Icon: Laya.Image;
    Lock: Laya.Image;
    light: Laya.Image;


    ID: number = 0;
    data: CaiDanData;
    caidanqiang: CaiDanQiang;
    storage: string;
    storages: string[];
    onAwake() {
        this.Skin = this.owner as Laya.Box;
        this.Icon = this.Skin.getChildByName("Icon") as Laya.Image;
        this.Lock = this.Skin.getChildByName("Lock") as Laya.Image;
        this.light = this.Skin.getChildByName("light") as Laya.Image;
        this.light.visible = false;
        console.log(this.Icon, this.Lock, this.light);

        this.Skin.on(Laya.Event.MOUSE_DOWN, this, this.Down);
        this.Skin.on(Laya.Event.MOUSE_UP, this, this.Up);
        this.Skin.on(Laya.Event.MOUSE_OUT, this, this.Up);

    }

    Fell(_data: CaiDanData, _caidanqiang: Laya.Box) {
        this.data = _data;
        console.log("this.data ===>", this.data);
        this.caidanqiang = _caidanqiang.getComponent(CaiDanQiang) as CaiDanQiang;
        this.Refresh();
    }

    Refresh() {
        this.ID = this.data.ID;
        this.Icon.skin = this.data.GetIconPath();
        this.Lock.skin = this.data.GetIconPath_h();
        this.storage = Laya.LocalStorage.getItem("Caidanskin" + this.ID);
        this.storages = this.storage.split("_");
        //解锁后展示框 隐藏剪影
        this.Lock.visible = this.storages[0] == "0";
    }
    lightChange(ID: number): void {
        if (this.ID === ID) {
            this.light.visible = true;
        } else {
            this.light.visible = false;
        }
    }
    IsDown: boolean = false;
    Down()//按下
    {
        console.log("按下后3S 不移开或是不抬起 并且皮肤未解锁 如果该皮肤为彩蛋 弹出框")
        if (this.ID == 4 && this.storages[0] == "0") {
            Laya.timer.once(3000, this, this.ShowReward)
        }
        this.IsDown = true;
    }
    Up()//抬起算点击结束 修改页面信息
    {
        if (this.IsDown) {
            this.caidanqiang.RefreshView(this.data);
            Laya.timer.clearAll(this)
            //console.log("点击修改信息,取消弹窗");
            this.IsDown = false;
            this.light.visible = true;
        }
    }

    ShowReward() {
        console.log("展示奖励");
        this.caidanqiang.CaidanJiemianShow1();
    }


}