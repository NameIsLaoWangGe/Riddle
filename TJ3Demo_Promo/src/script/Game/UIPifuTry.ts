import { lwg } from "../Lwg_Template/lwg";
import ADManager from "../../TJ/Admanager";

export default class UIPifuTry extends lwg.Admin.Scene {
    /**看广告获取*/
    private BtnAdv: Laya.Sprite;
    /**随机到的皮肤是第几个皮肤*/
    private pifuNum: number;

    constructor() { super(); }

    lwgInit(): void {
        this.self = this.owner as Laya.Scene;
        this.BtnAdv = this.self['BtnAdv'];

        lwg.Global.notHavePifuSubXD();
        this.randomNoHave();

    }
    adaptive(): void {
        this.self['SceneContent'].y = Laya.stage.height / 2;
        this.self['background_01'].height = Laya.stage.height;
    }

    openAni(): void {
        this.self['BtnNo'].visible = false;
        setTimeout(() => {
            this.self['BtnNo'].visible = true;
        }, lwg.Global._btnDelayed);
    }

    /**随机出一个还没有获得的皮肤放在皮肤加载位置*/
    randomNoHave(): void {
        let len = lwg.Global._notHavePifuSubXD.length;
        if (len === 0) {
            this.self.close();
            lwg.Global._gameStart = true;
            return;
        }
        let random = Math.floor(Math.random() * len);
        // 显示名称
        let pifuName = lwg.Global._notHavePifu[random];
        let oder1 = lwg.Enum.PifuAllName[pifuName];
        this.pifuNum = oder1;
        // let name = this.PifuName.getChildByName('Name') as Laya.Label;
        // 找到皮肤地址
        let pifuImg = this.self['Pifu'].getChildByName('img') as Laya.Image;
        let oder2 = lwg.Enum.PifuAllName[pifuName];
        pifuImg.skin = lwg.Enum.PifuSkin[oder2];
    }

    btnOnClick(): void {
        lwg.Click.on('largen', null, this.BtnAdv, this, null, null, this.btnAdvUp, null);
        // lwg.Click.on('largen', null, this.self['BtnBack'], this, null, null, this.btnBackUp, null);
        lwg.Click.on('largen', null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
    }

    btnAdvUp(event): void {
        event.currentTarget.scale(1, 1);
        ADManager.ShowReward(() => {
            this.btnAdvFunc();
        })
    }
    btnBackUp(): void {
        this.self.close();
    }

    btnNoUp(): void {
        this.self.close();
        lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].openPlayScene();
    }

    btnAdvFunc(): void {
        this.self.close();
        lwg.Global._yuanpifu = lwg.Global._currentPifu;
        lwg.Global._currentPifu = lwg.Enum.PifuAllName[this.pifuNum];
        lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].openPlayScene();
        this.self.close();

        lwg.LocalStorage.addData();
    }

    onDisable(): void {
    }
}