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

    lwgInit(): void {
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
            this.selfScene[lwg.Admin.SceneName.UIVictoryBox].getNum -= 1;

            let nameNum = Number(this.self.name);

            let number = Number(this.Num.text);

            Animation.shookHead_Simple(this.Pic_Box, 10, 100, 0, f => {
                Effects.createCommonExplosion(this.self, 20, this.Pic_Box.x, this.Pic_Box.x, 'star', 10, 15);

                this.BoxList.array[nameNum].pic_Gold = true;
                this.BoxList.array[nameNum].pic_Box = false;

                lwg.Effects.getGoldAni(Laya.stage, number, Laya.stage.width / 2, Laya.stage.height / 2, lwg.Global.GoldNumNode.x - 53, lwg.Global.GoldNumNode.y - 12, f => {
                    lwg.Global._addGoldDisPlay(1);
                    this.BoxList.refresh();
                }, f => {
                    lwg.Global._addGold(number);
                    this.BoxList.refresh();
                });
            });

            this.byGet = true;
        } else {
            console.log('已经没有领取次数了，或者当前这个领取过了 ！')
        }
    }

    lwgDisable(): void {
    }
}