import { lwg } from "../Lwg_Template/lwg";

export default class UIPassHint extends lwg.Admin.Scene {
    adaptive() {
        this.self['sceneContent'].y = Laya.stage.height * 0.481;
    }
    btnOnClick(): void {
        lwg.Click.on(lwg.Enum.ClickType.largen, null, this.self['BtnYse'], this, null, null, this.btnYseUp, null);
        lwg.Click.on(lwg.Enum.ClickType.largen, null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
    }
    btnYseUp(event): void {
        event.currentTarget.scale(1, 1);
        // 第二次点击会弹出失败界面
        if (this.self['Pic'].skin === 'UI_new/PassHint/word_yes.png') {
            lwg.Admin._openScene('UIDefeated', null, null, null);
        } else {
            this.btnYseUp_advFunc();
        }
    }

    btnYseUp_advFunc(): void {
        this.self['Pic'].skin = 'UI_new/PassHint/word_yes.png';
        let num = lwg.Admin.openCustomName.substring(lwg.Admin.openCustomName.length - 3, lwg.Admin.openCustomName.length);
        this.self['Dec'].text = '  ' + lwg.Global._hintDec[Number(num) - 1]['dec'];
    }

    btnNoUp(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Admin._openScene('UIDefeated', null, null, null);
    }
}