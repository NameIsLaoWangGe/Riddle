import { lwg } from "../Lwg_Template/lwg";

export default class UILoding_ExecutionNumNode extends lwg.Admin.Object {
    Num: Laya.FontClip;
    CountDown: Laya.Label;
    CountDown_board: Laya.Label;

    lwgInit(): void {
        this.Num = this.self.getChildByName('Num') as Laya.FontClip;
        this.CountDown = this.self.getChildByName('CountDown') as Laya.Label;
        this.CountDown_board = this.self.getChildByName('CountDown_board') as Laya.Label;
        this.countNum = 59;
        this.CountDown.text = '00:' + this.countNum;
        this.CountDown_board.text = this.CountDown.text;

        // 获取上次的体力
        let d = new Date;
        if (d.getHours() === lwg.Global._addExHours) {
            lwg.Global._execution += (d.getMinutes() - lwg.Global._addMinutes);
            if (lwg.Global._execution > 15) {
                lwg.Global._execution = 15;
            }
        } else {
            lwg.Global._execution = 15;
        }
        this.Num.value = lwg.Global._execution.toString();
        lwg.Global._addExHours = d.getHours();
        lwg.Global._addMinutes = d.getMinutes();
        lwg.LocalStorage.addData();
    }

    /**计时器*/
    time: number = 0;
    /**时钟当前秒数*/
    countNum: number = 59;
    /**倒计时，一分钟一点体力*/
    countDownAddEx(): void {
        this.time++;
        if (this.time % 60 == 0) {
            this.countNum--;
            if (this.countNum < 0) {
                this.countNum = 59;
                lwg.Global._execution += 1;
                this.Num.value = lwg.Global._execution.toString();
                let d = new Date;
                lwg.Global._addExHours = d.getHours();
                lwg.Global._addMinutes = d.getMinutes();
                lwg.LocalStorage.addData();
            }
            if (this.countNum >= 10 && this.countNum <= 59) {
                this.CountDown.text = '00:' + this.countNum;
                this.CountDown_board.text = this.CountDown.text;

            } else if (this.countNum >= 0 && this.countNum < 10) {
                this.CountDown.text = '00:0' + this.countNum;
                this.CountDown_board.text = this.CountDown.text;
            }
        }
    }

    timeSwitch: boolean = true;
    lwgOnUpdate(): void {
        if (Number(this.Num.value) >= 15) {
            if (this.timeSwitch) {
                lwg.Global._execution = 15;
                this.Num.value = lwg.Global._execution.toString();
                lwg.LocalStorage.addData();
                this.CountDown.text = '00:00';
                this.CountDown_board.text = this.CountDown.text;
                this.countNum = 60;
                this.timeSwitch = false;
            }

        } else {
            this.timeSwitch = true;
            this.countDownAddEx();
        }
    }
    lwgDisable(): void {

    }
}