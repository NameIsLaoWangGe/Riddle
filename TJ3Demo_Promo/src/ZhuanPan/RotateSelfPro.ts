


export default class RotateSelfPro extends Laya.Script
{
    speed = 2;
    targetSpeed = 2;
    reducespeed = 0;


    zhizhen: Laya.Box;
    ZhunpanBg: Laya.Box;
    zhuanpanParent: Laya.Box;

    onAwake()
    {

        this.zhuanpanParent = this.owner as Laya.Box;
        this.ZhunpanBg = this.zhuanpanParent.getChildByName("ZhunpanBG") as Laya.Box;
        this.zhizhen = this.zhuanpanParent.getChildByName("ZhiZhen") as Laya.Box;
        this.zhizhen.rotation = 0;
        this.speed = 0.02;
        this.lastzhizhen = -1;

    }
    OpenZhiZhen()
    {
        Laya.timer.loop(1, this, this.FixedUpdate);
    }

    AddSpeed()
    {
        this.speed = 0;
        this.reducespeed = 0;
        this.RoteSpeed = 3;

        console.log("添加转速");
        let a = this.ZhunpanBg.rotation
        console.log("初始角度" + a);
        a = a % 360;
        console.log("初始角度" + a);
        if (a > 60)
        {
            a -= 360;
        }
        this.TargetTurn = 0;
        this.startStop = false;
        this.ZhunpanBg.rotation = a;
        console.log(this.ZhunpanBg.rotation);
        this.reducespeed = 0;
        Laya.timer.loop(1, this, this.SpeedUp)
        Laya.timer.loop(1, this, this.ZhiZhenMove)
    }
    action: Function;
    degree: number = 0;
    startStop: boolean;
    start: number = 0;
    StopSpeed(_degree: number, _action: Function)//转盘 箭头速度衰减 
    {
        console.log("转盘停止 开始减速" + _degree);
        Laya.timer.clear(this, this.SpeedUp);
        this.degree = _degree;
        this.degree %= 360;
        this.action = _action;
        this.reducespeed = 0.2;
        this.RoteSpeed = 1;
        console.log("转盘停止2 目标角度", this.degree);
    }
    lastzhizhen: number = 0;

    TargetAngle = 0;
    TargetTurn = 0;
    FixedUpdate()
    {
        if (this.startStop)
        {
            return;
        }
        if (this.speed > 4)
        {
            this.speed -= this.reducespeed;
        }
        

        this.ZhunpanBg.rotation += this.speed;
        if (this.ZhunpanBg.rotation > 360)
        {
            this.ZhunpanBg.rotation %= 360;
            this.TargetTurn++;
            if (this.TargetTurn > 3)
            {
                let a = this.ZhunpanBg.rotation;
                let b = this.degree;
                let c = Math.abs((a - b) / 360);
                Laya.timer.clear(this, this.ZhiZhenMove);
                Laya.timer.loop(1, this, this.ZhizhenStop);
                Laya.Tween.to(this.ZhunpanBg, { rotation: this.degree }, c * 5000, Laya.Ease.linearNone, Laya.Handler.create(this, () =>
                {
                    this.action();
                }))
                
                this.startStop = true;
            }
        }
        if (this.lastzhizhen != Math.ceil((this.ZhunpanBg.rotation + 30) / 60))
        {
            this.lastzhizhen = (Math.ceil((this.ZhunpanBg.rotation + 30) / 60));
        }

    }

    onStart()
    {


    }



    SpeedDown()
    {


    }

    SpeedUp()
    {
        this.speed += 0.5;
        if (this.speed >= 8)
        {
            Laya.timer.clear(this, this.SpeedUp);
        }
    }
    IsLeft: boolean = true;

    ZhizhenStop()
    {
        if (this.zhizhen.rotation < 0)
        {
            this.zhizhen.rotation += 0.2;
        }
        else
        {
            Laya.timer.clearAll(this)
            console.log("消除所有");
        }
    }

    RoteCut = 1;
    RoteSpeed = 2;
    ZhiZhenMove()
    {
        if (this.IsLeft)
        {

            this.zhizhen.rotation -= this.RoteSpeed;
            if (this.zhizhen.rotation <= -12)
            {
                this.IsLeft = !this.IsLeft;
            }
        }
        else
        {
            this.zhizhen.rotation += this.RoteSpeed;
            if (this.zhizhen.rotation >= 1)
            {
                this.IsLeft = !this.IsLeft;
            }
        }
    }
}