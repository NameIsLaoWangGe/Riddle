import { lwg } from "../Lwg_Template/lwg";
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
            let nameNum = Number(this.self.name);
            console.log(nameNum);

            this.BoxList.array[nameNum].pic_Gold = true;
            this.BoxList.array[nameNum].pic_Box = false;

            this.BoxList.refresh();

            

            this.byGet = true;
        } else {
            console.log('已经没有领取次数了，或者当前这个领取过了 ！')
        }
    }

    lwgDisable(): void {
    }
}