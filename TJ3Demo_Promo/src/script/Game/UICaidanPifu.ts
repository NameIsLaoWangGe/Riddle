import { lwg } from "../Lwg_Template/lwg";
import UIStart from "./UIStart";
import ADManager, { TaT } from "../../TJ/Admanager";

export default class UICaidanPifu extends lwg.Admin.Scene {
    /**内容*/
    private SceneContent: Laya.Sprite;
    /**内容*/
    private background: Laya.Sprite;
    /**返回按钮*/
    private BtnBack: Laya.Sprite;
    /**看广告按钮*/
    private BtnGet: Laya.Sprite;
    /**logo*/
    private logo: Laya.Sprite;
    /**中间角色*/
    private person: Laya.Sprite;

    constructor() { super(); }

    lwgInit(): void {
        this.SceneContent = this.self['SceneContent'];
    }
    adaptive(): void {
        this.SceneContent.y = Laya.stage.height * 0.528;
        this.self['background_01'].height = Laya.stage.height;
    }

    btnOnClick(): void {
        lwg.Click.on('largen', null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
        lwg.Click.on('largen', null, this.self['BtnFreeGet'], this, null, null, this.btnFreeUp, null);
    }

    /**返回按钮抬起*/
    btnNoUp(event): void {
        this.self.close();
    }

    /**看广告按钮抬起*/
    btnFreeUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_limitskin');
        event.currentTarget.scale(1, 1);

        ADManager.ShowReward(() => {
            lwg.Global._haimiangongzhu = true;
        })
    }

    lwgDisable(): void {

    }
}