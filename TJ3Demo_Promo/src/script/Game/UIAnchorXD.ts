import { lwg } from "../Lwg_Template/lwg";
import ADManager from "../../TJ/Admanager";

export default class UIAnchorXD extends lwg.Admin.Scene {

    btnOnClick(): void {
        lwg.Click.on('largen', null, this.self['BtnYes'], this, null, null, this.btnYesClickUP, null);
        lwg.Click.on('largen', null, this.self['BtnNo'], this, null, null, this.btnNoClickUP, null);
    }

    btnYesClickUP(event): void {
        event.currentTarget.scale(1, 1);

        ADManager.ShowReward(() => {
            this.btnYesFunc();
        })
    }
    btnYesFunc(): void {
        console.log('获得了一个主播限定皮肤！');
    }

    btnNoClickUP(event): void {
        event.currentTarget.scale(1, 1);
        this.self.close();
    }

}