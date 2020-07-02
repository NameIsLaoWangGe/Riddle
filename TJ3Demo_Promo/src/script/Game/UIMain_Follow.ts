import { lwg } from "../Lwg_Template/lwg";

export default class UIMain_Follow extends lwg.Admin.Object {
    /**骨骼动画*/
    public skeleton: Laya.Skeleton;
    /**初始位置*/
    private firstPos: Laya.Point = new Laya.Point();
    constructor() { super(); }

    lwgInit() {
        this.self = this.owner as Laya.Sprite;
        let parent = this.self.parent as Laya.Image;
        // 设置y轴的高度

        this.posAndFormat();
    }

    /**设置通道的样式和位置*/
    posAndFormat(): void {
        let boxColLabel = this.self.getComponent(Laya.BoxCollider).label;
        if (boxColLabel === 'aisle') {
            let parent = this.self.parent as Laya.Image;
            let pSkin = parent.skin;

            let wall = this.self.getChildByName('wall') as Laya.Image;
            let color = this.self.getChildByName('color') as Laya.Image;

            let interaction = this.self.getChildByName('interaction') as Laya.Image;
            interaction.width = 76;
            interaction.height = 32;
            interaction.pivotX = 0;
            interaction.pivotY = 0;

            this.self.width = 82;
            this.self.height = 48;

            let nameStr = this.self.name.substring(0, 1);
            if (nameStr === 'd' || nameStr === 'u') {
                if (nameStr === 'd') {
                    this.self.pivotY = 14;
                    this.self.y = parent.height - 1;

                    wall.x = 41.5;
                    wall.y = 6;

                    color.x = 41.5;
                    color.y = 7;

                    wall.width = 81;
                    wall.height = 17.5;
                    color.width = 81;
                    color.height = 16;

                    interaction.x = 80;
                    interaction.y = 47;

                } else if (nameStr === 'u') {
                    this.self.pivotY = 32;
                    this.self.y = 0;

                    wall.x = 41.5;
                    wall.y = 39.5;

                    color.x = 41.5;
                    color.y = 40;


                    wall.width = 81;
                    wall.height = 17;
                    color.width = 81;
                    color.height = 16;


                    interaction.x = 3;
                    interaction.y = 1;
                }
            } else if (nameStr === 'l' || nameStr === 'r') {
                if (nameStr === 'l') {
                    this.self.pivotX = 33.5;
                    this.self.x = 0;
                    wall.x = 42;
                    wall.y = 41.5;
                    color.x = 42;
                    color.y = 42;

                    wall.width = 81;
                    wall.height = 17;
                    color.width = 81;
                    color.height = 16;


                    interaction.x = 0.5;
                    interaction.y = 80;

                } else if (nameStr === 'r') {
                    this.self.pivotX = 15;
                    this.self.x = parent.width - 1;
                    wall.x = 8;
                    wall.y = 41.5;
                    color.x = 8;
                    color.y = 42;

                    wall.width = 81;
                    wall.height = 17;
                    color.width = 81;
                    color.height = 16;


                    interaction.x = 47;
                    interaction.y = 2;

                }
            }

        }
        this.firstPos.y = this.self.y;
        this.firstPos.x = this.self.x;
    }

    lwgOnUpdate(): void {
        if (this.self.name !== 'Person') {
            this.self.x = this.firstPos.x;
            this.self.y = this.firstPos.y;
        }
    }

    onDisable(): void {
    }
}