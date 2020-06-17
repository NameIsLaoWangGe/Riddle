import { lwg } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";
import RecordManager from "../../TJ/RecordManager";

export default class UIVictory extends lwg.Admin.Scene {
    /**领取奖励按钮*/
    BtnGet: Laya.Sprite;
    /**过关显示*/
    AccordingLv: Laya.Sprite;
    /**获得金币*/
    GetGold: Laya.Sprite;
    /**三倍领取*/
    BtnGoldAdv: Laya.Sprite;
    /**看广告领取体力*/
    BtnExAdv: Laya.Sprite;
    /**关卡数量*/
    LvNum: Laya.FontClip;
    /**下一关*/
    BtnNext: Laya.Sprite;

    constructor() { super(); }

    lwgInit(): void {
        ADManager.ShowNormal();
        RecordManager.stopAutoRecord();

        this.BtnGoldAdv = this.self['BtnGoldAdv'];
        this.BtnExAdv = this.self['BtnExAdv'];
        this.GetGold = this.self['GetGold'];
        this.LvNum = this.self['LvNum'];
        this.LvNum.value = lwg.Global._gameLevel.toString();
        this.BtnNext = this.self['BtnNext'];

        this.getGoldDisplay();
        this.LvNumDisplay();

        lwg.PalyAudio.playSound(lwg.Enum.voiceUrl.victory, 1);

        if (lwg.Global._hotShare && lwg.Global._gameLevel !== 1) {
            lwg.Admin._openScene(lwg.Admin.SceneName.UIShare, null, null, null);
        }

    }

    adaptive(): void {
        this.self['sceneContent'].y = Laya.stage.height / 2;
    }

    openAni(): void {
        lwg.Effects.createFireworks(this.self['sceneContent'], 30, 430, 40);
        lwg.Effects.createFireworks(this.self['sceneContent'], 30, 109, 49.5);

        lwg.Effects.createLeftOrRightJet(this.self['sceneContent'], 'right', 30, 582, 141.5);
        lwg.Effects.createLeftOrRightJet(this.self['sceneContent'], 'left', 30, -21.5, 141.5);


        this.BtnNext.visible = false;
        setTimeout(() => {
            this.BtnNext.visible = true;
        }, 3000);

        this.self['BtnBack'].visible = false;
        setTimeout(() => {
            this.self['BtnBack'].visible = true;
        }, 3000);
    }

    /**
     * 创建金币领取动画，领取完毕后进行下一步操作
     * @param number 金币数量
     * @param thisFunc 回调函数
     * */
    getGoldAni(number, thisFunc): void {
        let x = this.self['GetGold'].x + this.self['sceneContent'].x - this.self['sceneContent'].width / 2;
        let y = this.self['GetGold'].y + this.self['sceneContent'].y - this.self['sceneContent'].height / 2;
        for (let index = 0; index < number; index++) {
            lwg.Effects.createAddGold(Laya.stage, index, x, y, lwg.Global.GoldNumNode.x, lwg.Global.GoldNumNode.y, f => {
                let Num = lwg.Global.GoldNumNode.getChildByName('Num') as Laya.FontClip;
                Num.value = (Number(Num.value) + 1).toString();

                let goldNum = this.self['GoldNum'] as Laya.FontClip;
                goldNum.value = 'x' + (number - index - 2);
                if (index === number - 1) {
                    if (thisFunc !== null) {
                        thisFunc();

                    }
                }
            });
        }
    }

    /**显示本关获得金币显示,此时已经获得获得，但是总数位置并没有显示*/
    getGoldDisplay(): void {
        let goldNum = this.GetGold.getChildByName('GoldNum') as Laya.FontClip;
        let level = lwg.Global._gameLevel;
        goldNum.value = 'x' + 25;
        lwg.Global._goldNum += 25;
        lwg.LocalStorage.addData();
    }

    /**关卡数显示，有两种情况，一种是显示当前真实关卡，一种是重玩以前的关卡*/
    LvNumDisplay(): void {
        if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
            this.LvNum.value = lwg.Global._gameLevel.toString();
        } else {
            this.LvNum.value = lwg.Admin.openLevelNum.toString();
        }
    }

    btnOnClick(): void {
        ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_success');
        ADManager.TAPoint(TaT.BtnShow, 'Share_success');
        ADManager.TAPoint(TaT.BtnShow, 'nextword_success');
        ADManager.TAPoint(TaT.BtnShow, 'ADticketbt_success');

        lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnGoldAdv, this, null, null, this.btnGoldAdvUp, null);

        lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnNext, this, null, null, this.btnNextUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnBack'], this, null, null, this.btnBackUp, null);
        lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
    }

    btnOffClick(): void {
        lwg.Click.off(lwg.Click.ClickType.largen, this.BtnNext, this, null, null, this.btnNextUp, null);
        lwg.Click.off(lwg.Click.ClickType.largen, this.BtnGoldAdv, this, null, null, this.btnGoldAdvUp, null);
        lwg.Click.off(lwg.Click.ClickType.largen, this.self['BtnBack'], this, null, null, this.btnBackUp, null);
        lwg.Click.off(lwg.Click.ClickType.largen, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
    }

    /**是否有过三倍领取*/
    goldAdv_3Get: boolean;
    /**需要判断当前的关卡是否和当前关卡相等，不相等说明打开的是以前的关卡*/
    btnNextUp(event) {
        ADManager.TAPoint(TaT.BtnClick, 'nextword_success');
        event.currentTarget.scale(1, 1);

        if (lwg.Global._execution < 2) {
            lwg.Admin._openScene('UIExecutionHint', null, null, null);
        } else {
            this.btnOffClick();
            if (this.goldAdv_3Get) {
                this.getGoldAniFunc();
            } else {
                this.getGoldAni(15, f => {
                    this.getGoldAniFunc();
                    lwg.Global._goldNum += 10;
                    let Num = lwg.Global.GoldNumNode.getChildByName('Num') as Laya.FontClip;
                    Num.value = (Number(Num.value) + 10).toString();
                })
            }

        }
    }
    /**领取金币动画后回调*/
    getGoldAniFunc(): void {
        if (Number(this.LvNum.value) >= 3) {
            lwg.Admin._openScene('UIPassHint', null, null, f => {
                console.log('下一关');
            });
        } else {
            lwg.Admin._nextCustomScene(2);
            lwg.LocalStorage.addData();
        }
        this.self.close();
    }

    // 三倍领取
    btnGoldAdvUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_success');
        event.currentTarget.scale(1, 1);

        ADManager.ShowReward(() => {
            this.btnGoldAdvUpFunc();
        })
    }

    btnGoldAdvUpFunc(): void {
        let btnpic = this.BtnGoldAdv.getChildByName('btnpic') as Laya.Image;
        let iconpic = this.BtnGoldAdv.getChildByName('iconpic') as Laya.Image;
        btnpic.skin = 'UI_new/Victory/rede_btn_01.png';
        iconpic.skin = 'UI_new/Victory/icon_adv_h.png';
        this.btnOffClick();

        let goldNum = this.GetGold.getChildByName('GoldNum') as Laya.FontClip;
        goldNum.value = 'x' + 75;

        // 表现上加上
        let Num = lwg.Global.GoldNumNode.getChildByName('Num') as Laya.FontClip;
        Num.value = (Number(Num.value) + 60).toString();

        this.goldAdv_3Get = true;

        this.getGoldAni(15, fun => {
            // 开始时已经领取了25
            lwg.Global._goldNum += 25 * 2;
            lwg.LocalStorage.addData();

            lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnNext, this, null, null, this.btnNextUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnBack'], this, null, null, this.btnBackUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);

            goldNum.value = 'x' + 0;
        });

    }

    btnBackUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'ADticketbt_success');
        event.currentTarget.scale(1, 1);

        this.btnOffClick();
        if (this.goldAdv_3Get) {
            this.btnBackUpFunc();
        } else {
            this.getGoldAni(15, f => {
                this.btnBackUpFunc();
                lwg.Global._goldNum += 10;
                let Num = lwg.Global.GoldNumNode.getChildByName('Num') as Laya.FontClip;
                Num.value = (Number(Num.value) + 10).toString();
            })
        }
    }

    btnBackUpFunc(): void {
        lwg.Admin._openScene('UIStart', null, null, null);
        lwg.Admin._closeCustomScene();
        lwg.LocalStorage.addData();
        this.self.close();
        lwg.Global._gameLevel++;
        lwg.LocalStorage.addData();
    }

    btnShareUp(event): void {
        ADManager.TAPoint(TaT.BtnClick, 'Share_success');
        event.currentTarget.scale(1, 1);

        RecordManager._share(() => {
            this.btnShareUpFunc();
        })
    }

    btnShareUpFunc(): void {
        console.log('分享成功，只是没有奖励！');
    }

    lwgDisable(): void {
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
    }
}