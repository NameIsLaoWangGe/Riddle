export default class RewardPanel extends Laya.Script
{
    RewardPanel: Laya.Box;
    lotteryindex: number = 0;
    BtnState: number = 0;
    lotteryShowBg: Laya.Image;
    Props: Laya.Box;
    GetReward: Laya.Image;
    ADGetReward: Laya.Image;
    lotterypropsshow: Laya.Image[] = [];
    ADaction: Function;
    Normalaction: Function
    CloseRewardBtn: Laya.Image;
    onAwake()
    {
        //     this.RewardPanel = this.owner as Laya.Box;
        //     this.RewardPanel.visible = false;
        //     this.CloseRewardBtn = this.RewardPanel.getChildByName("CloseRewardBtn") as Laya.Image;
        //     this.lotteryShowBg = this.RewardPanel.getChildByName("Bg") as Laya.Image;
        //     this.Props = this.lotteryShowBg.getChildByName("Props") as Laya.Box;
        //     this.GetReward = this.lotteryShowBg.getChildByName("GetReward") as Laya.Image;
        //     this.ADGetReward = this.lotteryShowBg.getChildByName("ADGetReward") as Laya.Image;
        //     for (let i = 0; i < this.Props.numChildren; i++)
        //     {
        //         this.lotterypropsshow.push(this.Props.getChildAt(i) as Laya.Image);
        //     }
        //     this.GetReward.on(Laya.Event.CLICK, this, this.GetRewardClick)
        //     this.ADGetReward.on(Laya.Event.CLICK, this, this.ADGetRewardClick)

        //     this.CloseRewardBtn.on(Laya.Event.CLICK, this, () =>
        //     {
        //         this.RewardPanel.visible = false;
        //     })
    }
}