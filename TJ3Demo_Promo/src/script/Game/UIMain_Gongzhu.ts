import { lwg } from "../Lwg_Template/lwg";

export default class UIMain_Gongzhu extends lwg.Admin.Person {
    /**目前角色属于那个房间*/
    belongRoom: Laya.Image;
    /**当前移动方向*/
    moveDirection: string;
    /**角色的状态,在地板上，空中，梯子上*/
    personState: string;
    /**物理组件*/
    rig: Laya.RigidBody;
    /**buff状态，目前状态唯一，捡到新道具，老道具就会丢掉*/
    buffState: string;
    /**骨骼动画*/
    skeleton: Laya.Skeleton;
    /**当前公主是否有项链,有项链的时候连接，王子会去找公主*/
    private necklace: boolean = false;
    /**是否吃了鸡腿*/
    private drumstick: boolean = false;
    /**标志地址*/
    signSkin: string;
    lwgInit(): void {
        this.createskeleton();
        this.notCommon();
        this.createPlaint();
        this.setBelongRoom();
        this.directionJudge();
    }
    /**所有角色不会通用的一些属性*/
    notCommon(): void {
        this.buffState = null;
        this.signSkin = 'Room/icon_love.png';
    }

    /**创建感叹号*/
    plaint: Laya.Image;
    createPlaint(): void {
        let img = new Laya.Image();
        img.skin = this.signSkin;
        img.y = -60;
        img.x = this.self.width / 2 - 6 - img.width / 2;
        this.self.addChild(img);
        img.zOrder = 10;
        this.plaint = img;
    }

    /**方向判断*/
    directionJudge(): void {
        let pic = this.self.getChildByName('pic') as Laya.Image;
        if (pic.scaleX === -1) {
            this.moveDirection = lwg.Enum.PersonDir.left;
        } else if (pic.scaleX === 1) {
            this.moveDirection = lwg.Enum.PersonDir.right;
        }
        // console.log(pic.scaleX + this.moveDirection);
    }

    /**骨骼动画*/
    createskeleton(): void {

        switch (lwg.Global._currentPifu) {
            case lwg.Enum.PifuMatching.gongzhu:
                this.skeleton = lwg.Sk.gongzhuTem.buildArmature(0);
                break;

            case lwg.Enum.PifuMatching.chiji:
                this.skeleton = lwg.Sk.chijiTem.buildArmature(0);

                break;
            case lwg.Enum.PifuMatching.change:
                this.skeleton = lwg.Sk.changeTem.buildArmature(0);
                break;

            case lwg.Enum.PifuMatching.huiguniang:
                this.skeleton = lwg.Sk.huiguniangTem.buildArmature(0);
                break;

            case lwg.Enum.PifuMatching.tianshi:
                this.skeleton = lwg.Sk.tianshiTem.buildArmature(0);
                break;

            case lwg.Enum.PifuMatching.xiaohongmao:
                this.skeleton = lwg.Sk.xiaohongmaoTem.buildArmature(0);
                break;

            case lwg.Enum.PifuMatching.xiaohuangya:
                this.skeleton = lwg.Sk.xiaohuangyaTem.buildArmature(0);
                break;

            case lwg.Enum.PifuMatching.zhenzi:
                this.skeleton = lwg.Sk.zhenziTem.buildArmature(0);
                break;

            case lwg.Enum.PifuMatching.aisha:
                this.skeleton = lwg.Sk.aishaTem.buildArmature(0);
                break;
            default:
                break;
        }
        console.log(this.skeleton);

        this.self.addChild(this.skeleton);
        this.skeleton.pos(this.self.width / 2, this.self.height - 9);
        let pic = this.self.getChildByName('pic') as Laya.Sprite;
        pic.visible = false;
        this.skeleton.play(lwg.Enum.gongzhuAni.walk, true);
        // console.log(this.skeleton);
    }

    /**
     * 在哪个房间内则属于哪个房间
     * 通过X位置的宽度判断
    */
    setBelongRoom(): void {
        for (let index = 0; index < this.selfScene.numChildren; index++) {
            const child = this.selfScene.getChildAt(index) as Laya.Image;
            if (child.name.substring(0, 4) === 'Room') {
                let dx = Math.abs(child.x - this.self.x);
                let dy = Math.abs(child.y - this.self.y);
                if (dx <= child.width / 2 && dy <= child.height / 2) {
                    this.belongRoom = child;
                    // console.log(this.belongRoom);
                    break;
                }
            }
        }
    }

    /**上梯子前的方向记录*/
    beforeLadderDir: string;
    /**记录当前所在的梯子*/
    currentLadder: Laya.Sprite;

    /**是否为悬空状态*/
    inAir: boolean = false;
    /**悬空前的方向记录*/
    beforeInAirDir: string;

    /**到地板前的方向记录*/
    beforeFloorDir: string;
    /**记录当前所在的地板*/
    currentFloor: Laya.Sprite;

    /**当遇到被救的角色时的位置，用于他们在始终保持在一起*/
    targetP: Laya.Point = new Laya.Point();

    onTriggerEnter(other: any, self: any): void {
        if (!lwg.Global._gameStart) {
            return;
        }
        //根据碰撞物体作出相应行为
        switch (other.label) {
            case 'wall':
                this.wallAndPerson(other, self);
                break;

            case 'floor':
                this.floorAndPerson(other, self);
                break;

            case 'ladder':
                this.ladderAndPerson(other, self);
                break;

            case 'aisle':
                this.aisleAndPerson(other, self);
                break;

            case 'dog':
                this.dogAndPerson(other, self);
                break;

            case 'wangzi':
                this.wangziAndPerson(other, self);
                break;

            case 'stick':
                this.stickAndPerson(other, self);
                break;

            case 'kettle':
                this.kettleAndPerson(other, self);
                break;

            case 'bonfire':
                this.bonfireAndPerson(other, self);
                break;

            case 'necklace':
                this.necklaceAndPerson(other, self);
                break;

            case 'speed':
                this.speedAndPerson(other, self);
                break;

            case 'banana':
                this.bananaAndPerson(other, self);
                break;

            case 'drumstick':
                this.drumstickAndPerson(other, self);
                break;

            case 'houma':
                this.houmaAndPerson(other, self);
                break;

            default:
                break;
        }
    }

    /**后妈和角色碰撞*/
    houmaAndPerson(other, self): void {
        console.log('houma');
        let otherOwner = other.owner as Laya.Sprite;
        let otherOwnerName: string = otherOwner.name;
        if (this.drumstick) {
            return;
        } else {
            this.attackSwitch = true;
            otherOwner['UIMain_Houma'].attackSwitch = true;
            let apple = otherOwner.getChildByName('apple') as Laya.Image;
            apple.visible = true;
            // 延时出现失败界面
            Laya.timer.frameOnce(50, this, f => {
                this.selfScene['UIMain'].victory = false;

                this.skeleton.play(lwg.Enum.gongzhuAni.die, false);
                apple.visible = false;
                Laya.timer.frameOnce(100, this, f => {
                    lwg.Admin._openScene('UIPassHint', null, null, f => {
                        lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = lwg.Admin.SceneName.UIDefeated;
                    });
                });
            });
        }
    }

    /**加速符和角色碰撞*/
    drumstickAndPerson(other, self): void {
        let otherOwner = other.owner as Laya.Sprite;
        let otherOwnerName: string = otherOwner.name;
        otherOwner.removeSelf();
        this.drumstick = true;
    }

    /**加速符和角色碰撞*/
    bananaAndPerson(other, self): void {
        let otherOwner = other.owner as Laya.Sprite;
        let otherOwnerName: string = otherOwner.name;
        otherOwner.removeSelf();
        lwg.Global._gameStart = false;
        this.skeleton.play(lwg.Enum.gongzhuAni.die, false);
        // 延时出现失败界面
        Laya.timer.frameOnce(100, this, f => {
            this.selfScene['UIMain'].victory = false;

            lwg.Admin._openScene('UIPassHint', null, null, f => {
                lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = lwg.Admin.SceneName.UIDefeated;
            });
        });
    }

    /**加速符和角色碰撞*/
    speedAndPerson(other, self): void {
        let otherOwner = other.owner as Laya.Sprite;
        let otherOwnerName: string = otherOwner.name;
        otherOwner.removeSelf();
        this.speed = this.speed * 2;
    }

    /**项链和角色碰撞*/
    necklaceAndPerson(other, self): void {
        let otherOwner = other.owner as Laya.Sprite;
        let otherOwnerName: string = otherOwner.name;
        this.necklace = true;
        this.skeleton.play(lwg.Enum.gongzhuAni.walk_xianglian, true);
        otherOwner.removeSelf();
    }

    /**人和火堆的碰撞*/
    bonfireAndPerson(other, self): void {
        let otherOwner = other.owner as Laya.Sprite;
        let otherOwnerName: string = otherOwner.name;
        if (this.buffState === lwg.Enum.BuffState.kettle) {
            this.skeleton.play(lwg.Enum.gongzhuAni.attack_shuihu, false);
            this.attackSwitch = true;
            Laya.timer.frameOnce(100, this, f => {
                otherOwner.removeSelf();
                this.attackSwitch = false;
                this.skeleton.play(lwg.Enum.gongzhuAni.walk_shuihu, true)
            });
            this.skeleton.on(Laya.Event.LABEL, this, this.shuihuComplete, [otherOwner]);
        } else {
            this.skeleton.play(lwg.Enum.gongzhuAni.die, false);
            lwg.Global._gameStart = false;
            // 延时出现失败界面
            Laya.timer.frameOnce(100, this, f => {
                this.selfScene['UIMain'].victory = false;

                lwg.Admin._openScene('UIPassHint', null, null, f => {
                    lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = lwg.Admin.SceneName.UIDefeated;
                });
            });
        }
    }
    shuihuComplete(): void {
        // console.log('浇水完毕');
    }

    /**人和水壶的碰撞*/
    kettleAndPerson(other, self): void {
        let otherOwner = other.owner as Laya.Sprite;
        let otherOwnerName: string = otherOwner.name;
        // this.skeleton.play(lwg.Enum.gongzhuAni.walk_gun, true);
        this.buffState = lwg.Enum.BuffState.kettle;
        this.skeleton.play(lwg.Enum.gongzhuAni.walk_shuihu, true);
        otherOwner.removeSelf();
    }

    /**和棍棒碰撞*/
    stickAndPerson(other, self): void {
        let otherOwner = other.owner as Laya.Sprite;
        this.skeleton.play(lwg.Enum.gongzhuAni.walk_gun, true);
        this.buffState = lwg.Enum.BuffState.stick;
        otherOwner.removeSelf();
    }

    /**和狗的碰撞*/
    dogAndPerson(other, self): void {
        let otherOwner = other.owner as Laya.Sprite;
        let otherOwnerName: string = otherOwner.name;
        this.attackSwitch = true;
        // 如果是移动的狗需要停止移动
        if (otherOwnerName.substring(0, 1) === 'm') {
            otherOwner['Dog'].eatFood = true;
        }
        if (this.buffState === lwg.Enum.BuffState.stick) {
            // 攻击完毕后才可以移动
            this.skeleton.play(lwg.Enum.gongzhuAni.attack_gun, false);
            this.skeleton.on(Laya.Event.LABEL, this, this.attackComplete, [otherOwner]);
        } else {
            lwg.Global._gameStart = false;
            this.targetP.x = this.self.x;
            this.targetP.y = this.self.y;
            this.skeleton.play(lwg.Enum.gongzhuAni.die, false);
            if (otherOwnerName.substring(0, 1) === 's') {
                otherOwner['UIMain_StaticDog'].skeleton.play(lwg.Enum.dogAni.walk, true);
            } else if (otherOwnerName.substring(0, 1) === 'm') {
                otherOwner['Dog'].skeleton.play(lwg.Enum.dogAni.walk, true);
            }
            // 延时出现失败界面
            Laya.timer.frameOnce(100, this, f => {
                this.selfScene['UIMain'].victory = false;

                lwg.Admin._openScene('UIPassHint', null, null, f => {
                    lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = lwg.Admin.SceneName.UIDefeated;
                });
            });
        }
    }

    attackComplete(otherOwner): void {
        let otherOwnerName = otherOwner.name;
        if (otherOwnerName.substring(0, 1) === 's') {
            let dogSk = otherOwner['UIMain_StaticDog'].skeleton;
            dogSk.play(lwg.Enum.dogAni.die, false);
            // dogSk.on(Laya.Event.LABEL, this, this.die);
        } else if (otherOwnerName.substring(0, 1) === 'm') {
            otherOwner['Dog'].skeleton.play(lwg.Enum.dogAni.die);
        }
        this.skeleton.play(lwg.Enum.gongzhuAni.walk_gun, true);
        this.attackSwitch = false;
        // 暂时没有插入死亡事件帧，延时后狗消失
        Laya.timer.frameOnce(30, this, f => {
            otherOwner.removeSelf();
        })
    }

    /**和墙壁的碰撞*/
    wallAndPerson(other, self): void {
        // 左右改变方向，并且是当前房间的
        if (this.moveDirection === lwg.Enum.PersonDir.left || this.moveDirection === lwg.Enum.PersonDir.right) {
            if (this.belongRoom === other.owner.parent) {
                this.changeDirection();
            }
        }
    }

    /**和任务目标碰撞*/
    wangziAndPerson(other, self): void {
        lwg.Global._gameStart = false;
        let otherOwner = other.owner as Laya.Sprite;
        let otherOwnerName: string = otherOwner.name;
        this.targetP.x = this.self.x;
        this.targetP.y = this.self.y;

        otherOwner['UIMain_Wangzi'].skeleton.play(lwg.Enum.wangziAni.win, true);
        this.skeleton.play(lwg.Enum.gongzhuAni.win, true);
        // 延时出现胜利界面
        this.selfScene['UIMain'].victoryAni();
    }

    /**人和地板的碰撞*/
    floorAndPerson(other, self): void {
        let otherOwner = other.owner as Laya.Sprite;
        let otherOwnerName: string = otherOwner.name;
        // 判断是否是悬空状态下来的，如果是那么换方向
        // console.log(otherOwnerName + '地板连接前是：' + this.personState);
        let belongName = otherOwnerName.substring(otherOwnerName.length - 5, otherOwnerName.length);
        if (this.belongRoom.name === belongName) {
            if (this.personState === lwg.Enum.MoveState.onLadder) {
                this.moveDirection = this.beforeLadderDir;
            } else if (this.personState === lwg.Enum.MoveState.inAir) {
                this.moveDirection = this.beforeInAirDir;
            }
            this.personState = lwg.Enum.MoveState.onFloor;
            this.currentFloor = otherOwner;
        }
        // console.log(otherOwnerName + '地板连接后' + this.personState);
    }

    /**和梯子的碰撞*/
    ladderAndPerson(other, self): void {
        let otherOwner = other.owner;
        let otherName: string = otherOwner.name;
        // 碰到梯子后，查看梯子上方的那个通道(两个名称序号唯一且匹配)是否打开，如果打开则，角色上去,并且X轴会被吸附在梯子上
        let otherNamelen = otherOwner.name.length;
        let num = otherOwner.name.substring(otherNamelen - 2, otherNamelen);
        let aisleName = 'up_Aisle_' + num;
        let upAisle = this.belongRoom.getChildByName(aisleName);
        // 如果是下面房间的梯子，则停止，并不会遇到
        if (!upAisle) {
            if (otherOwner.name.substring(0, 8) === 'ladder_a') {
                // console.log('这是自动上下梯子,直接上下');
                // 上下梯子有两个碰撞框梯子上面的控制上梯子，下面的控制下梯子
                // 在梯子上的时候不会切换状态
                if (this.personState !== lwg.Enum.MoveState.onLadder) {
                    if (other.y > otherOwner.width / 2) {
                        this.beforeLadderDir = this.moveDirection;
                        this.moveDirection = lwg.Enum.PersonDir.up;
                        this.personState = lwg.Enum.MoveState.onLadder;
                    } else {
                        // console.log('下去');
                        this.beforeLadderDir = this.moveDirection;
                        this.moveDirection = lwg.Enum.PersonDir.down;
                        this.personState = lwg.Enum.MoveState.onLadder;
                    }
                    this.currentLadder = otherOwner;
                }
            }
            return;
        }
        let upOpenSwitch = upAisle['UIMain_Aisle'].openSwitch;
        if (!upOpenSwitch) {
            // console.log('通道未打开，不会上梯子！');
        } else {
            // console.log(otherOwner.name + '连接梯子');
            // 如果角色的方向是左右能上梯子或者下梯子
            // 记录原来的左右方向
            if (this.personState === lwg.Enum.MoveState.onFloor) {
                this.beforeLadderDir = this.moveDirection;
                this.moveDirection = lwg.Enum.PersonDir.up;
                this.personState = lwg.Enum.MoveState.onLadder;
                // console.log('上梯子', '上梯子前的方向是：', this.beforeLadderDir);
            } else {
                // 下梯子时一定要开启梯子状态
                if (this.beforeInAirDir === lwg.Enum.PersonDir.left || this.beforeInAirDir === lwg.Enum.PersonDir.right) {
                    this.beforeLadderDir = this.beforeInAirDir;
                    this.personState = lwg.Enum.MoveState.onLadder;
                    this.moveDirection = lwg.Enum.PersonDir.down;
                }
            }
            this.currentLadder = otherOwner;
        }
    }

    /**和通道的碰撞规则*/
    aisleAndPerson(other, self): void {
        let otherOwner: Laya.Sprite = other.owner as Laya.Sprite;
        let otherName: string = otherOwner.name;
        let openSwitch = otherOwner['UIMain_Aisle'].openSwitch;
        let connectRoom = otherOwner['UIMain_Aisle'].connectRoom as Laya.Image;

        let otherDir = otherName.substring(0, 1);
        let selfDir = this.moveDirection.substring(0, 1);

        let oppositeAisle = otherOwner['UIMain_Aisle'].oppositeAisle;
        // 上下和左右方向执行的结果不相同
        if (otherDir === 'l' || otherDir === 'r') {
            if (!openSwitch) {
                // 必须是当前房间的通道才可以换方向
                let lrAisle = this.belongRoom.getChildByName(otherOwner.name);
                if (otherOwner === lrAisle) {
                    this.changeDirection();
                }
            } else {
                // 如果另一间屋子被连接，但是当前通道被关起来了，也不会进去
                if (oppositeAisle) {
                    let openSwitch_02 = oppositeAisle['UIMain_Aisle'].openSwitch;
                    if (!openSwitch_02) {
                        this.changeDirection();
                        return;
                    }
                }
                // 当前方向相同的这个通道是当前房间的通道，此时交换房间，但是因为两边都通，所以不改变方向
                // 给予空状态的原因是为了让碰到第二个房价地板的时候是自然状态，同时也为了防止另一种情况，那就是下落。
                // 方向必须一样，因为至于碰到自己当前房间的通道判断，另一个房间的通道是一直通行
                if (otherDir === selfDir) {
                    if (this.belongRoom !== connectRoom) {
                        this.belongRoom = connectRoom;
                        this._belongChange = true;
                        this.beforeInAirDir = this.moveDirection;
                        this.personState = lwg.Enum.MoveState.inAir;
                        // console.log('换房子', this.belongRoom.name);
                    }
                } else {
                    // 如果方向不相同则说明是另外一间屋子，则不作判断
                }
            }
        } else if (otherDir === 'd' || otherDir === 'u') {
            // 上下分别判断
            if (otherDir === 'd') {
                if (!openSwitch) {
                    // 还原方向
                    // console.log('啥也不做！');
                } else {
                    // 如果另一间屋子被连接，但是当前通道被关起来了，也不会进去
                    if (oppositeAisle) {
                        let openSwitch_02 = oppositeAisle['UIMain_Aisle'].openSwitch;
                        if (!openSwitch_02) {
                            // console.log('啥也不做！');
                            return;
                        }
                    }
                    // 此时方向向下，交换房间，可以通行，也会自动出地板，然后关掉地板，自动找到梯子
                    // 方向必须一样，因为至于碰到自己当前房间的通道判断，另一个房间的通道是一直通行
                    // 是同一个房间才会下去
                    if (selfDir === 'l' || selfDir === 'r') {
                        if (this.belongRoom !== connectRoom) {
                            this.belongRoom = connectRoom;
                            this._belongChange = true;
                            // 下梯子
                            this.beforeInAirDir = this.moveDirection;
                            this.personState = lwg.Enum.MoveState.inAir;
                            this.moveDirection = lwg.Enum.PersonDir.down;
                            // console.log('下通道连接，准备下去' + this.beforeInAirDir);
                        }
                    }
                }
            } else if (otherDir === 'u') {
                // 碰到上的情况只有一种，那就是从梯子上去碰到的，通则行，不同则改变方向
                if (openSwitch === false) {
                    // 必须是当前房间的通道才会改变方向
                    let upAisle = this.belongRoom.getChildByName(otherOwner.name);
                    if (otherOwner === upAisle) {
                        // console.log('上面不通换方向' + this.personState);
                        this.changeDirection();
                    }
                } else {
                    // 此时方向向上，交换房间，可以通行
                    // 方向必须一样，因为至于碰到自己当前房间的通道判断，另一个房间的通道是一直通行
                    if (otherDir === selfDir) {
                        if (this.belongRoom !== connectRoom) {
                            this.belongRoom = connectRoom;
                            this._belongChange = true;
                            // 此时把上楼梯时候的方向传递给空状态的方向
                            this.beforeInAirDir = this.beforeLadderDir;
                            this.personState = lwg.Enum.MoveState.inAir;
                            // console.log('向上交换房间');
                        }
                    }
                }
            }
        }
    }

    onTriggerExit(other, self): void {
        if (!lwg.Global._gameStart) {
            return;
        }
        // 在当前房间内的地板，退出后才改变状态，因为可能地板会交叉
        if (other.label === 'floor') {
            let belongName = other.owner.name.substring(other.owner.name.length - 5, other.owner.name.length);
            if (this.belongRoom.name === belongName) {
                // console.log(other.owner.name + '退出' + this.personState);
                // 如果是上梯子的状态则不做操作，因为上梯子优先级最高
                if (this.personState === lwg.Enum.MoveState.onLadder) {
                    // this.beforeInAirDir = this.moveDirection;
                    // this.personState = lwg.Enum.MoveState.inAir;
                    // this.moveDirection = lwg.Enum.PersonDir.down;
                    // console.log(other.owner.name + '退出' + this.personState);
                } else if (this.personState === lwg.Enum.MoveState.inAir) {
                    // console.log(other.owner.name + '退出' + this.personState);

                } else if (this.personState === lwg.Enum.MoveState.onFloor) {
                    this.beforeFloorDir = this.moveDirection;
                    this.personState = lwg.Enum.MoveState.inAir;
                    this.moveDirection = lwg.Enum.PersonDir.down;
                }
            }
        } else if (other.label === 'ladder') {
            let belongName = other.owner.name.substring(other.owner.name.length - 5, other.owner.name.length);
            if (this.belongRoom.name === belongName) {
                // 如果是上梯子的状态则不做操作，因为上梯子优先级最高
                if (this.personState === lwg.Enum.MoveState.onFloor) {
                    this.moveDirection = this.beforeFloorDir;
                    // console.log(other.owner.name + '退出' + this.personState);
                }
            }
        }
    }


    /**上下和左右互相改变方向*/
    changeDirection(): void {
        if (this.moveDirection === lwg.Enum.PersonDir.left) {
            this.moveDirection = lwg.Enum.PersonDir.right;

        } else if (this.moveDirection === lwg.Enum.PersonDir.right) {
            this.moveDirection = lwg.Enum.PersonDir.left;
            // console.log('换方向', this.moveDirection);

        } else if (this.moveDirection === lwg.Enum.PersonDir.up) {
            this.moveDirection = lwg.Enum.PersonDir.down;

        } else if (this.moveDirection === lwg.Enum.PersonDir.down) {
            this.moveDirection = lwg.Enum.PersonDir.up;
        }
        // console.log('换方向', this.moveDirection);
    }


    /**当前在攻击状态中*/
    public attackSwitch: boolean = false;
    speed: number = 2.5;
    /**角色的移动规则*/
    move() {
        if (this.attackSwitch) {
            this.rig.setVelocity({ x: 0, y: 0 });
            return;
        }
        if (this.moveDirection === lwg.Enum.PersonDir.left) {
            this.rig.setVelocity({ x: -this.speed, y: 0 });
            this.skeleton.scaleX = -1;
        } else if (this.moveDirection === lwg.Enum.PersonDir.right) {
            this.rig.setVelocity({ x: this.speed, y: 0 });
            this.skeleton.scaleX = 1;
        } else if (this.moveDirection === lwg.Enum.PersonDir.up) {
            this.rig.setVelocity({ x: 0, y: -6 });

        } else if (this.moveDirection === lwg.Enum.PersonDir.down) {
            this.rig.setVelocity({ x: 0, y: 6 });
        }
    }



    /**记录上一帧的参照房间的X位置，角色在当前帧需要补上这个偏移量*/
    _belongX: number = null;
    _belongY: number = null;
    /**记录当前的belongroom的变化，变化的一瞬间，_belongX将更换目标此时当前一帧为false*/
    _belongChange: boolean = false;
    /**偏移判断*/
    positionOffset(): void {
        // y轴位置一直在房间的地板上,判断当前在哪一个地板上，如果在房间和地板相互匹配，则被吸附在地板上
        // 因为有可能出现同时碰撞2个地板，所以地板的名称必须和房间匹配
        if (this.belongRoom) {
            switch (this.personState) {
                case lwg.Enum.MoveState.onFloor:
                    if (this.currentFloor) {
                        let y = this.currentFloor.y + this.belongRoom.y - this.belongRoom.height / 2;//世界坐标
                        this.self.y = y - 20;
                        this.positionOffsetXY();
                    }
                    break;
                case lwg.Enum.MoveState.onLadder:
                    if (this.currentLadder) {
                        let x = this.currentLadder.x + this.belongRoom.x - this.belongRoom.width / 2;//世界坐标
                        this.self.x = x;
                        this.positionOffsetXY();
                    }
                    break;
                case lwg.Enum.MoveState.inAir:
                    this.positionOffsetXY();
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 房间移动时，角色的位置给予房间移动量
    */
    positionOffsetXY(): void {
        if (!this._belongY || !this._belongX) {
            if (this.belongRoom) {
                this._belongX = this.belongRoom.x;
                this._belongY = this.belongRoom.y;
            }
        } else {
            // 当更换一次belongRoom，这次不进行任何位移
            if (this._belongChange) {
                this._belongY = null;
                this._belongChange = false;
            } else {
                let x = this.belongRoom.x - this._belongX;
                let y = this.belongRoom.y - this._belongY;
                this.self.x = this.self.x + x;
                this.self.y = this.self.y + y;
                this._belongX = this.belongRoom.x;
                this._belongY = this.belongRoom.y;
            }
        }
    }

    /**第二种移动方式，用于游戏结束，完全跟着房子走*/
    gameOverMove(): void {
        if (this.targetP) {
            this.positionOffsetXY();
        }
    }

    /**
    * 防止没有方向
    * 如果没有方向了，在房子的左边则右方向，如果在右边则左方向
   */
    noMoveDirection(): void {
        if (!this.moveDirection) {
            if (this.belongRoom) {
                if (this.self.x > this.belongRoom.x) {
                    this.moveDirection = lwg.Enum.PersonDir.left;
                } else {
                    this.moveDirection = lwg.Enum.PersonDir.right;
                }
            }
        } else {
            // if (condition) {

            // }
        }
    }

    /**
     * 固定角色的最终范围，一直处于当前房间内
     * 这样使角色不会掉下去
     * */
    scopeControl(): void {
        if (this.belongRoom) {
            if (this.self.x > this.belongRoom.x + this.belongRoom.width / 2 + 25) {
                this.self.x = this.belongRoom.x + this.belongRoom.width / 2 + 25;
            }
            if (this.self.x < this.belongRoom.x - this.belongRoom.width / 2 - 25) {
                this.self.x = this.belongRoom.x - this.belongRoom.width / 2 - 25;
            }
            if (this.self.y > this.belongRoom.y + this.belongRoom.height / 2 + 15) {
                this.self.y = this.belongRoom.y + this.belongRoom.height / 2 + 15;
            }
            if (this.self.y < this.belongRoom.y - this.belongRoom.height / 2 - 15) {
                this.self.y = this.belongRoom.y - this.belongRoom.height / 2 - 15;
            }
        }
    }

    onUpdate(): void {
        if (!lwg.Global._gameStart) {
            this.rig.setVelocity({ x: 0, y: 0 });
            this.gameOverMove();
            return;
        }
        this.noMoveDirection();
        this.move();
        this.positionOffset();
        this.scopeControl();
    }

    onDisable(): void {
    }
}