import { lwg } from "../Lwg_Template/lwg";

export default class UIMain_Interaction extends Laya.Script {
    /** 指代当前脚本挂载的节点*/
    private self: Laya.Image;
    /** 指代当前脚本挂载的节点*/
    private selfParent: Laya.Sprite;
    /**物理组件*/
    private rig: Laya.RigidBody;

    /**初始位置*/
    private firstPos: Laya.Point = new Laya.Point();

    /**当前这个方向的通道是否被打开，也就等同于当前房间的方向被另一个连接了*/
    private openSwitch: boolean = false;
    /**通过当前通道被连接的那个房子的引用*/
    private connectRoom: Laya.Image = null;
    /**对面通道是哪个通道*/
    private oppositeAisle: Laya.Sprite;

    /**当前是否被关闭，关闭后不进行任何操作,等角色走了还会打开*/
    private onOff: boolean = false;

    constructor() { super(); }

    onEnable(): void {
        this.self = this.owner as Laya.Image;
        this.selfParent = this.self.parent as Laya.Sprite;
        this.self['UIMain_Interaction'] = this;
        this.firstPos.x = this.self.x;
        this.firstPos.y = this.self.y;
        // this.interactionPicStyle('exit');
    }
    onTriggerEnter(other, self): void {
        // let otherName: string = other.owner.name;
        // let selfName: string = this.self.name;
        // // 如果是都是通道，那么连接上
        // if (other.label === 'interaction') {
        //     this.interactionPicStyle('enter');
        //     this.connectRoom = other.owner.parent as Laya.Image;
        //     this.oppositeAisle = other.owner;
        //     this.roomAdsorption();
        // }
    }

    /**
     * 感应图片的样式变化
     * @param type 两种情况，一种是进入碰撞，一种是离开碰撞
     * */
    interactionPicStyle(type): void {
        let interaction = this.self.getChildByName('interaction') as Laya.Image;
        let url1 = 'UI/40bacf8d-b069-4dc3-9d5e-ef2388ac0475.png';
        let url2 = 'UI/a9ac4633-ecea-444b-a066-86ee56f38166.png';
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
        let selfY = this.self.y + parent.y - parent.height / 2;;

        let diffX = posX - selfX;
        let diffY = posY - selfY;

        // 如果自己是被手触摸的那个房间，则移动过去
        let _roomMove = parent['UIMain_Room']._roomMove;
        if (!_roomMove && lwg.Global._roomPickup === parent) {
            parent.x += diffX;
            parent.y += diffY;
            // 此时触摸关闭，必须重新拾取
            parent['UIMain_Room']._roomMove = false;
            // 只吸附一次，拾取变为空
            lwg.Global._roomPickup = null;
        }
        // 如果距离太远则断开连接状态
        if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
            this.openSwitch = false;
            // console.log('断开连接！');
        } else {
            this.openSwitch = true;
            // console.log('打开连接');
        }
    }

    /**图片变化*/
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

    onTriggerExit(other, self): void {
        // // 断开通道之间的连接
        // let otherName: string = other.owner.name;
        // let selfName: string = this.self.name;
        // if (other.label === 'aisle') {
        //     this.interactionPicStyle('exit');
        //     // console.log('通道断开连接！');
        //     this.openSwitch = false;
        //     this.connectRoom = null;
        //     this.oppositeAisle = null;
        // }
    }

    onUpdate(): void {
        // if (this.connectRoom && this.oppositeAisle) {
        //     this.roomAdsorption();
        // }
        // this.styleChanges();
        this.self.x = this.firstPos.x;
        this.self.y = this.firstPos.y;
    }

    onDisable(): void {
    }
}