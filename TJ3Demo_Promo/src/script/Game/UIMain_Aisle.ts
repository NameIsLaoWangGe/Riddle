import { lwg } from "../Lwg_Template/lwg";

export default class UIMain_Aisle extends lwg.Admin.Object {
    /**物理组件*/
    rig: Laya.RigidBody;
    /**当前这个方向的通道是否被打开，也就等同于当前房间的方向被另一个连接了*/
    openSwitch: boolean = false;
    /**对面被连接的是哪个通道*/
    oppositeAisle: Laya.Sprite = null;
    /**对面被连接的是哪个房子*/
    connectRoom: Laya.Image = null;

    constructor() { super(); }

    lwgInit() {
        this.interactionPicStyle('exit');
        this.colorFormat();
    }

    /**根据房间的颜色初始化通道图片的颜色和格式*/
    colorFormat(): void {
        let parent = this.self.parent as Laya.Image;
        let pSkin = parent.skin;

        let wall = this.self.getChildByName('wall') as Laya.Image;
        let color = this.self.getChildByName('color') as Laya.Image;

        switch (pSkin) {
            case lwg.Enum.RoomSkin.blue:
                wall.skin = lwg.Enum.WallSkin.blue;
                color.skin = lwg.Enum.AisleColorSkin.blue;
                break;

            case lwg.Enum.RoomSkin.bluish:
                wall.skin = lwg.Enum.WallSkin.bluish;
                color.skin = lwg.Enum.AisleColorSkin.bluish;
                break;

            case lwg.Enum.RoomSkin.grass:
                wall.skin = lwg.Enum.WallSkin.grass;
                color.skin = lwg.Enum.AisleColorSkin.grass;

                break;

            case lwg.Enum.RoomSkin.green:
                wall.skin = lwg.Enum.WallSkin.green;
                color.skin = lwg.Enum.AisleColorSkin.green;
                break;

            case lwg.Enum.RoomSkin.pink:
                wall.skin = lwg.Enum.WallSkin.pink;
                color.skin = lwg.Enum.AisleColorSkin.pink;
                break;

            case lwg.Enum.RoomSkin.purple:
                wall.skin = lwg.Enum.WallSkin.purple;
                color.skin = lwg.Enum.AisleColorSkin.purple;
                break;

            case lwg.Enum.RoomSkin.red:
                wall.skin = lwg.Enum.WallSkin.red;
                color.skin = lwg.Enum.AisleColorSkin.red;
                break;

            case lwg.Enum.RoomSkin.yellow:
                wall.skin = lwg.Enum.WallSkin.yellow;
                color.skin = lwg.Enum.AisleColorSkin.yellow;
                break;

            case lwg.Enum.RoomSkin.yellowish:
                wall.skin = lwg.Enum.WallSkin.yellowish;
                color.skin = lwg.Enum.AisleColorSkin.yellowish;
                break;

            default:
                break;
        }
    }

    onTriggerEnter(other, self): void {
        let otherName: string = other.owner.name;
        let selfName: string = this.self.name;
        // 如果是都是通道，那么连接上
        if (other.label === 'aisle' && self.label === 'aisle') {
        } else if (other.label === 'interaction' && self.label === 'interaction') {
            let n1 = otherName.substring(0, 1);
            let n2 = selfName.substring(0, 1);
            if ((n1 === 'l' && n2 === 'r') || (n1 === 'r' && n2 === 'l') || (n1 === 'u' && n2 === 'd') || (n1 === 'd' && n2 === 'u')) {
                this.connectRoom = other.owner.parent as Laya.Image;
                this.oppositeAisle = other.owner;
                // console.log('开始感应', n1, n2);
                this.interactionPicStyle('enter');
                // this.roomAdsorption();
            }
        }
    }

    /**
     * 感应图片的样式变化
     * @param type 两种情况，一种是进入碰撞，一种是离开碰撞
     * */
    interactionPicStyle(type): void {
        let interaction = this.self.getChildByName('interaction') as Laya.Image;
        let url1 = 'Room/ui_interaction_01.png';
        let url2 = 'Room/ui_interaction_02.png';
        if (type === 'enter') {
            interaction.skin = url2;
        } else if (type === 'exit') {
            interaction.skin = url1;
        }
    }

    /**吸附到对面的房子那里*/
    roomAdsorption(): void {
        // 求出两个通道的世界坐标
        let posX = this.oppositeAisle.x + this.connectRoom.x - this.connectRoom.width / 2;
        let posY = this.oppositeAisle.y + this.connectRoom.y - this.connectRoom.height / 2;

        let parent = this.self.parent as Laya.Image;
        let selfX = this.self.x + parent.x - parent.width / 2;;
        let selfY = this.self.y + parent.y - parent.height / 2;

        let diffX = posX - selfX;
        let diffY = posY - selfY;

        // 距离太远并不会被吸附，是个bug未解决，现在只是做预防
        if ((Math.abs(diffX) > 100 || Math.abs(diffY) > 100)) {
            return;
        }
        // 如果自己是被手触摸的那个房间，则移动过去
        let _roomMove = parent['UIMain_Room']._roomMove;
        if (!_roomMove && lwg.Global._roomPickup === parent) {
            // 此处可以用Tween动画
            Laya.Tween.clearAll(this);
            lwg.Animation.move_Simple(parent, parent.x, parent.y, parent.x + diffX, parent.y + diffY, 10, 0, f => { });
            // parent.x += diffX;
            // parent.y += diffY;
            // 此时触摸关闭，必须重新拾取
            parent['UIMain_Room']._roomMove = false;
            // 只吸附一次。
            lwg.Global._roomPickup = null;

            lwg.Effects.createCommonExplosion(Laya.stage, 15, posX, posY);

        }
        // 如果距离太远则断开连接状态
        // 可以分开控制开关，通过判断通道是上下还是左右,因为上下的时候是X轴距离大些，左右的时候Y轴距离错开点也不会断开，比较人性化
        if ((Math.abs(diffX) > 10 || Math.abs(diffY) > 10) || parent['UIMain_Room']._roomMove) {
            this.openSwitch = false;
            let wangzi = this.selfScene['UIMain'].Wangzi;
            wangzi['UIMain_Wangzi'].gzConnect = false;

            if (lwg.Global._gameLevel === 1 && this.selfScene['Finger'] && this.selfScene['Wangzi']['UIMain_Wangzi'].belongRoom !== this.selfScene['Gongzhu']['UIMain_Gongzhu'].belongRoom) {
                if (this.selfScene['Finger']) {
                    this.selfScene['Finger'].alpha = 1;
                    this.selfScene['guideRoom'].alpha = 0.3;
                }
            }
            // console.log('断开连接！');
        } else {
            this.openSwitch = true;
            this.gzAndWzConnect();
            // console.log('打开连接');
            if (lwg.Global._gameLevel === 1 && this.selfScene['Finger']) {
                if (this.selfScene['Finger']) {
                    this.selfScene['Finger'].alpha = 0;
                    this.selfScene['guideRoom'].alpha = 0;
                }
            }
        }
    }

    /**子节点的图片变化*/
    styleChanges(): void {
        let interaction = this.self.getChildByName('interaction') as Laya.Image;
        let color = this.self.getChildByName('color') as Laya.Image;
        let wall = this.self.getChildByName('wall') as Laya.Image;
        if (this.openSwitch) {
            interaction.alpha = 0;
            color.alpha = 0;
            wall.alpha = 1;
        } else {
            interaction.alpha = 1;
            color.alpha = 1;
            wall.alpha = 0;
        }
    }
    /**
     * 判断被连接的房间是否一个是王子的一个是公主的
     * 主要用于当公主所在的房间和王子所在的房间联通，王子会移动到公主的房间
    */
    gzAndWzConnect(): void {
        let gongzhu = this.selfScene['UIMain'].Gongzhu;
        let wangzi = this.selfScene['UIMain'].Wangzi;
        let gongzhuRoom = gongzhu['UIMain_Gongzhu'].belongRoom;
        let wangziRoom = wangzi['UIMain_Wangzi'].belongRoom;
        let parent = this.self.parent as Laya.Image;
        if ((gongzhuRoom === parent && wangziRoom === this.connectRoom) || (wangziRoom === parent && gongzhuRoom === this.connectRoom)) {
            // console.log('公主的房间和王子的房间连接了！');
            wangzi['UIMain_Wangzi'].gzConnect = true;
        }
    }

    onTriggerExit(other, self): void {
        // 断开通道之间的连接
        let otherName: string = other.owner.name;
        let selfName: string = this.self.name;
        if (other.label === 'aisle' && self.label === 'aisle') {
        } else if (other.label === 'interaction' && self.label === 'interaction') {
            this.openSwitch = false;
            this.connectRoom = null;
            this.oppositeAisle = null;
            // 必须相对方向的才可以连接 
            let n1 = otherName.substring(0, 1);
            let n2 = selfName.substring(0, 1);
            this.interactionPicStyle('exit');
            // console.log('失去感应', n1, n2);
        }
    }

    /**进行第二层判断，判断当与其他房子离得太远的时候全部取消连接*/
    roomDistanceJudge(): void {
        let parent = this.self.parent as Laya.Image;
        for (let index = 0; index < this.selfScene.numChildren; index++) {
            const element = this.selfScene.getChildAt(index) as Laya.Image;
            if (element.name.substring(0, 4) === 'Room' && element !== parent) {
                if (this.self.name.substring(0, 1) === 'l' || this.self.name.substring(0, 1) === 'r') {
                    if (Math.abs(element.x - parent.x) > element.width / 2 + parent.width / 2 + 100) {
                        this.interactionPicStyle('exit');
                    }
                } else if (this.self.name.substring(0, 1) === 'u' || this.self.name.substring(0, 1) === 'd') {
                    if (Math.abs(element.y - parent.y) > element.height / 2 + parent.height / 2 + 100) {
                        this.interactionPicStyle('exit');
                    }
                }
            }
        }
    }

    onUpdate(): void {
        if (this.connectRoom && this.oppositeAisle) {
            this.roomAdsorption();
        }
        this.styleChanges();
    }

    onDisable(): void {
    }
}