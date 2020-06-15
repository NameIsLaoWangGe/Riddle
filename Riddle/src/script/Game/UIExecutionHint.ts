import { lwg } from "../Lwg_Template/lwg";

export default class UIExecutionHint extends lwg.Admin.Scene {
    lwgInit() {
        lwg.Global._stageClick = false;
    }
    adaptive() {
        this.self['sceneContent'].y = Laya.stage.height * 0.481;
    }
    btnOnClick(): void {
        lwg.Click.on(lwg.Enum.ClickType.noEffect, null, this.self['BtnGet'], this, null, null, this.btnGetUp, null);
        lwg.Click.on(lwg.Enum.ClickType.noEffect, null, this.self['BtnClose'], this, null, null, this.btnCloseUp, null);
        lwg.Click.on(lwg.Enum.ClickType.largen, null, this.self['Btn'], this, null, null, null, null);
    }
    btnGetUp(event): void {
        this.btnGetUp_advFunc();
    }

    btnGetUp_advFunc(): void {
        lwg.Global._execution += 5;
        let num = lwg.Global.ExecutionNumNode.getChildByName('Num') as Laya.FontClip;
        num.value = (Number(num.value) + 5).toString();
        lwg.LocalStorage.addData();
        lwg.Global._stageClick = true;
        this.self.close();
    }

    btnCloseUp(event): void {
        lwg.Global._stageClick = true;
        this.self.close();
        // lwg.Admin._openScene('UIDefeated', null, null, null);
    }
}