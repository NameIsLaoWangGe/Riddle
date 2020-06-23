import { lwg } from "../Lwg_Template/lwg";

export default class UISet extends lwg.Admin.Scene {
    /**震动按钮*/
    private BtnShake: Laya.Sprite;
    /**声音按钮*/
    private BtnVoice: Laya.Sprite;
    /**关闭按钮*/
    private BtnClose: Laya.Sprite;

    lwgInit(): void {
        this.self = this.owner as Laya.Scene;
        this.BtnVoice = this.self['BtnVoice'];
        this.BtnShake = this.self['BtnShake'];
        this.BtnClose = this.self['BtnClose'];
        this.btnVoiceAndBtnShake();
        if (!lwg.Global._elect) {
            this.self['P204'].visible = false; 
        }
    }

    adaptive(): void {
        this.self['P204'].y = Laya.stage.height * 0.130;
        this.self['SceneContent'].y = Laya.stage.height * 0.471;
    }

    /**声音按钮和震动按钮的样式初始化*/
    btnVoiceAndBtnShake(): void {
        let voiceImg = this.BtnVoice.getChildAt(0) as Laya.Image;
        let voiceUrl1 = 'UI_new/Set/icon_voice_on.png';
        let voiceUrl2 = 'UI_new/Set/icon_voice_off.png';
        if (lwg.PalyAudio._voiceSwitch) {
            voiceImg.skin = voiceUrl1;
        } else {
            voiceImg.skin = voiceUrl2;
        }

        // 震动图标初始化
        let shakeImg = this.BtnShake.getChildAt(0) as Laya.Image;
        let shakeUrl1 = 'UI_new/Set/icon_shake_on.png';
        let shakeUrl2 = 'UI_new/Set/icon_shake_off.png';
        if (lwg.Global._shakeSwitch) {
            shakeImg.skin = shakeUrl1;
        } else {
            shakeImg.skin = shakeUrl2;
        }
    }

    btnOnClick(): void {
        lwg.Click.on('largen', null, this.BtnVoice, this, null, null, this.btnVoiceClickUP, null);
        lwg.Click.on('largen', null, this.BtnShake, this, null, null, this.btnShakeClickUP, null);
        lwg.Click.on('largen', null, this.BtnClose, this, null, null, this.btnCloseClickUP, null);
        lwg.Click.on('largen', null, this.self['BtnRedeem'], this, null, null, this.btnRedeemClickUP, null);
    }

    btnRedeemClickUP(event): void {
        event.currentTarget.scale(1, 1);
        lwg.Admin._openScene(lwg.Admin.SceneName.UIRedeem, null, null, null);
    }

    /**声音控制按钮抬起*/
    btnVoiceClickUP(event): void {
        event.currentTarget.scale(1, 1);
        // 声音图标初始化
        let voiceImg = this.BtnVoice.getChildAt(0) as Laya.Image;
        let voiceUrl1 = 'UI_new/Set/icon_voice_on.png';
        let voiceUrl2 = 'UI_new/Set/icon_voice_off.png';
        if (voiceImg.skin === voiceUrl1) {
            voiceImg.skin = voiceUrl2;
            lwg.PalyAudio._voiceSwitch = false;
            lwg.PalyAudio.stopMusic();
        } else if (voiceImg.skin === voiceUrl2) {
            voiceImg.skin = voiceUrl1;
            lwg.PalyAudio._voiceSwitch = true;
            lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 0);
        }
    }

    /**手机震动按钮抬起*/
    btnShakeClickUP(event): void {
        event.currentTarget.scale(1, 1);
        let img = this.BtnShake.getChildAt(0) as Laya.Image;
        let url1 = 'UI_new/Set/icon_shake_on.png';
        let url2 = 'UI_new/Set/icon_shake_off.png';
        if (img.skin === url1) {
            img.skin = url2;
            lwg.Global._shakeSwitch = false;
        } else if (img.skin === url2) {
            img.skin = url1;
            lwg.Global._shakeSwitch = true;
        }
    }

    /**设置按钮抬起*/
    btnCloseClickUP(event): void {
        event.currentTarget.scale(1, 1);
        this.self.close();
    }

    onDisable(): void {
    }
}