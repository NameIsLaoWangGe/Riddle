import { lwg, Animation, Effects } from "../Lwg_Template/lwg";
import ADManager, { TaT } from "../../TJ/Admanager";

export default class UIVictoryBox_Cell extends lwg.Admin.Object {
    constructor() { super(); }
    Pic_Gold: Laya.Image;
    Num: Laya.Text;
    Pic_Box: Laya.Image;

    BoxList: Laya.List;
    /**是否被领取了*/
    byGet: boolean = false;

    /**记录列表中每个box的坐标*/
    posArr: Array<Array<number>>


    SceneContent: Laya.Sprite;

    lwgInit(): void {
        ADManager.TAPoint(TaT.BtnShow, 'ADrewardbox_box');

        this.posArr = [
            [129.5, 254], [295, 254], [458.5, 254],
            [129.5, 403.5], [295, 403.5], [458.5, 403.5],
            [129.5, 553], [295, 553], [458.5, 553],
        ];

        this.SceneContent = this.selfScene['SceneContent'] as Laya.Sprite;
        this.Pic_Gold = this.self.getChildByName('Pic_Gold') as Laya.Image;
        this.Num = this.self.getChildByName('Num') as Laya.Text;
        this.Pic_Box = this.self.getChildByName('Pic_Box') as Laya.Image;
        this.BoxList = this.selfScene[lwg.Admin.SceneName.UIVictoryBox].BoxList;
        this.byGet = false;
    }

    btnOnClick(): void {
        lwg.Click.on('largen', null, this.self, this, null, null, this.up, null);
    }

    up(e: Laya.Event): void {
        e.currentTarget.scale(1, 1);
        let getNum = this.selfScene[lwg.Admin.SceneName.UIVictoryBox].getNum;

        if (!this.byGet && getNum >= 1) {
            //两个不同的宝箱，一个是需要看广告的，一个是不需要的
            let url1 = 'UI_new/VictoryBox/icon_chai.png';
            let url2 = 'UI_new/VictoryBox/icon_advbox.png';
            if (this.Pic_Box.skin === url1) {
                this.upFunc();

            } else {
                ADManager.TAPoint(TaT.BtnClick, 'ADrewardbox_box');
                ADManager.ShowReward(() => {
                    this.upFunc();
                })
            }

        } else {
            lwg.Global._createHint_01(lwg.Enum.HintType.watchAdv);
        }
    }

    upFunc(): void {

        this.selfScene[lwg.Admin.SceneName.UIVictoryBox].maxGetNum++;

        this.selfScene[lwg.Admin.SceneName.UIVictoryBox].btnOffClick();

        this.selfScene[lwg.Admin.SceneName.UIVictoryBox].getNum -= 1;

        let nameNum = Number(this.self.name);

        let number = Number(this.Num.text);

        Animation.shookHead_Simple(this.Pic_Box, 10, 100, 0, f => {

            Effects.createExplosion_Rotate(this.SceneContent, 25, this.posArr[nameNum][0], this.posArr[nameNum][1], 'star', 10, 15);

            this.BoxList.array[nameNum].pic_Gold = true;
            this.BoxList.array[nameNum].pic_Box = false;
            this.BoxList.refresh();

            Laya.timer.frameOnce(20, this, f => {
                lwg.Effects.getGoldAni(Laya.stage, number, Laya.stage.width / 2, Laya.stage.height / 2, lwg.Global.GoldNumNode.x - 53, lwg.Global.GoldNumNode.y - 12, f => {
                    lwg.Global._addGoldDisPlay(1);
                    this.BoxList.refresh();
                }, f => {
                    lwg.Global._addGold(number);
                    this.selfScene[lwg.Admin.SceneName.UIVictoryBox].btnOnClick();
                    this.BoxList.refresh();
                });
            })

        });
        this.byGet = true;
    }

    lwgDisable(): void {

    }
}