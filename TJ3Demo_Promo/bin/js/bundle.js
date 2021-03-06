(function () {
    'use strict';

    class PromoOpen extends Laya.Script {
        constructor() {
            super(...arguments);
            this.target = null;
        }
        onClick() {
            this.target.active = this.target.visible = true;
        }
    }

    class ButtonScale extends Laya.Script {
        constructor() {
            super(...arguments);
            this.time = .1;
            this.ratio = 1.04;
            this.startScaleX = 1;
            this.startScaleY = 1;
            this.scaled = false;
        }
        onAwake() {
            this.owner.on(Laya.Event.MOUSE_DOWN, null, () => { this.ScaleBig(); });
            this.owner.on(Laya.Event.MOUSE_UP, null, () => { this.ScaleSmall(); });
            this.owner.on(Laya.Event.MOUSE_OUT, null, () => { this.ScaleSmall(); });
        }
        ScaleBig() {
            if (this.scaled)
                return;
            this.scaled = true;
            Laya.Tween.to(this.owner, { scaleX: this.startScaleX * this.ratio, scaleY: this.startScaleY * this.ratio }, this.time * 1000);
        }
        ScaleSmall() {
            if (!this.scaled)
                return;
            this.scaled = false;
            Laya.Tween.to(this.owner, { scaleX: this.startScaleX, scaleY: this.startScaleY }, this.time * 1000);
        }
    }

    class PromoItem extends Laya.Script {
        constructor() {
            super(...arguments);
            this.bgImage = null;
            this.iconImage = null;
            this.nameText = null;
            this.infoText = null;
            this.flag1 = null;
            this.flag2 = null;
            this.flag3 = null;
        }
        onAwake() {
            this.bgImage = this.owner.getChildByName("bg");
            this.iconImage = this.owner.getChildByName("icon");
            if (this.iconImage != null) {
                this.flag1 = this.iconImage.getChildByName("flag1");
                this.flag2 = this.iconImage.getChildByName("flag2");
                this.flag3 = this.iconImage.getChildByName("flag3");
            }
            this.nameText = this.owner.getChildByName("name");
            this.infoText = this.owner.getChildByName("info");
        }
        DoLoad() {
            if (this.data == null)
                return;
            if (this.iconImage != null)
                this.iconImage.skin = this.data.icon;
            if (this.nameText != null)
                this.nameText.text = this.data.title;
            this.SetFlag();
        }
        SetFlag() {
            if (this.flag1 != null)
                this.flag1.active = this.flag1.visible = false;
            if (this.flag2 != null)
                this.flag2.active = this.flag2.visible = false;
            if (this.flag3 != null)
                this.flag3.active = this.flag3.visible = false;
            switch (this.data.tag) {
                case 1:
                    if (this.flag1 != null)
                        this.flag1.active = this.flag1.visible = true;
                    break;
                case 2:
                    if (this.flag2 != null)
                        this.flag2.active = this.flag2.visible = true;
                    break;
                case 3:
                    if (this.flag3 != null)
                        this.flag3.active = this.flag3.visible = true;
                    break;
            }
        }
        OnShow() {
            this.data.ReportShow();
        }
        OnClick() {
            this.data.Click();
            if (this.onClick_ != null) {
                this.onClick_(this);
            }
        }
        onClick() {
            this.OnClick();
        }
    }

    class Behaviour extends Laya.Script {
        constructor() {
            super(...arguments);
            this.isAwake = false;
            this.isStart = false;
            this.isEnable = false;
            this.isDestroy = false;
        }
        OnAwake() { }
        OnStart() { }
        OnUpdate() { }
        OnEnable() { }
        OnDisable() { }
        OnDestroy() { }
        DoAwake() {
            if (!this.active)
                return;
            if (!this.isAwake) {
                this.isAwake = true;
                this.OnAwake();
            }
        }
        DoStart() {
            if (!this.active)
                return;
            if (!this.isStart) {
                this.isStart = true;
                this.OnStart();
            }
        }
        DoUpdate() {
            if (!this.active)
                return;
            if (this.isStart) {
                this.OnUpdate();
            }
        }
        DoEnable() {
            if (!this.active)
                return;
            if (!this.isEnable) {
                this.isEnable = true;
                this.OnEnable();
            }
        }
        DoDisable() {
            if (this.isEnable) {
                this.isEnable = false;
                this.OnDisable();
            }
        }
        DoDestroy() {
            if (!this.isDestroy) {
                this.isDestroy = true;
                this.OnDestroy();
            }
        }
        onAwake() {
            this.DoAwake();
        }
        onStart() {
            this.DoAwake();
            this.DoStart();
        }
        onUpdate() {
            this.DoAwake();
            this.DoEnable();
            this.DoStart();
            this.DoUpdate();
        }
        onEnable() {
            this.DoAwake();
            this.DoEnable();
            this.DoStart();
        }
        onDisable() {
            this.DoDisable();
        }
        onDestroy() {
            this.DoDestroy();
        }
        static SetActive(node, value) {
            if (node == null)
                return;
            node.active = value;
            if (node instanceof Laya.Box) {
                node.visible = value;
            }
        }
        static GetActive(node) {
            if (node == null)
                return false;
            if (!node.active)
                return false;
            if (node instanceof Laya.Box) {
                if (!node.visible)
                    return false;
            }
            return true;
        }
        get active() {
            return Behaviour.GetActive(this.owner);
        }
        set active(value) {
            Behaviour.SetActive(this.owner, value);
            if (value) {
                this.DoEnable();
            }
            else {
                this.DoDisable();
            }
        }
    }

    class P201 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoItem = null;
            this.shake = false;
            this.animTime = 0;
            this.refrTime = 0;
        }
        async OnAwake() {
            this.promoItem = this.owner.getComponent(PromoItem);
            TJ.Develop.Yun.Promo.Data.ReportAwake(P201.style);
            this.promoItem.style = P201.style;
            this.active = false;
            if (Laya.Browser.onIOS && TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                return;
            }
            if (P201.promoList == null) {
                let list = await TJ.Develop.Yun.Promo.List.Get(P201.style);
                if (P201.promoList == null)
                    P201.promoList = list;
            }
            if (P201.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P201.style);
                this.active = true;
            }
            else {
                this.owner.destroy();
            }
        }
        OnEnable() {
            this.LoadAndShowIcon();
        }
        OnDisable() {
            if (P201.promoList != null) {
                P201.promoList.Unload(this.promoItem.data);
            }
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            this.refrTime += deltaTime;
            if (this.refrTime > 5) {
                this.refrTime -= 5;
                this.LoadAndShowIcon();
            }
            if (!this.shake)
                return;
            this.animTime += deltaTime;
            this.animTime %= 2.5;
            if (this.animTime <= .75) {
                this.promoItem.owner.rotation = Math.sin(this.animTime * 6 * Math.PI) * 25 * (1 - this.animTime / .75);
            }
            else {
                this.promoItem.owner.rotation = 0;
            }
        }
        LoadIcon() {
            let data = P201.promoList.Load();
            if (data != null) {
                P201.promoList.Unload(this.promoItem.data);
                this.promoItem.data = data;
                this.promoItem.onClick_ = () => { this.LoadAndShowIcon(); };
                this.promoItem.DoLoad();
            }
            return data;
        }
        LoadAndShowIcon() {
            if (this.LoadIcon() != null) {
                this.promoItem.OnShow();
            }
            else {
                if (this.promoItem.data == null) {
                    this.owner.destroy();
                }
            }
        }
    }
    P201.style = "P201";
    P201.promoList = null;

    class P202 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.scroll = null;
            this.layout = null;
            this.prefab = null;
            this.paddingTop = 10;
            this.paddingBottom = 10;
            this.line = 0;
            this.column = 0;
            this.toTop = false;
            this.showing = [];
        }
        async OnAwake() {
            this.scroll = this.owner.getChildByName("scroll");
            this.layout = this.scroll.getChildByName("layout");
            this.prefab = this.layout.getCell(0);
            let w = this.owner.width - this.paddingTop - this.paddingBottom;
            while (w >= this.prefab.width) {
                w = w - this.prefab.width - this.layout.spaceX;
                this.column++;
            }
            TJ.Develop.Yun.Promo.Data.ReportAwake(P202.style);
            this.active = false;
            if (Laya.Browser.onIOS && TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                return;
            }
            this.promoList = await TJ.Develop.Yun.Promo.List.Get(P202.style);
            if (this.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P202.style);
                this.line = Math.ceil(this.promoList.count / this.column);
                this.layout.repeatX = this.column;
                this.layout.repeatY = this.line;
                for (let i = 0; i < this.layout.cells.length; i++) {
                    let node = this.layout.getCell(i);
                    if (i < this.promoList.count) {
                        let item = node.getComponent(PromoItem);
                        if (item != null) {
                            this.itemList.push(item);
                            item.style = P202.style;
                        }
                        Behaviour.SetActive(node, true);
                    }
                    else {
                        Behaviour.SetActive(node, false);
                    }
                }
                this.line = Math.ceil(this.itemList.length / this.column);
                let h = this.paddingTop + this.paddingBottom;
                h += this.prefab.height * this.line + this.layout.spaceY * (this.line - 1);
                this.layout.height = h;
                if (this.scroll.height < this.layout.height) {
                    this.scroll.vScrollBarSkin = "";
                    this.scroll.vScrollBar.rollRatio = 0;
                }
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
                this.active = true;
            }
            else {
                this.owner.destroy();
            }
        }
        async OnDisable() {
            this.promoList = await TJ.Develop.Yun.Promo.List.Get(P202.style);
            for (let item of this.itemList) {
                this.LoadIcon(item);
            }
        }
        get maxTop() {
            return 0;
        }
        get maxBottom() {
            let y = this.paddingTop + this.paddingBottom;
            y += this.prefab.height * this.line + this.layout.spaceY * (this.line - 1) - this.scroll.height;
            return y;
        }
        get scrollValue() {
            if (this.scroll.vScrollBar != null) {
                return this.scroll.vScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scroll.vScrollBar != null) {
                this.scroll.vScrollBar.value = v;
            }
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            if (this.scroll.height < this.layout.height) {
                if (this.scrollValue <= this.maxTop) {
                    this.toTop = false;
                }
                else if (this.scrollValue >= this.maxBottom) {
                    this.toTop = true;
                }
                if (this.toTop) {
                    this.scrollValue -= 50 * deltaTime;
                }
                else {
                    this.scrollValue += 50 * deltaTime;
                }
            }
            else {
                this.scrollValue = this.maxTop;
            }
            this.CheckShow();
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadAndShowIcon(item); };
                promoItem.DoLoad();
                promoItem.infoText.text = 1 + Math.floor(Math.random() * 40) / 10 + "w人在玩";
            }
            return data;
        }
        LoadAndShowIcon(promoItem) {
            if (this.LoadIcon(promoItem) != null) {
                promoItem.OnShow();
            }
        }
        CheckShow() {
            for (let item of this.itemList) {
                let i = this.showing.indexOf(item);
                let node = item.owner;
                let d = Math.abs(-node.y - this.paddingTop - this.prefab.height / 2 + this.scrollValue + this.scroll.height / 2);
                if (d < this.scroll.height / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
    }
    P202.style = "P202";

    class P204 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.scroll = null;
            this.layout = null;
            this.prefab = null;
            this.paddingLeft = 20;
            this.paddingRight = 20;
            this.toLeft = false;
            this.showing = [];
        }
        async OnAwake() {
            this.scroll = this.owner.getChildByName("scroll");
            this.layout = this.scroll.getChildByName("layout");
            this.prefab = this.layout.getCell(0);
            TJ.Develop.Yun.Promo.Data.ReportAwake(P204.style);
            this.active = false;
            if (Laya.Browser.onIOS && TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                return;
            }
            let list = await TJ.Develop.Yun.Promo.List.Get(P204.style);
            if (this.promoList == null)
                this.promoList = list;
            if (this.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P204.style);
                this.layout.repeatX = this.promoList.count;
                for (let i = 0; i < this.layout.cells.length; i++) {
                    let node = this.layout.getCell(i);
                    if (i < this.promoList.count) {
                        let item = node.getComponent(PromoItem);
                        if (item != null) {
                            this.itemList.push(item);
                            item.style = P204.style;
                        }
                        node.active = node.visible = true;
                    }
                    else {
                        node.active = node.visible = false;
                    }
                }
                let w = this.paddingLeft + this.paddingRight;
                w += this.prefab.width * this.itemList.length + this.layout.spaceX * (this.itemList.length - 1);
                this.layout.width = w;
                if (this.scroll.width < this.layout.width) {
                    this.scroll.hScrollBarSkin = "";
                    this.scroll.hScrollBar.rollRatio = 0;
                }
                this.layout.width = w;
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
                this.active = true;
            }
            else {
                this.owner.destroy();
            }
        }
        get maxLeft() {
            let x = 0;
            return x;
        }
        get maxRight() {
            let x = this.scroll.hScrollBar.max;
            return x;
        }
        get scrollValue() {
            if (this.scroll.hScrollBar != null) {
                return this.scroll.hScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scroll.hScrollBar != null) {
                this.scroll.hScrollBar.value = v;
            }
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            if (this.scroll.width < this.layout.width) {
                if (this.scrollValue >= this.maxRight) {
                    this.toLeft = true;
                }
                else if (this.scrollValue <= this.maxLeft) {
                    this.toLeft = false;
                }
                if (this.toLeft) {
                    this.scrollValue -= 50 * deltaTime;
                }
                else {
                    this.scrollValue += 50 * deltaTime;
                }
            }
            else {
                this.layout.x = this.maxLeft;
            }
            this.CheckShow();
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadIcon(item); };
                promoItem.DoLoad();
                let i = this.showing.indexOf(promoItem);
                if (i >= 0) {
                    this.showing.splice(i, 1);
                }
            }
            return data;
        }
        CheckShow() {
            for (let item of this.itemList) {
                let node = item.owner;
                let d = Math.abs(node.x - this.scrollValue - this.scroll.width / 2 + node.width / 2 + this.layout.spaceX);
                let i = this.showing.indexOf(item);
                if (d < this.scroll.width / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
    }
    P204.style = "P204";

    class P205 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.scroll = null;
            this.layout = null;
            this.prefab = null;
            this.paddingTop = 10;
            this.paddingBottom = 10;
            this.move = null;
            this.show = null;
            this.hide = null;
            this.maxX = 620;
            this.line = 0;
            this.column = 0;
            this.targetX = 0;
            this.showing = [];
        }
        async OnAwake() {
            this.move = this.owner.getChildByName("move");
            let button = this.move.getChildByName("button");
            this.show = button.getChildByName("show");
            this.hide = button.getChildByName("hide");
            let board = this.move.getChildByName("board");
            this.scroll = board.getChildByName("scroll");
            this.layout = this.scroll.getChildByName("layout");
            this.prefab = this.layout.getCell(0);
            this.show.clickHandler = new Laya.Handler(null, () => { this.Show(); });
            this.hide.clickHandler = new Laya.Handler(null, () => { this.Hide(); });
            let w = this.scroll.width - this.paddingTop - this.paddingBottom;
            while (w >= this.prefab.width) {
                w = w - this.prefab.width - this.layout.spaceX;
                this.column++;
            }
            TJ.Develop.Yun.Promo.Data.ReportAwake(P205.style);
            if (this.show.parent.scaleX < 0)
                this.maxX = -this.maxX;
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                if (Laya.Browser.onIOS && TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                    this.active = false;
                    return;
                }
                return;
            }
            this.promoList = await TJ.Develop.Yun.Promo.List.Get(P205.style);
            if (this.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P205.style);
                this.line = Math.ceil(this.promoList.count / this.column);
                this.layout.repeatX = this.column;
                this.layout.repeatY = this.line;
                for (let i = 0; i < this.layout.cells.length; i++) {
                    let node = this.layout.getCell(i);
                    if (i < this.promoList.count) {
                        let item = node.getComponent(PromoItem);
                        if (item != null) {
                            this.itemList.push(item);
                            item.style = P205.style;
                        }
                        node.active = node.visible = true;
                    }
                    else {
                        node.active = node.visible = false;
                    }
                }
                this.line = Math.ceil(this.itemList.length / this.column);
                let h = this.paddingTop + this.paddingBottom;
                h += this.prefab.height * this.line + this.layout.spaceY * (this.line - 1);
                this.layout.height = h;
                if (this.scroll.height < this.layout.height) {
                    this.scroll.vScrollBarSkin = "";
                    this.scroll.vScrollBar.rollRatio = 0;
                }
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
                this.active = true;
            }
            else {
                this.owner.destroy();
            }
        }
        get scrollValue() {
            if (this.scroll.vScrollBar != null) {
                return this.scroll.vScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scroll.vScrollBar != null) {
                this.scroll.vScrollBar.value = v;
            }
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadAndShowIcon(item); };
                promoItem.DoLoad();
            }
            return data;
        }
        LoadAndShowIcon(promoItem) {
            if (this.LoadIcon(promoItem) != null) {
                promoItem.OnShow();
            }
        }
        Show() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                let param = new TJ.API.Promo.Param();
                param.extraData = { "TJ_App": TJ.API.AppInfo.AppGuid() };
                TJ.API.Promo.Pop(param);
                return;
            }
            this.targetX = this.maxX;
            this.show.active = this.show.visible = false;
            this.hide.active = this.hide.visible = true;
            this.scrollValue = 0;
        }
        Hide() {
            this.targetX = 0;
            this.showing = [];
        }
        OnUpdate() {
            let deltaTime = Laya.timer.delta / 1000;
            if (this.move.centerX != this.targetX) {
                let d = this.targetX - this.move.centerX;
                let s = 3000 * deltaTime;
                if (d > 0) {
                    d = Math.min(this.move.centerX + s, this.targetX);
                }
                else {
                    d = Math.max(this.move.centerX - s, this.targetX);
                }
                this.move.centerX = d;
                if (this.move.centerX == 0) {
                    this.show.active = this.show.visible = true;
                    this.hide.active = this.hide.visible = false;
                    window.setTimeout(async () => {
                        this.promoList = await TJ.Develop.Yun.Promo.List.Get(P205.style);
                        for (let item of this.itemList) {
                            this.LoadIcon(item);
                        }
                    }, 0);
                }
            }
            else {
                if (this.move.centerX == this.maxX) {
                    this.CheckShow();
                }
            }
        }
        CheckShow() {
            for (let item of this.itemList) {
                let i = this.showing.indexOf(item);
                let node = item.owner;
                let d = Math.abs(-node.y - this.paddingTop - this.prefab.height / 2 + this.scrollValue + this.scroll.height / 2);
                if (d < this.scroll.height / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
    }
    P205.style = "P205";

    class P106 extends Behaviour {
        constructor() {
            super(...arguments);
            this.promoList = null;
            this.itemList = [];
            this.layout = null;
            this.showing = [];
        }
        async OnAwake() {
            this.scrollView = this.owner.getChildByName("scroll");
            this.layout = this.scrollView.getChildByName("layout");
            this.scrollView.vScrollBarSkin = "";
            let close = this.owner.getChildByName("close");
            close.clickHandler = new Laya.Handler(null, () => { this.OnClose(); });
            TJ.Develop.Yun.Promo.Data.ReportAwake(P106.style);
            this.active = false;
            if (Laya.Browser.onIOS && TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
                return;
            }
            let list = await TJ.Develop.Yun.Promo.List.Get(P106.style);
            if (this.promoList == null)
                this.promoList = list;
            if (this.promoList.count > 0) {
                TJ.Develop.Yun.Promo.Data.ReportStart(P106.style);
                this.layout.repeatY = this.promoList.count;
                let h = 0;
                for (let i = 0; i < this.layout.cells.length; i++) {
                    let node = this.layout.getCell(i);
                    if (i < this.promoList.count) {
                        let item = node.getComponent(PromoItem);
                        if (item != null) {
                            this.itemList.push(item);
                            item.style = P106.style;
                        }
                        Behaviour.SetActive(node, true);
                    }
                    else {
                        Behaviour.SetActive(node, false);
                    }
                    if (i > 0) {
                        h += this.layout.spaceY;
                    }
                    h += node.height;
                }
                this.layout.height = h;
                for (let item of this.itemList) {
                    this.LoadIcon(item);
                }
                this.active = true;
            }
            else {
                this.owner.destroy();
            }
        }
        OnEnable() {
            this.scrollValue = 0;
        }
        async OnDisable() {
            this.promoList = await TJ.Develop.Yun.Promo.List.Get(P106.style);
            for (let item of this.itemList) {
                this.LoadIcon(item);
            }
        }
        OnUpdate() {
            this.CheckShow();
        }
        LoadIcon(promoItem) {
            let data = this.promoList.Load();
            if (data != null) {
                this.promoList.Unload(promoItem.data);
                promoItem.data = data;
                promoItem.onClick_ = (item) => { this.LoadIcon(item); };
                promoItem.DoLoad();
                let i = this.showing.indexOf(promoItem);
                if (i >= 0) {
                    this.showing.splice(i, 1);
                }
            }
            return data;
        }
        get scrollValue() {
            if (this.scrollView.vScrollBar != null) {
                return this.scrollView.vScrollBar.value;
            }
            return 0;
        }
        set scrollValue(v) {
            if (this.scrollView.vScrollBar != null) {
                this.scrollView.vScrollBar.value = v;
            }
        }
        CheckShow() {
            for (let item of this.itemList) {
                let node = item.owner;
                let d = Math.abs(node.y - this.scrollValue - this.scrollView.height / 2 + node.height / 2 + this.layout.spaceY);
                let i = this.showing.indexOf(item);
                if (d < this.scrollView.height / 2) {
                    if (i < 0) {
                        this.showing.push(item);
                        item.OnShow();
                    }
                }
                else {
                    if (i >= 0) {
                        this.showing.splice(i, 1);
                    }
                }
            }
        }
        OnClose() {
            let node = this.owner;
            node.active = node.visible = false;
        }
    }
    P106.style = "P106";

    class ADManager {
        constructor() {
        }
        static ShowBanner() {
            let p = new TJ.ADS.Param();
            p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
            TJ.ADS.Api.ShowBanner(p);
        }
        static CloseBanner() {
            let p = new TJ.ADS.Param();
            p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
            TJ.ADS.Api.RemoveBanner(p);
        }
        static ShowNormal() {
            TJ.API.AdService.ShowNormal(new TJ.API.AdService.Param());
        }
        static showNormal2() {
            TJ.API.AdService.ShowNormal(new TJ.API.AdService.Param());
        }
        static ShowReward(rewardAction, CDTime = 500) {
            if (ADManager.CanShowCD) {
                lwg.PalyAudio.stopMusic();
                console.log("?????");
                let p = new TJ.ADS.Param();
                p.extraAd = true;
                let getReward = false;
                p.cbi.Add(TJ.Define.Event.Reward, () => {
                    getReward = true;
                    lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
                    if (rewardAction != null)
                        rewardAction();
                });
                p.cbi.Add(TJ.Define.Event.Close, () => {
                    if (!getReward) {
                        lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
                        lwg.Global._createHint_01(lwg.Enum.HintType.lookend);
                    }
                });
                p.cbi.Add(TJ.Define.Event.NoAds, () => {
                    lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
                    lwg.Global._createHint_01(lwg.Enum.HintType.noAdv);
                });
                TJ.ADS.Api.ShowReward(p);
                ADManager.CanShowCD = false;
                setTimeout(() => {
                    ADManager.CanShowCD = true;
                }, CDTime);
            }
        }
        static Event(param, value) {
            console.log("Param:>" + param + "Value:>" + value);
            let p = new TJ.GSA.Param();
            if (value == null) {
                p.id = param;
            }
            else {
                p.id = param + value;
            }
            console.log(p.id);
            TJ.GSA.Api.Event(p);
        }
        static initShare() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
                this.wx.onShareAppMessage(() => {
                    return {
                        title: this.shareContent,
                        imageUrl: this.shareImgUrl,
                        query: ""
                    };
                });
                this.wx.showShareMenu({
                    withShareTicket: true,
                    success: null,
                    fail: null,
                    complete: null
                });
            }
        }
        static lureShare() {
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
                this.wx.shareAppMessage({
                    title: this.shareContent,
                    imageUrl: this.shareImgUrl,
                    query: ""
                });
            }
        }
        static VibrateShort() {
            TJ.API.Vibrate.Short();
        }
        static Vibratelong() {
            TJ.API.Vibrate.Long();
        }
        static TAPoint(type, name) {
            let p = new TJ.API.TA.Param();
            p.id = name;
            switch (type) {
                case TaT.BtnShow:
                    TJ.API.TA.Event_Button_Show(p);
                    break;
                case TaT.BtnClick:
                    TJ.API.TA.Event_Button_Click(p);
                    break;
                case TaT.PageShow:
                    TJ.API.TA.Event_Page_Show(p);
                    break;
                case TaT.PageEnter:
                    TJ.API.TA.Event_Page_Enter(p);
                    break;
                case TaT.PageLeave:
                    TJ.API.TA.Event_Page_Leave(p);
                    break;
                case TaT.LevelStart:
                    TJ.API.TA.Event_Level_Start(p);
                    console.log('本关开始打点');
                    break;
                case TaT.LevelFail:
                    TJ.API.TA.Event_Level_Fail(p);
                    console.log('本关失败打点');
                    break;
                case TaT.LevelFinish:
                    TJ.API.TA.Event_Level_Finish(p);
                    console.log('本关胜利打点');
                    break;
            }
        }
    }
    ADManager.CanShowCD = true;
    ADManager.wx = Laya.Browser.window.wx;
    ADManager.shareImgUrl = "http://image.tomatojoy.cn/6847506204006681a5d5fa0cd91ce408";
    ADManager.shareContent = "快把锅甩给队友！";
    var TaT;
    (function (TaT) {
        TaT[TaT["BtnShow"] = 0] = "BtnShow";
        TaT[TaT["BtnClick"] = 1] = "BtnClick";
        TaT[TaT["PageShow"] = 2] = "PageShow";
        TaT[TaT["PageEnter"] = 3] = "PageEnter";
        TaT[TaT["PageLeave"] = 4] = "PageLeave";
        TaT[TaT["LevelStart"] = 5] = "LevelStart";
        TaT[TaT["LevelFinish"] = 6] = "LevelFinish";
        TaT[TaT["LevelFail"] = 7] = "LevelFail";
    })(TaT || (TaT = {}));

    var lwg;
    (function (lwg) {
        let Global;
        (function (Global) {
            Global._gameLevel = 1;
            Global._yuanpifu = null;
            Global._gameStart = false;
            Global._gameOverAni = false;
            Global._execution = 100;
            Global._exemptEx = true;
            Global._hotShare = true;
            Global._freetHint = true;
            Global._victoryBoxNum = 0;
            Global._todayCheckIn = false;
            Global._lastCheckIn = null;
            Global._CheckInNum = 0;
            Global._CustomsNum = 999;
            Global._stageClick = true;
            Global._openXD = false;
            Global._goldNum = 0;
            Global._elect = true;
            Global._shakeSwitch = true;
            Global._btnDelayed = 2000;
            Global._currentPifu = '01_gongzhu';
            Global._havePifu = ['01_gongzhu'];
            Global._notHavePifuSubXD = [];
            Global._allPifu = ['01_gongzhu', '02_chiji', '03_change', '04_huiguniang', '05_tianshi', '06_xiaohongmao', '07_xiaohuangya', '08_zhenzi', '09_aisha', '10_huli'];
            Global._buyNum = 1;
            Global._watchAdsNum = 0;
            Global._huangpihaozi = false;
            Global._zibiyazi = false;
            Global._kejigongzhu = false;
            Global._haimiangongzhu = false;
            Global._paintedPifu = [];
            Global._pickPaintedNum = 0;
            Global.pingceV = true;
            function _vibratingScreen() {
            }
            Global._vibratingScreen = _vibratingScreen;
            function notHavePifuSubXD() {
                let allArray = [];
                for (let i = 0; i < lwg.Global._allPifu.length; i++) {
                    const element = lwg.Global._allPifu[i];
                    allArray.push(element);
                }
                for (let j = 0; j < allArray.length; j++) {
                    let element1 = allArray[j];
                    for (let k = 0; k < lwg.Global._havePifu.length; k++) {
                        let element2 = lwg.Global._havePifu[k];
                        if (element1 === element2) {
                            allArray.splice(j, 1);
                            j--;
                        }
                    }
                }
                lwg.Global._notHavePifu = allArray;
                for (let k = 0; k < allArray.length; k++) {
                    const element = allArray[k];
                    if (element === '09_aisha' || element === '10_huli') {
                        allArray.splice(k, 1);
                        k--;
                    }
                }
                lwg.Global._notHavePifuSubXD = allArray;
                console.log(lwg.Global._notHavePifuSubXD);
            }
            Global.notHavePifuSubXD = notHavePifuSubXD;
            function _createLevel(parent, x, y) {
                let sp;
                Laya.loader.load('prefab/LevelNode.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 0;
                    let level = sp.getChildByName('level');
                    level.text = 'NO.' + lwg.Global._gameLevel;
                    Global.LevelNode = sp;
                }));
            }
            Global._createLevel = _createLevel;
            function _createKeyNum(parent, x, y) {
                let sp;
                Laya.loader.load('prefab/KeyNum.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 0;
                    let num = sp.getChildByName('Num');
                    num.text = lwg.Global._execution + '/' + '5';
                    Global.KeyNumNode = sp;
                }));
            }
            Global._createKeyNum = _createKeyNum;
            function _createBtnSet(parent) {
                let sp;
                Laya.loader.load('prefab/BtnSet.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(671, 273);
                    sp.zOrder = 0;
                    Click.on(Click.ClickType.largen, null, sp, null, null, null, btnSetUp, null);
                    Global.BtnSetNode = sp;
                    Global.BtnSetNode.name = 'BtnSetNode';
                }));
            }
            Global._createBtnSet = _createBtnSet;
            function btnSetUp() {
                Admin._openScene('UISet', null, null, null);
            }
            Global.btnSetUp = btnSetUp;
            function _createGoldNum(parent) {
                let sp;
                Laya.loader.load('prefab/GoldNum.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    let num = sp.getChildByName('Num');
                    num.value = Global._goldNum.toString();
                    parent.addChild(sp);
                    sp.pos(114, 91);
                    sp.zOrder = 50;
                    Global.GoldNumNode = sp;
                }));
            }
            Global._createGoldNum = _createGoldNum;
            function _addGold(number) {
                lwg.Global._goldNum += number;
                let Num = lwg.Global.GoldNumNode.getChildByName('Num');
                Num.value = lwg.Global._goldNum.toString();
                lwg.LocalStorage.addData();
            }
            Global._addGold = _addGold;
            function _addGoldDisPlay(number) {
                let Num = lwg.Global.GoldNumNode.getChildByName('Num');
                Num.value = (Number(Num.value) + number).toString();
            }
            Global._addGoldDisPlay = _addGoldDisPlay;
            function _addGoldNoDisPlay(number) {
                lwg.Global._goldNum += number;
                lwg.LocalStorage.addData();
            }
            Global._addGoldNoDisPlay = _addGoldNoDisPlay;
            function _createExecutionNum(parent) {
                let sp;
                Laya.loader.load('prefab/ExecutionNum.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    let num = sp.getChildByName('Num');
                    num.value = Global._execution.toString();
                    sp.pos(297, 90);
                    sp.zOrder = 50;
                    Global.ExecutionNumNode = sp;
                    Global.ExecutionNumNode.name = 'ExecutionNumNode';
                }));
            }
            Global._createExecutionNum = _createExecutionNum;
            function _addExecution(number) {
                lwg.Global._execution += number;
                if (lwg.Global._execution > 15) {
                    lwg.Global._execution = 15;
                }
                let num = lwg.Global.ExecutionNumNode.getChildByName('Num');
                num.value = lwg.Global._execution.toString();
                lwg.LocalStorage.addData();
            }
            Global._addExecution = _addExecution;
            function _createBtnPause(parent) {
                let sp;
                Laya.loader.load('prefab/BtnPause.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(645, 167);
                    sp.zOrder = 0;
                    Global.BtnPauseNode = sp;
                    Global.BtnPauseNode.name = 'BtnPauseNode';
                    Click.on(Click.ClickType.largen, null, sp, null, null, null, btnPauseUp, null);
                }));
            }
            Global._createBtnPause = _createBtnPause;
            function btnPauseUp(event) {
                event.stopPropagation();
                event.currentTarget.scale(1, 1);
                lwg.Admin._openScene('UIPause', null, null, null);
            }
            Global.btnPauseUp = btnPauseUp;
            function _createBtnHint(parent) {
                let sp;
                Laya.loader.load('prefab/BtnHint.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(645, 293);
                    sp.zOrder = 0;
                    Global.BtnHintNode = sp;
                    Global.BtnHintNode.name = 'BtnHintNode';
                    Click.on(Click.ClickType.largen, null, sp, null, null, null, btnHintUp, null);
                }));
            }
            Global._createBtnHint = _createBtnHint;
            function btnHintUp(event) {
                event.currentTarget.scale(1, 1);
                event.stopPropagation();
                Admin._openScene(Admin.SceneName.UISmallHint, null, null, f => { });
            }
            Global.btnHintUp = btnHintUp;
            function _createBtnAgain(parent) {
                let sp;
                Laya.loader.load('prefab/BtnAgain.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(645, 409);
                    sp.zOrder = 0;
                    Click.on(Click.ClickType.largen, null, sp, null, btnAgainUp, null, null, null);
                    Global.BtnAgainNode = sp;
                }));
            }
            Global._createBtnAgain = _createBtnAgain;
            function btnAgainUp(event) {
                event.stopPropagation();
                event.currentTarget.scale(1, 1);
                if (!Global._gameStart) {
                    return;
                }
                Global.refreshNum++;
                Admin._refreshScene();
            }
            Global.btnAgainUp = btnAgainUp;
            function _createP201_01(parent) {
                let sp;
                Laya.loader.load('prefab/P201.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('P201', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(80, 290);
                    sp.zOrder = 65;
                    Global.P201_01Node = sp;
                }));
            }
            Global._createP201_01 = _createP201_01;
            function _createStimulateDec(parent) {
                let sp;
                Laya.loader.load('prefab/StimulateDec.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('StimulateDec', _prefab.create, _prefab);
                    let dec = sp.getChildByName('Dec');
                    let num = lwg.Admin.openCustomName.substring(lwg.Admin.openCustomName.length - 3, lwg.Admin.openCustomName.length);
                    dec.text = lwg.Global._stimulateDec[Number(num) - 1]['dec'];
                    parent.addChild(sp);
                    sp.pos(35, 155);
                    sp.zOrder = 65;
                    Global.StimulateDecNode = sp;
                }));
            }
            Global._createStimulateDec = _createStimulateDec;
            function _createHint_01(type) {
                let sp;
                Laya.loader.load('prefab/HintPre_01.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    Laya.stage.addChild(sp);
                    sp.pos(Laya.stage.width / 2, Laya.stage.height / 2);
                    let dec = sp.getChildByName('dec');
                    dec.text = Enum.HintDec[type];
                    sp.zOrder = 100;
                    dec.alpha = 0;
                    Animation.scale_Alpha(sp, 0, 1, 0, 1, 1, 1, 200, 0, f => {
                        Animation.fadeOut(dec, 0, 1, 150, 0, f => {
                            Animation.fadeOut(dec, 1, 0, 200, 800, f => {
                                Animation.scale_Alpha(sp, 1, 1, 1, 1, 0, 0, 200, 0, f => {
                                    sp.removeSelf();
                                });
                            });
                        });
                    });
                }));
            }
            Global._createHint_01 = _createHint_01;
            function _createHint_02(type) {
                let sp;
                Laya.loader.load('prefab/HintPre_02.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    Laya.stage.addChild(sp);
                    sp.pos(Laya.stage.width / 2, Laya.stage.height / 2);
                    let dec = sp.getChildByName('dec');
                    dec.text = Enum.HintDec[type];
                    sp.zOrder = 100;
                    Animation.HintAni_01(sp, 100, 100, 1000, 50, 100, f => {
                        sp.removeSelf();
                    });
                }));
            }
            Global._createHint_02 = _createHint_02;
            function _createHint_InPut(input) {
                let sp;
                Laya.loader.load('prefab/HintPre_01.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    Laya.stage.addChild(sp);
                    sp.pos(Laya.stage.width / 2, Laya.stage.height / 2);
                    let dec = sp.getChildByName('dec');
                    dec.text = input;
                    sp.zOrder = 100;
                    dec.alpha = 0;
                    Animation.scale_Alpha(sp, 0, 1, 0, 1, 1, 1, 200, 0, f => {
                        Animation.fadeOut(dec, 0, 1, 150, 0, f => {
                            Animation.fadeOut(dec, 1, 0, 200, 1500, f => {
                                Animation.scale_Alpha(sp, 1, 1, 1, 1, 0, 0, 200, 0, f => {
                                    sp.removeSelf();
                                });
                            });
                        });
                    });
                }));
            }
            Global._createHint_InPut = _createHint_InPut;
            function createConsumeEx(subEx) {
                let label = Laya.Pool.getItemByClass('label', Laya.Label);
                label.name = 'label';
                Laya.stage.addChild(label);
                label.text = '-2';
                label.fontSize = 40;
                label.bold = true;
                label.color = '#59245c';
                label.x = Global.ExecutionNumNode.x + 100;
                label.y = Global.ExecutionNumNode.y - label.height / 2 + 4;
                label.zOrder = 100;
                lwg.Animation.fadeOut(label, 0, 1, 200, 150, f => {
                    lwg.Animation.leftRight_Shake(Global.ExecutionNumNode, 15, 60, 0, null);
                    lwg.Animation.fadeOut(label, 1, 0, 600, 400, f => {
                    });
                });
            }
            Global.createConsumeEx = createConsumeEx;
            function _createGold(type, parent, x, y) {
                let sp;
                Laya.loader.load('prefab/GolPre.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(x, y);
                }));
            }
            Global._createGold = _createGold;
            function _createAddExecution(x, y, func) {
                let sp;
                Laya.loader.load('prefab/execution.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    Laya.stage.addChild(sp);
                    sp.x = Laya.stage.width / 2;
                    sp.y = Laya.stage.height / 2;
                    sp.zOrder = 50;
                    if (Global.ExecutionNumNode) {
                        Animation.move_Simple_01(sp, sp.x, sp.y, Global.ExecutionNumNode.x, Global.ExecutionNumNode.y, 800, 100, f => {
                            Animation.fadeOut(sp, 1, 0, 200, 0, f => {
                                lwg.Animation.upDwon_Shake(Global.ExecutionNumNode, 10, 80, 0, null);
                                if (func) {
                                    func();
                                }
                            });
                        });
                    }
                }));
            }
            Global._createAddExecution = _createAddExecution;
        })(Global = lwg.Global || (lwg.Global = {}));
        let LocalStorage;
        (function (LocalStorage) {
            let storageData;
            function addData() {
                storageData = {
                    '_gameLevel': lwg.Global._gameLevel,
                    '_goldNum': lwg.Global._goldNum,
                    '_execution': lwg.Global._execution,
                    '_exemptExTime': lwg.Global._exemptExTime,
                    '_freeHintTime': lwg.Global._freeHintTime,
                    '_hotShareTime': lwg.Global._hotShareTime,
                    '_addExDate': lwg.Global._addExDate,
                    '_addExHours': lwg.Global._addExHours,
                    '_addMinutes': lwg.Global._addMinutes,
                    '_buyNum': lwg.Global._buyNum,
                    '_currentPifu': lwg.Global._currentPifu,
                    '_havePifu': lwg.Global._havePifu,
                    '_watchAdsNum': lwg.Global._watchAdsNum,
                    '_huangpihaozi': lwg.Global._huangpihaozi,
                    '_zibiyazi': lwg.Global._zibiyazi,
                    '_kejigongzhu': lwg.Global._kejigongzhu,
                    '_pickPaintedNum': lwg.Global._pickPaintedNum,
                    '_haimiangongzhu': lwg.Global._haimiangongzhu,
                    '_lastCheckIn': lwg.Global._lastCheckIn,
                    '_CheckInNum': lwg.Global._CheckInNum,
                };
                let data = JSON.stringify(storageData);
                Laya.LocalStorage.setJSON('storageData', data);
            }
            LocalStorage.addData = addData;
            function clearData() {
                Laya.LocalStorage.clear();
            }
            LocalStorage.clearData = clearData;
            function getData() {
                let storageData = Laya.LocalStorage.getJSON('storageData');
                if (storageData) {
                    let data = JSON.parse(storageData);
                    return data;
                }
                else {
                    lwg.Global._gameLevel = 1;
                    lwg.Global._goldNum = 0;
                    lwg.Global._execution = 15;
                    lwg.Global._exemptExTime = null;
                    lwg.Global._freeHintTime = null;
                    lwg.Global._hotShareTime = null;
                    lwg.Global._addExDate = (new Date).getDate();
                    lwg.Global._addExHours = (new Date).getHours();
                    lwg.Global._addMinutes = (new Date).getMinutes();
                    lwg.Global._buyNum = 1;
                    lwg.Global._currentPifu = Enum.PifuAllName[0];
                    lwg.Global._havePifu = ['01_gongzhu'];
                    lwg.Global._watchAdsNum = 0;
                    lwg.Global._huangpihaozi = false;
                    lwg.Global._zibiyazi = false;
                    lwg.Global._kejigongzhu = false;
                    lwg.Global._haimiangongzhu = false;
                    lwg.Global._pickPaintedNum = 0;
                    lwg.Global._lastCheckIn = null;
                    lwg.Global._CheckInNum = 0;
                    return null;
                }
            }
            LocalStorage.getData = getData;
        })(LocalStorage = lwg.LocalStorage || (lwg.LocalStorage = {}));
        let EventAdmin;
        (function (EventAdmin) {
            let EventType;
            (function (EventType) {
                EventType["btnOnClick"] = "btnOnClick";
                EventType["aniComplete"] = "aniComplete";
                EventType["victory"] = "victory";
                EventType["advertising"] = "advertising";
            })(EventType = EventAdmin.EventType || (EventAdmin.EventType = {}));
            EventAdmin.dispatcher = new Laya.EventDispatcher();
            function register(type, caller, listener) {
                if (!caller) {
                    console.error("caller must exist!");
                }
                EventAdmin.dispatcher.on(type.toString(), caller, listener);
            }
            EventAdmin.register = register;
            function notify(type, args) {
                EventAdmin.dispatcher.event(type.toString(), args);
            }
            EventAdmin.notify = notify;
            function off(type, caller, listener) {
                EventAdmin.dispatcher.off(type.toString(), caller, listener);
            }
            EventAdmin.off = off;
            function offAll(type) {
                EventAdmin.dispatcher.offAll(type.toString());
            }
            EventAdmin.offAll = offAll;
            function offCaller(caller) {
                EventAdmin.dispatcher.offAllCaller(caller);
            }
            EventAdmin.offCaller = offCaller;
        })(EventAdmin = lwg.EventAdmin || (lwg.EventAdmin = {}));
        let Admin;
        (function (Admin) {
            Admin._sceneControl = {};
            let SceneName;
            (function (SceneName) {
                SceneName["UILoding"] = "UILoding";
                SceneName["UIStart"] = "UIStart";
                SceneName["UIMain"] = "UIMain";
                SceneName["UIVictory"] = "UIVictory";
                SceneName["UIDefeated"] = "UIDefeated";
                SceneName["UIExecutionHint"] = "UIExecutionHint";
                SceneName["UIPassHint"] = "UIPassHint";
                SceneName["UISet"] = "UISet";
                SceneName["UIPifu"] = "UIPifu";
                SceneName["UIPuase"] = "UIPuase";
                SceneName["UIShare"] = "UIShare";
                SceneName["UISmallHint"] = "UISmallHint";
                SceneName["UIXDpifu"] = "UIXDpifu";
                SceneName["UIPifuTry"] = "UIPifuTry";
                SceneName["UIRedeem"] = "UIRedeem";
                SceneName["UIAnchorXD"] = "UIAnchorXD";
                SceneName["UITurntable"] = "UITurntable";
                SceneName["UICaiDanQiang"] = "UICaiDanQiang";
                SceneName["UICaidanPifu"] = "UICaidanPifu";
                SceneName["UIVictoryBox"] = "UIVictoryBox";
                SceneName["UICheckIn"] = "UICheckIn";
                SceneName["UIAdvertising"] = "UIAdvertising";
            })(SceneName = Admin.SceneName || (Admin.SceneName = {}));
            let GameState;
            (function (GameState) {
                GameState["GameStart"] = "GameStart";
                GameState["Play"] = "Play";
                GameState["Pause"] = "pause";
                GameState["Victory"] = "victory";
                GameState["Defeated"] = "defeated";
            })(GameState = Admin.GameState || (Admin.GameState = {}));
            function _openScene(openName, zOder, cloesScene, func) {
                Laya.Scene.load('Scene/' + openName + '.json', Laya.Handler.create(this, function (scene) {
                    scene.width = Laya.stage.width;
                    scene.height = Laya.stage.height;
                    if (zOder) {
                        Laya.stage.addChildAt(scene, zOder);
                    }
                    else {
                        Laya.stage.addChild(scene);
                    }
                    scene.name = openName;
                    Admin._sceneControl[openName] = scene;
                    let background = scene.getChildByName('background');
                    background.zOrder = -10;
                    if (background) {
                        if (openName.substring(0, 6) === 'UIMain') {
                            background.width = null;
                            background.height = null;
                            background.x = 360;
                            background.y = 640;
                        }
                        else {
                            background.width = Laya.stage.width;
                            background.height = Laya.stage.height;
                        }
                    }
                    if (cloesScene) {
                        cloesScene.close();
                    }
                    if (func) {
                        func();
                    }
                }));
            }
            Admin._openScene = _openScene;
            function _openGLCustoms() {
                let sceneName;
                let num;
                if (lwg.Global._gameLevel > 30) {
                    num = lwg.Global._gameLevel % 30;
                }
                else {
                    num = lwg.Global._gameLevel;
                }
                Admin.openLevelNum = lwg.Global._gameLevel;
                if (num <= 9) {
                    sceneName = 'UIMain_00' + num;
                }
                else if (9 < num || num <= 99) {
                    sceneName = 'UIMain_0' + num;
                }
                Admin.openCustomName = sceneName;
                console.log('打开', sceneName);
                _openScene(sceneName, null, null, f => {
                    lwg.Global._gameStart = true;
                });
            }
            Admin._openGLCustoms = _openGLCustoms;
            function _openNumCustom(num) {
                let sceneName;
                Admin.openLevelNum = num;
                if (num > 30) {
                    num = num % 30;
                }
                if (num <= 9) {
                    sceneName = 'UIMain_00' + num;
                }
                else if (9 < num || num <= 99) {
                    sceneName = 'UIMain_0' + num;
                }
                if (num <= 9) {
                    sceneName = 'UIMain_00' + num;
                }
                else if (9 < num || num <= 99) {
                    sceneName = 'UIMain_0' + num;
                }
                Admin.openCustomName = sceneName;
                _openScene(sceneName, null, null, f => {
                    lwg.Global._gameStart = true;
                    if (lwg.Global._yuanpifu !== null) {
                        Global._currentPifu = lwg.Global._yuanpifu;
                        lwg.Global._yuanpifu = null;
                    }
                });
            }
            Admin._openNumCustom = _openNumCustom;
            function _openLevelNumCustom() {
                let sceneName;
                if (Admin.openLevelNum <= 9) {
                    sceneName = 'UIMain_00' + Admin.openLevelNum;
                }
                else if (9 < Admin.openLevelNum || Admin.openLevelNum <= 99) {
                    sceneName = 'UIMain_0' + Admin.openLevelNum;
                }
                if (Admin.openLevelNum <= 9) {
                    sceneName = 'UIMain_00' + Admin.openLevelNum;
                }
                else if (9 < Admin.openLevelNum || Admin.openLevelNum <= 99) {
                    sceneName = 'UIMain_0' + Admin.openLevelNum;
                }
                Admin.openCustomName = sceneName;
                _openScene(sceneName, null, null, f => {
                    lwg.Global._gameStart = true;
                });
            }
            Admin._openLevelNumCustom = _openLevelNumCustom;
            function _nextCustomScene(subEx) {
                if (subEx > 0) {
                    Global._execution -= subEx;
                    let num = Global.ExecutionNumNode.getChildByName('Num');
                    num.value = Global._execution.toString();
                    Global._createHint_01(lwg.Enum.HintType.consumeEx);
                    Global.createConsumeEx(subEx);
                }
                if (Admin.openLevelNum >= Global._gameLevel) {
                    Admin._closeCustomScene();
                    Global._gameLevel++;
                    Admin._openGLCustoms();
                }
                else {
                    Admin._closeCustomScene();
                    Admin.openLevelNum++;
                    Admin._openLevelNumCustom();
                }
                LocalStorage.addData();
            }
            Admin._nextCustomScene = _nextCustomScene;
            function _refreshScene() {
                Admin._sceneControl[Admin.openCustomName].close();
                _openScene(Admin.openCustomName, null, null, null);
            }
            Admin._refreshScene = _refreshScene;
            function _closeCustomScene() {
                console.log('关闭当前关卡' + Admin.openCustomName);
                Admin._sceneControl[Admin.openCustomName].close();
            }
            Admin._closeCustomScene = _closeCustomScene;
            function printPoint(type, name) {
                switch (name) {
                    case SceneName.UILoding:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'UIPreload');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'UIPreload');
                        }
                        break;
                    case SceneName.UIStart:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'mianpage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'mianpage');
                        }
                        break;
                    case SceneName.UIVictory:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'successpage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'successpage');
                        }
                        break;
                    case SceneName.UIDefeated:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'failpage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'failpage');
                        }
                        break;
                    case SceneName.UIExecutionHint:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'noticketpage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'noticketpage');
                        }
                        break;
                    case SceneName.UIPassHint:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'freegiftpage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'freegiftpage');
                        }
                        break;
                    case SceneName.UIPuase:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'pausepage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'pausepage');
                        }
                        break;
                    case SceneName.UIShare:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'sharepage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'sharepage');
                        }
                        break;
                    case SceneName.UIPifu:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'skinpage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'skinpage');
                        }
                        break;
                    case SceneName.UIPifuTry:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'skintrypage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'skintrypage');
                        }
                        break;
                    case SceneName.UIXDpifu:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'limitskinpage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'limitskinpage');
                        }
                        break;
                    case SceneName.UICaiDanQiang:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'CDwallpage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'CDwallpage');
                        }
                        break;
                    case SceneName.UITurntable:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'turnpage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'turnpage');
                        }
                        break;
                    case SceneName.UICheckIn:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'signpage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'signpage');
                        }
                        break;
                    case SceneName.UIVictoryBox:
                        if (type === 'on') {
                            ADManager.TAPoint(TaT.PageEnter, 'boxpage');
                        }
                        else if (type === 'dis') {
                            ADManager.TAPoint(TaT.PageLeave, 'boxpage');
                        }
                        break;
                    default:
                        break;
                }
            }
            Admin.printPoint = printPoint;
            class Scene extends Laya.Script {
                constructor() {
                    super();
                    this.aniTime = 0;
                    this.aniDelayde = 0;
                }
                onAwake() {
                    this.self = this.owner;
                    this.calssName = this['__proto__']['constructor'].name;
                    this.gameState(this.calssName);
                    this.selfVars();
                    this.variateInit();
                    this.adaptive();
                }
                onEnable() {
                    this.self[this.calssName] = this;
                    this.lwgInit();
                    this.btnAndOpenAni();
                    printPoint('on', this.calssName);
                }
                selfVars() {
                }
                variateInit() {
                }
                gameState(calssName) {
                    switch (calssName) {
                        case SceneName.UIStart:
                            Admin._gameState = lwg.Enum.GameState.GameStart;
                            break;
                        case SceneName.UIMain:
                            Admin._gameState = lwg.Enum.GameState.Play;
                            break;
                        case SceneName.UIDefeated:
                            Admin._gameState = lwg.Enum.GameState.Defeated;
                            break;
                        case SceneName.UIVictory:
                            Admin._gameState = lwg.Enum.GameState.Victory;
                            break;
                        default:
                            break;
                    }
                }
                lwgInit() {
                }
                btnAndOpenAni() {
                    let time = this.openAni();
                    if (time) {
                        Laya.timer.once(time, this, f => {
                            this.btnOnClick();
                        });
                    }
                    else {
                        this.btnOnClick();
                    }
                }
                btnOnClick() {
                }
                openAni() {
                    return this.aniTime;
                }
                adaptive() {
                }
                vanishAni() {
                    return 0;
                }
                onUpdate() {
                    this.lwgOnUpdta();
                }
                lwgOnUpdta() {
                }
                onDisable() {
                    printPoint('dis', this.calssName);
                    this.lwgDisable();
                    Laya.timer.clearAll(this);
                    Laya.Tween.clearAll(this);
                    EventAdmin.dispatcher.offAllCaller(this);
                }
                lwgDisable() {
                }
            }
            Admin.Scene = Scene;
            class Person extends Laya.Script {
                constructor() {
                    super();
                }
                onAwake() {
                }
                lwgOnAwake() {
                }
                onEnable() {
                    this.self = this.owner;
                    this.selfScene = this.self.scene;
                    this.rig = this.self.getComponent(Laya.RigidBody);
                    let calssName = this['__proto__']['constructor'].name;
                    this.self[calssName] = this;
                    this.lwgInit();
                }
                lwgInit() {
                    console.log('父类的初始化！');
                }
                onUpdate() {
                    this.lwgOnUpdate();
                }
                lwgOnUpdate() {
                }
                onDisable() {
                    this.lwgOnDisable();
                }
                lwgOnDisable() {
                }
            }
            Admin.Person = Person;
            class Object extends Laya.Script {
                constructor() {
                    super();
                }
                onEnable() {
                    this.self = this.owner;
                    this.selfScene = this.self.scene;
                    let calssName = this['__proto__']['constructor'].name;
                    this.self[calssName] = this;
                    this.rig = this.self.getComponent(Laya.RigidBody);
                    this.lwgInit();
                    this.btnOnClick();
                }
                lwgInit() {
                    console.log('父类的初始化！');
                }
                btnOnClick() {
                }
                onUpdate() {
                    this.lwgOnUpdate();
                }
                lwgOnUpdate() {
                }
                onDisable() {
                    this.lwgDisable();
                }
                lwgDisable() {
                }
            }
            Admin.Object = Object;
        })(Admin = lwg.Admin || (lwg.Admin = {}));
        let Effects;
        (function (Effects) {
            let SkinUrl;
            (function (SkinUrl) {
                SkinUrl[SkinUrl["Effects/cir_white.png"] = 0] = "Effects/cir_white.png";
                SkinUrl[SkinUrl["Effects/cir_black.png"] = 1] = "Effects/cir_black.png";
                SkinUrl[SkinUrl["Effects/cir_blue.png"] = 2] = "Effects/cir_blue.png";
                SkinUrl[SkinUrl["Effects/cir_bluish.png"] = 3] = "Effects/cir_bluish.png";
                SkinUrl[SkinUrl["Effects/cir_cyan.png"] = 4] = "Effects/cir_cyan.png";
                SkinUrl[SkinUrl["Effects/cir_grass.png"] = 5] = "Effects/cir_grass.png";
                SkinUrl[SkinUrl["Effects/cir_green.png"] = 6] = "Effects/cir_green.png";
                SkinUrl[SkinUrl["Effects/cir_orange.png"] = 7] = "Effects/cir_orange.png";
                SkinUrl[SkinUrl["Effects/cir_pink.png"] = 8] = "Effects/cir_pink.png";
                SkinUrl[SkinUrl["Effects/cir_purple.png"] = 9] = "Effects/cir_purple.png";
                SkinUrl[SkinUrl["Effects/cir_red.png"] = 10] = "Effects/cir_red.png";
                SkinUrl[SkinUrl["Effects/cir_yellow.png"] = 11] = "Effects/cir_yellow.png";
                SkinUrl[SkinUrl["Effects/star_black.png"] = 12] = "Effects/star_black.png";
                SkinUrl[SkinUrl["Effects/star_blue.png"] = 13] = "Effects/star_blue.png";
                SkinUrl[SkinUrl["Effects/star_bluish.png"] = 14] = "Effects/star_bluish.png";
                SkinUrl[SkinUrl["Effects/star_cyan.png"] = 15] = "Effects/star_cyan.png";
                SkinUrl[SkinUrl["Effects/star_grass.png"] = 16] = "Effects/star_grass.png";
                SkinUrl[SkinUrl["Effects/star_green.png"] = 17] = "Effects/star_green.png";
                SkinUrl[SkinUrl["Effects/star_orange.png"] = 18] = "Effects/star_orange.png";
                SkinUrl[SkinUrl["Effects/star_pink.png"] = 19] = "Effects/star_pink.png";
                SkinUrl[SkinUrl["Effects/star_purple.png"] = 20] = "Effects/star_purple.png";
                SkinUrl[SkinUrl["Effects/star_red.png"] = 21] = "Effects/star_red.png";
                SkinUrl[SkinUrl["Effects/star_white.png"] = 22] = "Effects/star_white.png";
                SkinUrl[SkinUrl["Effects/star_yellow.png"] = 23] = "Effects/star_yellow.png";
                SkinUrl[SkinUrl["Effects/icon_biggold.png"] = 24] = "Effects/icon_biggold.png";
            })(SkinUrl = Effects.SkinUrl || (Effects.SkinUrl = {}));
            let SkinStyle;
            (function (SkinStyle) {
                SkinStyle["star"] = "star";
                SkinStyle["dot"] = "dot";
            })(SkinStyle = Effects.SkinStyle || (Effects.SkinStyle = {}));
            class EffectsBase extends Laya.Script {
                onAwake() {
                    this.initProperty();
                }
                onEnable() {
                    this.self = this.owner;
                    this.selfScene = this.self.scene;
                    let calssName = this['__proto__']['constructor'].name;
                    this.self[calssName] = this;
                    this.timer = 0;
                    this.lwgInit();
                    this.propertyAssign();
                }
                lwgInit() {
                }
                initProperty() {
                }
                propertyAssign() {
                    if (this.startAlpha) {
                        this.self.alpha = this.startAlpha;
                    }
                    if (this.startScale) {
                        this.self.scale(this.startScale, this.startScale);
                    }
                    if (this.startRotat) {
                        this.self.rotation = this.startRotat;
                    }
                }
                commonSpeedXYByAngle(angle, speed) {
                    this.self.x += Tools.speedXYByAngle(angle, speed + this.accelerated).x;
                    this.self.y += Tools.speedXYByAngle(angle, speed + this.accelerated).y;
                }
                moveRules() {
                }
                onUpdate() {
                    this.moveRules();
                }
                onDisable() {
                    Laya.Pool.recover(this.self.name, this.self);
                    this.destroy();
                    Laya.Tween.clearAll(this);
                    Laya.timer.clearAll(this);
                }
            }
            Effects.EffectsBase = EffectsBase;
            function createCommonExplosion(parent, quantity, x, y, style, speed, continueTime) {
                for (let index = 0; index < quantity; index++) {
                    let ele = Laya.Pool.getItemByClass('ele', Laya.Image);
                    ele.name = 'ele';
                    let num;
                    if (style === 'star') {
                        num = 12 + Math.floor(Math.random() * 12);
                    }
                    else if (style === 'dot') {
                        num = Math.floor(Math.random() * 12);
                    }
                    ele.skin = SkinUrl[num];
                    ele.alpha = 1;
                    parent.addChild(ele);
                    ele.pos(x, y);
                    let scirpt = ele.addComponent(commonExplosion);
                    scirpt.startSpeed = Math.random() * speed;
                    scirpt.continueTime = 2 * Math.random() + continueTime;
                }
            }
            Effects.createCommonExplosion = createCommonExplosion;
            class commonExplosion extends lwg.Effects.EffectsBase {
                lwgInit() {
                    this.self.width = 25;
                    this.self.height = 25;
                    this.self.pivotX = this.self.width / 2;
                    this.self.pivotY = this.self.height / 2;
                }
                initProperty() {
                    this.startAngle = 360 * Math.random();
                    this.startSpeed = 5 * Math.random() + 8;
                    this.startScale = 0.4 + Math.random() * 0.6;
                    this.accelerated = 2;
                    this.continueTime = 8 + Math.random() * 10;
                    this.rotateDir = Math.floor(Math.random() * 2) === 1 ? 'left' : 'right';
                    this.rotateRan = Math.random() * 10;
                }
                moveRules() {
                    this.timer++;
                    if (this.rotateDir === 'left') {
                        this.self.rotation += this.rotateRan;
                    }
                    else {
                        this.self.rotation -= this.rotateRan;
                    }
                    if (this.timer >= this.continueTime / 2) {
                        this.self.alpha -= 0.04;
                        if (this.self.alpha <= 0.65) {
                            this.self.removeSelf();
                        }
                    }
                    this.commonSpeedXYByAngle(this.startAngle, this.startSpeed + this.accelerated);
                    this.accelerated += 0.2;
                }
            }
            Effects.commonExplosion = commonExplosion;
            function createExplosion_Rotate(parent, quantity, x, y, style, speed, rotate) {
                for (let index = 0; index < quantity; index++) {
                    let ele = Laya.Pool.getItemByClass('ele', Laya.Image);
                    ele.name = 'ele';
                    let num;
                    if (style === 'star') {
                        num = 12 + Math.floor(Math.random() * 12);
                    }
                    else if (style === 'dot') {
                        num = Math.floor(Math.random() * 12);
                    }
                    ele.skin = SkinUrl[num];
                    ele.alpha = 1;
                    parent.addChild(ele);
                    ele.pos(x, y);
                    let scirpt = ele.addComponent(Explosion_Rotate);
                    scirpt.startSpeed = 2 + Math.random() * speed;
                    scirpt.rotateRan = Math.random() * rotate;
                }
            }
            Effects.createExplosion_Rotate = createExplosion_Rotate;
            class Explosion_Rotate extends lwg.Effects.EffectsBase {
                lwgInit() {
                    this.self.width = 41;
                    this.self.height = 41;
                    this.self.pivotX = this.self.width / 2;
                    this.self.pivotY = this.self.height / 2;
                }
                initProperty() {
                    this.startAngle = 360 * Math.random();
                    this.startSpeed = 5 * Math.random() + 8;
                    this.startScale = 0.4 + Math.random() * 0.6;
                    this.accelerated = 0;
                    this.continueTime = 5 + Math.random() * 20;
                    this.rotateDir = Math.floor(Math.random() * 2) === 1 ? 'left' : 'right';
                    this.rotateRan = Math.random() * 15;
                }
                moveRules() {
                    if (this.rotateDir === 'left') {
                        this.self.rotation += this.rotateRan;
                    }
                    else {
                        this.self.rotation -= this.rotateRan;
                    }
                    if (this.startSpeed - this.accelerated <= 0.1) {
                        this.self.alpha -= 0.03;
                        if (this.self.alpha <= 0) {
                            this.self.removeSelf();
                        }
                    }
                    else {
                        this.accelerated += 0.2;
                    }
                    this.commonSpeedXYByAngle(this.startAngle, this.startSpeed - this.accelerated);
                }
            }
            Effects.Explosion_Rotate = Explosion_Rotate;
            function getGoldAni(parent, number, fX, fY, tX, tY, func1, func2) {
                for (let index = 0; index < number; index++) {
                    lwg.Effects.createAddGold(parent, index, fX, fY, tX, tY, f => {
                        if (index === number - 1) {
                            if (func2 !== null) {
                                func2();
                            }
                        }
                        else {
                            if (func1 !== null) {
                                func1();
                            }
                        }
                    });
                }
            }
            Effects.getGoldAni = getGoldAni;
            function createAddGold(parent, index, x, y, targetX, targetY, func) {
                let ele = Laya.Pool.getItemByClass('addGold', Laya.Image);
                ele.name = 'addGold';
                ele.alpha = 1;
                ele.scale(1, 1);
                ele.skin = SkinUrl[24];
                parent.addChild(ele);
                ele.zOrder = 60;
                ele.pos(x, y);
                let scirpt = ele.getComponent(AddGold);
                if (!scirpt) {
                    ele.addComponent(AddGold);
                    let scirpt1 = ele.getComponent(AddGold);
                    scirpt1.line = index;
                    scirpt1.targetX = targetX;
                    scirpt1.targetY = targetY;
                    scirpt1.timer -= index * 3;
                    scirpt1.moveSwitch = true;
                    scirpt1.func = func;
                }
                else {
                    scirpt.line = index;
                    scirpt.timer -= index * 3;
                    scirpt.targetX = targetX;
                    scirpt.targetY = targetY;
                    scirpt.moveSwitch = true;
                    scirpt.func = func;
                }
            }
            Effects.createAddGold = createAddGold;
            class AddGold extends lwg.Effects.EffectsBase {
                lwgInit() {
                    this.self.width = 115;
                    this.self.height = 111;
                    this.self.pivotX = this.self.width / 2;
                    this.self.pivotY = this.self.height / 2;
                }
                initProperty() {
                }
                moveRules() {
                    if (this.moveSwitch) {
                        this.timer++;
                        if (this.timer > 0) {
                            lwg.Animation.move_Scale(this.self, 1, this.self.x, this.self.y, this.targetX, this.targetY, 0.35, 250, 0, f => {
                                this.self.removeSelf();
                                if (this.func !== null) {
                                    this.func();
                                }
                            });
                            this.moveSwitch = false;
                        }
                    }
                }
            }
            Effects.AddGold = AddGold;
            function createFireworks(parent, quantity, x, y) {
                for (let index = 0; index < quantity; index++) {
                    let ele = Laya.Pool.getItemByClass('fireworks', Laya.Image);
                    ele.name = 'fireworks';
                    let num = 12 + Math.floor(Math.random() * 11);
                    ele.alpha = 1;
                    ele.skin = SkinUrl[num];
                    parent.addChild(ele);
                    ele.pos(x, y);
                    let scirpt = ele.getComponent(Fireworks);
                    if (!scirpt) {
                        ele.addComponent(Fireworks);
                    }
                }
            }
            Effects.createFireworks = createFireworks;
            class Fireworks extends lwg.Effects.EffectsBase {
                lwgInit() {
                    this.self.width = 41;
                    this.self.height = 41;
                    this.self.pivotX = this.self.width / 2;
                    this.self.pivotY = this.self.height / 2;
                }
                initProperty() {
                    this.startAngle = 360 * Math.random();
                    this.startSpeed = 5 * Math.random() + 5;
                    this.startScale = 0.4 + Math.random() * 0.6;
                    this.accelerated = 0.1;
                    this.continueTime = 200 + Math.random() * 10;
                }
                moveRules() {
                    this.timer++;
                    if (this.timer >= this.continueTime * 3 / 5) {
                        this.self.alpha -= 0.1;
                    }
                    if (this.timer >= this.continueTime) {
                        this.self.removeSelf();
                    }
                    else {
                        this.commonSpeedXYByAngle(this.startAngle, this.startSpeed);
                    }
                    if (this.self.scaleX < 0) {
                        this.self.scaleX += 0.01;
                    }
                    else if (this.self.scaleX >= this.startScale) {
                        this.self.scaleX -= 0.01;
                    }
                }
            }
            Effects.Fireworks = Fireworks;
            function createLeftOrRightJet(parent, direction, quantity, x, y) {
                for (let index = 0; index < quantity; index++) {
                    let ele = Laya.Pool.getItemByClass('Jet', Laya.Image);
                    ele.name = 'Jet';
                    let num = 12 + Math.floor(Math.random() * 11);
                    ele.skin = SkinUrl[num];
                    ele.alpha = 1;
                    parent.addChild(ele);
                    ele.pos(x, y);
                    let scirpt = ele.getComponent(leftOrRightJet);
                    if (!scirpt) {
                        ele.addComponent(leftOrRightJet);
                        let scirpt1 = ele.getComponent(leftOrRightJet);
                        scirpt1.direction = direction;
                        scirpt1.initProperty();
                    }
                    else {
                        scirpt.direction = direction;
                        scirpt.initProperty();
                    }
                }
            }
            Effects.createLeftOrRightJet = createLeftOrRightJet;
            class leftOrRightJet extends lwg.Effects.EffectsBase {
                lwgInit() {
                    this.self.width = 41;
                    this.self.height = 41;
                    this.self.pivotX = this.self.width / 2;
                    this.self.pivotY = this.self.height / 2;
                }
                initProperty() {
                    if (this.direction === 'left') {
                        this.startAngle = 100 * Math.random() - 90 + 45 - 10 - 20;
                    }
                    else if (this.direction === 'right') {
                        this.startAngle = 100 * Math.random() + 90 + 45 + 20;
                    }
                    this.startSpeed = 10 * Math.random() + 3;
                    this.startScale = 0.4 + Math.random() * 0.6;
                    this.accelerated = 0.1;
                    this.continueTime = 300 + Math.random() * 50;
                    this.randomRotate = 1 + Math.random() * 20;
                }
                moveRules() {
                    this.timer++;
                    if (this.timer >= this.continueTime * 3 / 5) {
                        this.self.alpha -= 0.1;
                    }
                    if (this.timer >= this.continueTime) {
                        this.self.removeSelf();
                    }
                    else {
                        this.commonSpeedXYByAngle(this.startAngle, this.startSpeed);
                    }
                    this.self.rotation += this.randomRotate;
                    if (this.self.scaleX < 0) {
                        this.self.scaleX += 0.01;
                    }
                    else if (this.self.scaleX >= this.startScale) {
                        this.self.scaleX -= 0.01;
                    }
                }
            }
            Effects.leftOrRightJet = leftOrRightJet;
        })(Effects = lwg.Effects || (lwg.Effects = {}));
        let Sk;
        (function (Sk) {
            let PifuMatching;
            (function (PifuMatching) {
                PifuMatching["gongzhu"] = "01_gongzhu";
                PifuMatching["chiji"] = "02_chiji";
                PifuMatching["change"] = "03_change";
                PifuMatching["huiguniang"] = "04_huiguniang";
                PifuMatching["tianshi"] = "05_tianshi";
                PifuMatching["xiaohongmao"] = "06_xiaohongmao";
                PifuMatching["xiaohuangya"] = "07_xiaohuangya";
                PifuMatching["zhenzi"] = "08_zhenzi";
                PifuMatching["aisha"] = "09_aisha";
                PifuMatching["huli"] = "10_huli";
            })(PifuMatching = Sk.PifuMatching || (Sk.PifuMatching = {}));
            let PaintedPifu;
            (function (PaintedPifu) {
                PaintedPifu["daji"] = "P_001_daji";
                PaintedPifu["shizi"] = "P_002_shizi";
                PaintedPifu["pikaqiu"] = "P_003_pikaqiu";
                PaintedPifu["cangshu"] = "P_004_cangshu";
                PaintedPifu["haimianbaobao"] = "P_005_haimianbaobao";
                PaintedPifu["keji"] = "P_006_keji";
                PaintedPifu["kedaya"] = "P_007_kedaya";
            })(PaintedPifu = Sk.PaintedPifu || (Sk.PaintedPifu = {}));
            Sk.gongzhuTem = new Laya.Templet();
            Sk.aishaTem = new Laya.Templet();
            Sk.changeTem = new Laya.Templet();
            Sk.chijiTem = new Laya.Templet();
            Sk.huiguniangTem = new Laya.Templet();
            Sk.tianshiTem = new Laya.Templet();
            Sk.xiaohongmaoTem = new Laya.Templet();
            Sk.xiaohuangyaTem = new Laya.Templet();
            Sk.zhenziTem = new Laya.Templet();
            Sk.kedayaTem = new Laya.Templet();
            Sk.cangshuTem = new Laya.Templet();
            Sk.dajiTem = new Laya.Templet();
            Sk.haimianbaobaoTem = new Laya.Templet();
            Sk.pikaqiuTem = new Laya.Templet();
            Sk.shiziTem = new Laya.Templet();
            Sk.kejiTem = new Laya.Templet();
            Sk.wangziTem = new Laya.Templet();
            Sk.gouTem = new Laya.Templet();
            Sk.qingdi_01Tem = new Laya.Templet();
            Sk.qingdi_02Tem = new Laya.Templet();
            Sk.houmaTem = new Laya.Templet();
            Sk.houziTem = new Laya.Templet();
            function skLoding() {
                createGongzhuTem();
                createAishaTem();
                createChijiTem();
                createChangeTem();
                createHuiguniangTem();
                createTianshiTem();
                createXiaohongmaoTem();
                createXiaohuangyaTem();
                createZhenziTem();
                createCangshuTem();
                createPikaqiuTem();
                createDajiTem();
                createHaimianbaobaoTem();
                createShiziTem();
                createKejiTem();
                createKedayaTem();
                createWangziTem();
                createGouTem();
                createQingdi_01Tem();
                createQingdi_02Tem();
                createHoumaTem();
                createHouziTem();
            }
            Sk.skLoding = skLoding;
            function createGongzhuTem() {
                Sk.gongzhuTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.gongzhuTem.on(Laya.Event.ERROR, this, onError);
                Sk.gongzhuTem.loadAni("SK/gongzhu.sk");
            }
            Sk.createGongzhuTem = createGongzhuTem;
            function createAishaTem() {
                Sk.aishaTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.aishaTem.on(Laya.Event.ERROR, this, onError);
                Sk.aishaTem.loadAni("SK/aisha.sk");
            }
            Sk.createAishaTem = createAishaTem;
            function createChangeTem() {
                Sk.changeTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.changeTem.on(Laya.Event.ERROR, this, onError);
                Sk.changeTem.loadAni("SK/change.sk");
            }
            Sk.createChangeTem = createChangeTem;
            function createChijiTem() {
                Sk.chijiTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.chijiTem.on(Laya.Event.ERROR, this, onError);
                Sk.chijiTem.loadAni("SK/chiji.sk");
            }
            Sk.createChijiTem = createChijiTem;
            function createHuiguniangTem() {
                Sk.huiguniangTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.huiguniangTem.on(Laya.Event.ERROR, this, onError);
                Sk.huiguniangTem.loadAni("SK/huiguniang.sk");
            }
            Sk.createHuiguniangTem = createHuiguniangTem;
            function createTianshiTem() {
                Sk.tianshiTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.tianshiTem.on(Laya.Event.ERROR, this, onError);
                Sk.tianshiTem.loadAni("SK/tianshi.sk");
            }
            Sk.createTianshiTem = createTianshiTem;
            function createXiaohongmaoTem() {
                Sk.xiaohongmaoTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.xiaohongmaoTem.on(Laya.Event.ERROR, this, onError);
                Sk.xiaohongmaoTem.loadAni("SK/xiaohongmao.sk");
            }
            Sk.createXiaohongmaoTem = createXiaohongmaoTem;
            function createXiaohuangyaTem() {
                Sk.xiaohuangyaTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.xiaohuangyaTem.on(Laya.Event.ERROR, this, onError);
                Sk.xiaohuangyaTem.loadAni("SK/xiaohuangya.sk");
            }
            Sk.createXiaohuangyaTem = createXiaohuangyaTem;
            function createZhenziTem() {
                Sk.zhenziTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.zhenziTem.on(Laya.Event.ERROR, this, onError);
                Sk.zhenziTem.loadAni("SK/zhenzi.sk");
            }
            Sk.createZhenziTem = createZhenziTem;
            function createCangshuTem() {
                Sk.cangshuTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.cangshuTem.on(Laya.Event.ERROR, this, onError);
                Sk.cangshuTem.loadAni("SK/cangshu.sk");
            }
            Sk.createCangshuTem = createCangshuTem;
            function createDajiTem() {
                Sk.dajiTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.dajiTem.on(Laya.Event.ERROR, this, onError);
                Sk.dajiTem.loadAni("SK/daji.sk");
            }
            Sk.createDajiTem = createDajiTem;
            function createHaimianbaobaoTem() {
                Sk.haimianbaobaoTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.haimianbaobaoTem.on(Laya.Event.ERROR, this, onError);
                Sk.haimianbaobaoTem.loadAni("SK/haimianbaobao.sk");
            }
            Sk.createHaimianbaobaoTem = createHaimianbaobaoTem;
            function createPikaqiuTem() {
                Sk.pikaqiuTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.pikaqiuTem.on(Laya.Event.ERROR, this, onError);
                Sk.pikaqiuTem.loadAni("SK/pikaqiu.sk");
            }
            Sk.createPikaqiuTem = createPikaqiuTem;
            function createShiziTem() {
                Sk.shiziTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.shiziTem.on(Laya.Event.ERROR, this, onError);
                Sk.shiziTem.loadAni("SK/shizi.sk");
            }
            Sk.createShiziTem = createShiziTem;
            function createKejiTem() {
                Sk.kejiTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.kejiTem.on(Laya.Event.ERROR, this, onError);
                Sk.kejiTem.loadAni("SK/keji.sk");
            }
            Sk.createKejiTem = createKejiTem;
            function createKedayaTem() {
                Sk.kedayaTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.kedayaTem.on(Laya.Event.ERROR, this, onError);
                Sk.kedayaTem.loadAni("SK/kedaya.sk");
            }
            Sk.createKedayaTem = createKedayaTem;
            function createWangziTem() {
                Sk.wangziTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.wangziTem.on(Laya.Event.ERROR, this, onError);
                Sk.wangziTem.loadAni("SK/wangzi.sk");
            }
            Sk.createWangziTem = createWangziTem;
            function createGouTem() {
                Sk.gouTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.gouTem.on(Laya.Event.ERROR, this, onError);
                Sk.gouTem.loadAni("SK/gou.sk");
            }
            Sk.createGouTem = createGouTem;
            function createQingdi_01Tem() {
                Sk.qingdi_01Tem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.qingdi_01Tem.on(Laya.Event.ERROR, this, onError);
                Sk.qingdi_01Tem.loadAni("SK/qingdi.sk");
            }
            Sk.createQingdi_01Tem = createQingdi_01Tem;
            function createQingdi_02Tem() {
                Sk.qingdi_02Tem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.qingdi_02Tem.on(Laya.Event.ERROR, this, onError);
                Sk.qingdi_02Tem.loadAni("SK/qingdi1.sk");
            }
            Sk.createQingdi_02Tem = createQingdi_02Tem;
            function createHoumaTem() {
                Sk.houmaTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.houmaTem.on(Laya.Event.ERROR, this, onError);
                Sk.houmaTem.loadAni("SK/houma.sk");
            }
            Sk.createHoumaTem = createHoumaTem;
            function createHouziTem() {
                Sk.houziTem.on(Laya.Event.COMPLETE, this, onCompelet);
                Sk.houziTem.on(Laya.Event.ERROR, this, onError);
                Sk.houziTem.loadAni("SK/houzi.sk");
            }
            Sk.createHouziTem = createHouziTem;
            function onCompelet(tem) {
                console.log(tem['_skBufferUrl'], '加载成功');
            }
            Sk.onCompelet = onCompelet;
            function onError(url) {
                console.log(url, '加载失败！');
            }
            Sk.onError = onError;
        })(Sk = lwg.Sk || (lwg.Sk = {}));
        let Enum;
        (function (Enum) {
            let HintDec;
            (function (HintDec) {
                HintDec[HintDec["\u91D1\u5E01\u4E0D\u591F\u4E86\uFF01"] = 0] = "\u91D1\u5E01\u4E0D\u591F\u4E86\uFF01";
                HintDec[HintDec["\u6CA1\u6709\u53EF\u4EE5\u8D2D\u4E70\u7684\u76AE\u80A4\u4E86\uFF01"] = 1] = "\u6CA1\u6709\u53EF\u4EE5\u8D2D\u4E70\u7684\u76AE\u80A4\u4E86\uFF01";
                HintDec[HintDec["\u6682\u65F6\u6CA1\u6709\u5E7F\u544A\uFF0C\u8FC7\u4F1A\u513F\u518D\u8BD5\u8BD5\u5427\uFF01"] = 2] = "\u6682\u65F6\u6CA1\u6709\u5E7F\u544A\uFF0C\u8FC7\u4F1A\u513F\u518D\u8BD5\u8BD5\u5427\uFF01";
                HintDec[HintDec["\u6682\u65E0\u76AE\u80A4!"] = 3] = "\u6682\u65E0\u76AE\u80A4!";
                HintDec[HintDec["\u6682\u65E0\u5206\u4EAB!"] = 4] = "\u6682\u65E0\u5206\u4EAB!";
                HintDec[HintDec["\u6682\u65E0\u63D0\u793A\u673A\u4F1A!"] = 5] = "\u6682\u65E0\u63D0\u793A\u673A\u4F1A!";
                HintDec[HintDec["\u89C2\u770B\u5B8C\u6574\u5E7F\u544A\u624D\u80FD\u83B7\u53D6\u5956\u52B1\u54E6\uFF01"] = 6] = "\u89C2\u770B\u5B8C\u6574\u5E7F\u544A\u624D\u80FD\u83B7\u53D6\u5956\u52B1\u54E6\uFF01";
                HintDec[HintDec["\u901A\u5173\u4E0A\u4E00\u5173\u624D\u80FD\u89E3\u9501\u672C\u5173\uFF01"] = 7] = "\u901A\u5173\u4E0A\u4E00\u5173\u624D\u80FD\u89E3\u9501\u672C\u5173\uFF01";
                HintDec[HintDec["\u5206\u4EAB\u6210\u529F\u540E\u624D\u80FD\u83B7\u53D6\u5956\u52B1\uFF01"] = 8] = "\u5206\u4EAB\u6210\u529F\u540E\u624D\u80FD\u83B7\u53D6\u5956\u52B1\uFF01";
                HintDec[HintDec["\u5206\u4EAB\u6210\u529F"] = 9] = "\u5206\u4EAB\u6210\u529F";
                HintDec[HintDec["\u6682\u65E0\u89C6\u9891\uFF0C\u73A9\u4E00\u5C40\u6E38\u620F\u4E4B\u540E\u5206\u4EAB\uFF01"] = 10] = "\u6682\u65E0\u89C6\u9891\uFF0C\u73A9\u4E00\u5C40\u6E38\u620F\u4E4B\u540E\u5206\u4EAB\uFF01";
                HintDec[HintDec["\u6D88\u80172\u70B9\u4F53\u529B\uFF01"] = 11] = "\u6D88\u80172\u70B9\u4F53\u529B\uFF01";
                HintDec[HintDec["\u4ECA\u65E5\u4F53\u529B\u798F\u5229\u5DF2\u9886\u53D6\uFF01"] = 12] = "\u4ECA\u65E5\u4F53\u529B\u798F\u5229\u5DF2\u9886\u53D6\uFF01";
                HintDec[HintDec["\u5206\u4EAB\u6210\u529F\uFF0C\u83B7\u5F97125\u91D1\u5E01\uFF01"] = 13] = "\u5206\u4EAB\u6210\u529F\uFF0C\u83B7\u5F97125\u91D1\u5E01\uFF01";
                HintDec[HintDec["\u9650\u5B9A\u76AE\u80A4\u5DF2\u7ECF\u83B7\u5F97\uFF0C\u8BF7\u524D\u5F80\u5546\u5E97\u67E5\u770B\u3002"] = 14] = "\u9650\u5B9A\u76AE\u80A4\u5DF2\u7ECF\u83B7\u5F97\uFF0C\u8BF7\u524D\u5F80\u5546\u5E97\u67E5\u770B\u3002";
                HintDec[HintDec["\u5206\u4EAB\u5931\u8D25\uFF01"] = 15] = "\u5206\u4EAB\u5931\u8D25\uFF01";
                HintDec[HintDec["\u5151\u6362\u7801\u9519\u8BEF\uFF01"] = 16] = "\u5151\u6362\u7801\u9519\u8BEF\uFF01";
                HintDec[HintDec["\u83B7\u5F97\u67EF\u57FA\u516C\u4E3B\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01"] = 17] = "\u83B7\u5F97\u67EF\u57FA\u516C\u4E3B\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01";
                HintDec[HintDec["\u83B7\u5F97\u9EC4\u76AE\u8017\u5B50\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01"] = 18] = "\u83B7\u5F97\u9EC4\u76AE\u8017\u5B50\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01";
                HintDec[HintDec["\u83B7\u5F97\u585E\u7259\u4EBA\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01"] = 19] = "\u83B7\u5F97\u585E\u7259\u4EBA\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01";
                HintDec[HintDec["\u83B7\u5F97\u6D77\u7EF5\u516C\u4E3B\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01"] = 20] = "\u83B7\u5F97\u6D77\u7EF5\u516C\u4E3B\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01";
                HintDec[HintDec["\u83B7\u5F97\u4ED3\u9F20\u516C\u4E3B\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01"] = 21] = "\u83B7\u5F97\u4ED3\u9F20\u516C\u4E3B\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01";
                HintDec[HintDec["\u83B7\u5F97\u81EA\u95ED\u9E2D\u5B50\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01"] = 22] = "\u83B7\u5F97\u81EA\u95ED\u9E2D\u5B50\u76AE\u80A4\uFF0C\u524D\u5F80\u5F69\u86CB\u5899\u67E5\u770B\uFF01";
                HintDec[HintDec["\u6CA1\u6709\u9886\u53D6\u6B21\u6570\u4E86\uFF01"] = 23] = "\u6CA1\u6709\u9886\u53D6\u6B21\u6570\u4E86\uFF01";
                HintDec[HintDec["\u589E\u52A0\u4E09\u6B21\u5F00\u542F\u5B9D\u7BB1\u6B21\u6570\uFF01"] = 24] = "\u589E\u52A0\u4E09\u6B21\u5F00\u542F\u5B9D\u7BB1\u6B21\u6570\uFF01";
                HintDec[HintDec["\u89C2\u770B\u5E7F\u544A\u53EF\u4EE5\u83B7\u5F97\u4E09\u6B21\u5F00\u5B9D\u7BB1\u6B21\u6570\uFF01"] = 25] = "\u89C2\u770B\u5E7F\u544A\u53EF\u4EE5\u83B7\u5F97\u4E09\u6B21\u5F00\u5B9D\u7BB1\u6B21\u6570\uFF01";
                HintDec[HintDec["\u6CA1\u6709\u5B9D\u7BB1\u9886\u53EF\u4EE5\u9886\u4E86\uFF01"] = 26] = "\u6CA1\u6709\u5B9D\u7BB1\u9886\u53EF\u4EE5\u9886\u4E86\uFF01";
            })(HintDec = Enum.HintDec || (Enum.HintDec = {}));
            let HintType;
            (function (HintType) {
                HintType[HintType["noGold"] = 0] = "noGold";
                HintType[HintType["noGetPifu"] = 1] = "noGetPifu";
                HintType[HintType["noAdv"] = 2] = "noAdv";
                HintType[HintType["noPifu"] = 3] = "noPifu";
                HintType[HintType["noShare"] = 4] = "noShare";
                HintType[HintType["noHint"] = 5] = "noHint";
                HintType[HintType["lookend"] = 6] = "lookend";
                HintType[HintType["nopass"] = 7] = "nopass";
                HintType[HintType["sharefail"] = 8] = "sharefail";
                HintType[HintType["sharesuccess"] = 9] = "sharesuccess";
                HintType[HintType["novideo"] = 10] = "novideo";
                HintType[HintType["consumeEx"] = 11] = "consumeEx";
                HintType[HintType["no_exemptExTime"] = 12] = "no_exemptExTime";
                HintType[HintType["shareyes"] = 13] = "shareyes";
                HintType[HintType["getXD"] = 14] = "getXD";
                HintType[HintType["sharefailNoAward"] = 15] = "sharefailNoAward";
                HintType[HintType["inputerr"] = 16] = "inputerr";
                HintType[HintType["kejigongzhu"] = 17] = "kejigongzhu";
                HintType[HintType["huangpihaozi"] = 18] = "huangpihaozi";
                HintType[HintType["saiyaren"] = 19] = "saiyaren";
                HintType[HintType["haimiangongzhu"] = 20] = "haimiangongzhu";
                HintType[HintType["cangshugongzhu"] = 21] = "cangshugongzhu";
                HintType[HintType["zibiyazi"] = 22] = "zibiyazi";
                HintType[HintType["noGetNum"] = 23] = "noGetNum";
                HintType[HintType["getBoxOne"] = 24] = "getBoxOne";
                HintType[HintType["watchAdv"] = 25] = "watchAdv";
                HintType[HintType["\u6CA1\u6709\u5B9D\u7BB1\u9886\u53EF\u4EE5\u9886\u4E86\uFF01"] = 26] = "\u6CA1\u6709\u5B9D\u7BB1\u9886\u53EF\u4EE5\u9886\u4E86\uFF01";
            })(HintType = Enum.HintType || (Enum.HintType = {}));
            let PifuOrder;
            (function (PifuOrder) {
                PifuOrder[PifuOrder["01_gongzhu"] = 0] = "01_gongzhu";
                PifuOrder[PifuOrder["02_chiji"] = 1] = "02_chiji";
                PifuOrder[PifuOrder["03_change"] = 2] = "03_change";
                PifuOrder[PifuOrder["04_huiguniang"] = 3] = "04_huiguniang";
                PifuOrder[PifuOrder["05_tianshi"] = 4] = "05_tianshi";
                PifuOrder[PifuOrder["06_xiaohongmao"] = 5] = "06_xiaohongmao";
                PifuOrder[PifuOrder["07_xiaohuangya"] = 6] = "07_xiaohuangya";
                PifuOrder[PifuOrder["08_zhenzi"] = 7] = "08_zhenzi";
                PifuOrder[PifuOrder["09_aisha"] = 8] = "09_aisha";
                PifuOrder[PifuOrder["10_huli"] = 9] = "10_huli";
            })(PifuOrder = Enum.PifuOrder || (Enum.PifuOrder = {}));
            let PifuAllName;
            (function (PifuAllName) {
                PifuAllName[PifuAllName["01_gongzhu"] = 0] = "01_gongzhu";
                PifuAllName[PifuAllName["02_chiji"] = 1] = "02_chiji";
                PifuAllName[PifuAllName["03_change"] = 2] = "03_change";
                PifuAllName[PifuAllName["04_huiguniang"] = 3] = "04_huiguniang";
                PifuAllName[PifuAllName["05_tianshi"] = 4] = "05_tianshi";
                PifuAllName[PifuAllName["06_xiaohongmao"] = 5] = "06_xiaohongmao";
                PifuAllName[PifuAllName["07_xiaohuangya"] = 6] = "07_xiaohuangya";
                PifuAllName[PifuAllName["08_zhenzi"] = 7] = "08_zhenzi";
                PifuAllName[PifuAllName["09_aisha"] = 8] = "09_aisha";
                PifuAllName[PifuAllName["10_huli"] = 9] = "10_huli";
            })(PifuAllName = Enum.PifuAllName || (Enum.PifuAllName = {}));
            let PifuSkin;
            (function (PifuSkin) {
                PifuSkin[PifuSkin["UI_new/Pifu/pifu_01_gongzhu.png"] = 0] = "UI_new/Pifu/pifu_01_gongzhu.png";
                PifuSkin[PifuSkin["UI_new/Pifu/pifu_02_chiji.png"] = 1] = "UI_new/Pifu/pifu_02_chiji.png";
                PifuSkin[PifuSkin["UI_new/Pifu/pifu_03_change.png"] = 2] = "UI_new/Pifu/pifu_03_change.png";
                PifuSkin[PifuSkin["UI_new/Pifu/pifu_04_huiguniang.png"] = 3] = "UI_new/Pifu/pifu_04_huiguniang.png";
                PifuSkin[PifuSkin["UI_new/Pifu/pifu_05_tianshi.png"] = 4] = "UI_new/Pifu/pifu_05_tianshi.png";
                PifuSkin[PifuSkin["UI_new/Pifu/pifu_06_xiaohongmao.png"] = 5] = "UI_new/Pifu/pifu_06_xiaohongmao.png";
                PifuSkin[PifuSkin["UI_new/Pifu/pifu_07_xiaohuangya.png"] = 6] = "UI_new/Pifu/pifu_07_xiaohuangya.png";
                PifuSkin[PifuSkin["UI_new/Pifu/pifu_08_zhenzi.png"] = 7] = "UI_new/Pifu/pifu_08_zhenzi.png";
                PifuSkin[PifuSkin["UI_new/Pifu/pifu_09_aisha.png"] = 8] = "UI_new/Pifu/pifu_09_aisha.png";
                PifuSkin[PifuSkin["UI_new/Pifu/pifu_10_huli.png"] = 9] = "UI_new/Pifu/pifu_10_huli.png";
            })(PifuSkin = Enum.PifuSkin || (Enum.PifuSkin = {}));
            let PifuSkin_No;
            (function (PifuSkin_No) {
                PifuSkin_No[PifuSkin_No["UI_new/Pifu/pifu_01_gongzhu_h.png"] = 0] = "UI_new/Pifu/pifu_01_gongzhu_h.png";
                PifuSkin_No[PifuSkin_No["UI_new/Pifu/pifu_02_chiji_h.png"] = 1] = "UI_new/Pifu/pifu_02_chiji_h.png";
                PifuSkin_No[PifuSkin_No["UI_new/Pifu/pifu_03_change_h.png"] = 2] = "UI_new/Pifu/pifu_03_change_h.png";
                PifuSkin_No[PifuSkin_No["UI_new/Pifu/pifu_04_huiguniang_h.png"] = 3] = "UI_new/Pifu/pifu_04_huiguniang_h.png";
                PifuSkin_No[PifuSkin_No["UI_new/Pifu/pifu_05_tianshi_h.png"] = 4] = "UI_new/Pifu/pifu_05_tianshi_h.png";
                PifuSkin_No[PifuSkin_No["UI_new/Pifu/pifu_06_xiaohongmao_h.png"] = 5] = "UI_new/Pifu/pifu_06_xiaohongmao_h.png";
                PifuSkin_No[PifuSkin_No["UI_new/Pifu/pifu_07_xiaohuangya_h.png"] = 6] = "UI_new/Pifu/pifu_07_xiaohuangya_h.png";
                PifuSkin_No[PifuSkin_No["UI_new/Pifu/pifu_08_zhenzi_h.png"] = 7] = "UI_new/Pifu/pifu_08_zhenzi_h.png";
                PifuSkin_No[PifuSkin_No["UI_new/Pifu/pifu_09_aisha_h.png"] = 8] = "UI_new/Pifu/pifu_09_aisha_h.png";
                PifuSkin_No[PifuSkin_No["UI_new/Pifu/pifu_10_huli_h.png"] = 9] = "UI_new/Pifu/pifu_10_huli_h.png";
            })(PifuSkin_No = Enum.PifuSkin_No || (Enum.PifuSkin_No = {}));
            let PifuNameSkin;
            (function (PifuNameSkin) {
                PifuNameSkin[PifuNameSkin["UI_new/Pifu/word_xueer.png"] = 0] = "UI_new/Pifu/word_xueer.png";
                PifuNameSkin[PifuNameSkin["UI_new/Pifu/word_jingying.png"] = 1] = "UI_new/Pifu/word_jingying.png";
                PifuNameSkin[PifuNameSkin["UI_new/Pifu/word_change.png"] = 2] = "UI_new/Pifu/word_change.png";
                PifuNameSkin[PifuNameSkin["UI_new/Pifu/word_hui.png"] = 3] = "UI_new/Pifu/word_hui.png";
                PifuNameSkin[PifuNameSkin["UI_new/Pifu/word_tianshi.png"] = 4] = "UI_new/Pifu/word_tianshi.png";
                PifuNameSkin[PifuNameSkin["UI_new/Pifu/wrod_hongmao.png"] = 5] = "UI_new/Pifu/wrod_hongmao.png";
                PifuNameSkin[PifuNameSkin["UI_new/Pifu/word_huangya.png"] = 6] = "UI_new/Pifu/word_huangya.png";
                PifuNameSkin[PifuNameSkin["UI_new/Pifu/word_changfa.png"] = 7] = "UI_new/Pifu/word_changfa.png";
                PifuNameSkin[PifuNameSkin["UI_new/Pifu/word_bingjing.png"] = 8] = "UI_new/Pifu/word_bingjing.png";
                PifuNameSkin[PifuNameSkin["UI_new/Pifu/word_huli.png"] = 9] = "UI_new/Pifu/word_huli.png";
            })(PifuNameSkin = Enum.PifuNameSkin || (Enum.PifuNameSkin = {}));
            let CaidanPifuName;
            (function (CaidanPifuName) {
                CaidanPifuName["huangpihaozi"] = "01_huangpihaozi";
                CaidanPifuName["zibiyazi"] = "02_zibiyazi";
                CaidanPifuName["cangshugongzhu"] = "03_cangshugongzhu";
                CaidanPifuName["kejigongzhu"] = "04_kejigongzhu";
                CaidanPifuName["saiyaren"] = "05_saiyaren";
                CaidanPifuName["haimiangongzhu"] = "06_haimiangongzhu";
                CaidanPifuName["daji"] = "07_daji";
            })(CaidanPifuName = Enum.CaidanPifuName || (Enum.CaidanPifuName = {}));
            let voiceUrl;
            (function (voiceUrl) {
                voiceUrl["btn"] = "voice/btn.wav";
                voiceUrl["bgm"] = "voice/bgm.mp3";
                voiceUrl["victory"] = "voice/guoguan.wav";
                voiceUrl["defeated"] = "voice/wancheng.wav";
            })(voiceUrl = Enum.voiceUrl || (Enum.voiceUrl = {}));
            let PifuAllName_Ch;
            (function (PifuAllName_Ch) {
                PifuAllName_Ch[PifuAllName_Ch["\u540C\u684C"] = 0] = "\u540C\u684C";
                PifuAllName_Ch[PifuAllName_Ch["\u5C0F\u6050\u9F99"] = 1] = "\u5C0F\u6050\u9F99";
                PifuAllName_Ch[PifuAllName_Ch["\u96EA\u4EBA"] = 2] = "\u96EA\u4EBA";
                PifuAllName_Ch[PifuAllName_Ch["\u557E\u557E"] = 3] = "\u557E\u557E";
                PifuAllName_Ch[PifuAllName_Ch["\u5C0F\u828A"] = 4] = "\u5C0F\u828A";
                PifuAllName_Ch[PifuAllName_Ch["\u9EA6\u5C14"] = 5] = "\u9EA6\u5C14";
                PifuAllName_Ch[PifuAllName_Ch["\u68D2\u7403\u5C0F\u5B50"] = 6] = "\u68D2\u7403\u5C0F\u5B50";
                PifuAllName_Ch[PifuAllName_Ch["\u9646\u80A5"] = 7] = "\u9646\u80A5";
                PifuAllName_Ch[PifuAllName_Ch["\u82F1\u96C4"] = 8] = "\u82F1\u96C4";
            })(PifuAllName_Ch = Enum.PifuAllName_Ch || (Enum.PifuAllName_Ch = {}));
            let TaskType;
            (function (TaskType) {
                TaskType["topUp"] = "topUp";
                TaskType["move"] = "move";
                TaskType["continue"] = "continue";
                TaskType["gold"] = "gold";
            })(TaskType = Enum.TaskType || (Enum.TaskType = {}));
            let PersonDir;
            (function (PersonDir) {
                PersonDir["up"] = "up";
                PersonDir["down"] = "down";
                PersonDir["left"] = "left";
                PersonDir["right"] = "right";
            })(PersonDir = Enum.PersonDir || (Enum.PersonDir = {}));
            let GameState;
            (function (GameState) {
                GameState["GameStart"] = "GameStart";
                GameState["Play"] = "Play";
                GameState["Pause"] = "pause";
                GameState["Victory"] = "victory";
                GameState["Defeated"] = "defeated";
            })(GameState = Enum.GameState || (Enum.GameState = {}));
            let MoveState;
            (function (MoveState) {
                MoveState["onFloor"] = "onFloor";
                MoveState["onLadder"] = "onLadder";
                MoveState["inAir"] = "inAir";
            })(MoveState = Enum.MoveState || (Enum.MoveState = {}));
            let BuffState;
            (function (BuffState) {
                BuffState["stick"] = "stick";
                BuffState["kettle"] = "kettle";
            })(BuffState = Enum.BuffState || (Enum.BuffState = {}));
            let RoomColor;
            (function (RoomColor) {
                RoomColor["blue"] = "blue";
                RoomColor["bluish"] = "bluish";
                RoomColor["grass"] = "grass";
                RoomColor["green"] = "green";
                RoomColor["pink"] = "pink";
                RoomColor["purple"] = "purple";
                RoomColor["red"] = "red";
                RoomColor["yellow"] = "yellow";
                RoomColor["yellowish"] = "yellowish";
            })(RoomColor = Enum.RoomColor || (Enum.RoomColor = {}));
            let RoomSkin;
            (function (RoomSkin) {
                RoomSkin["blue"] = "Room/room_blue.png";
                RoomSkin["bluish"] = "Room/room_bluish.png";
                RoomSkin["grass"] = "Room/room_grass.png";
                RoomSkin["green"] = "Room/room_green.png";
                RoomSkin["pink"] = "Room/room_pink.png";
                RoomSkin["purple"] = "Room/room_purple.png";
                RoomSkin["red"] = "Room/room_red.png";
                RoomSkin["yellow"] = "Room/room_yellow.png";
                RoomSkin["yellowish"] = "Room/room_yellowish.png";
            })(RoomSkin = Enum.RoomSkin || (Enum.RoomSkin = {}));
            let RoomSkinZoder;
            (function (RoomSkinZoder) {
                RoomSkinZoder[RoomSkinZoder["Room/room_blue.png"] = 0] = "Room/room_blue.png";
                RoomSkinZoder[RoomSkinZoder["Room/room_bluish.png"] = 1] = "Room/room_bluish.png";
                RoomSkinZoder[RoomSkinZoder["Room/room_grass.png"] = 2] = "Room/room_grass.png";
                RoomSkinZoder[RoomSkinZoder["Room/room_green.png"] = 3] = "Room/room_green.png";
                RoomSkinZoder[RoomSkinZoder["Room/room_pink.png"] = 4] = "Room/room_pink.png";
                RoomSkinZoder[RoomSkinZoder["Room/room_purple.png"] = 5] = "Room/room_purple.png";
                RoomSkinZoder[RoomSkinZoder["Room/room_red.png"] = 6] = "Room/room_red.png";
                RoomSkinZoder[RoomSkinZoder["Room/room_yellow.png"] = 7] = "Room/room_yellow.png";
                RoomSkinZoder[RoomSkinZoder["Room/room_yellowish.png"] = 8] = "Room/room_yellowish.png";
            })(RoomSkinZoder = Enum.RoomSkinZoder || (Enum.RoomSkinZoder = {}));
            let WallpaperSkin;
            (function (WallpaperSkin) {
                WallpaperSkin[WallpaperSkin["Room/room_blue_wallpaper.png"] = 0] = "Room/room_blue_wallpaper.png";
                WallpaperSkin[WallpaperSkin["Room/room_bluish_wallpaper.png"] = 1] = "Room/room_bluish_wallpaper.png";
                WallpaperSkin[WallpaperSkin["Room/room_grass_wallpaper.png"] = 2] = "Room/room_grass_wallpaper.png";
                WallpaperSkin[WallpaperSkin["Room/room_green_wallpaper.png"] = 3] = "Room/room_green_wallpaper.png";
                WallpaperSkin[WallpaperSkin["Room/room_pink_wallpaper.png"] = 4] = "Room/room_pink_wallpaper.png";
                WallpaperSkin[WallpaperSkin["Room/room_purple_wallpaper.png"] = 5] = "Room/room_purple_wallpaper.png";
                WallpaperSkin[WallpaperSkin["Room/room_red_wallpaper.png"] = 6] = "Room/room_red_wallpaper.png";
                WallpaperSkin[WallpaperSkin["Room/room_yellow_wallpaper.png"] = 7] = "Room/room_yellow_wallpaper.png";
                WallpaperSkin[WallpaperSkin["Room/room_yellowish_wallpaper.png"] = 8] = "Room/room_yellowish_wallpaper.png";
            })(WallpaperSkin = Enum.WallpaperSkin || (Enum.WallpaperSkin = {}));
            let WallSkin;
            (function (WallSkin) {
                WallSkin["blue"] = "Room/room_blue_wall.png";
                WallSkin["bluish"] = "Room/room_bluish_wall.png";
                WallSkin["grass"] = "Room/room_grass_wall.png";
                WallSkin["green"] = "Room/room_green_wall.png";
                WallSkin["pink"] = "Room/room_pink_wall.png";
                WallSkin["purple"] = "Room/room_purple_wall.png";
                WallSkin["red"] = "Room/room_red_wall.png";
                WallSkin["yellow"] = "Room/room_yellow_wall.png";
                WallSkin["yellowish"] = "Room/room_yellowish_wall.png";
                WallSkin["common"] = "Room/room_common_wall.png";
            })(WallSkin = Enum.WallSkin || (Enum.WallSkin = {}));
            let AisleColorSkin;
            (function (AisleColorSkin) {
                AisleColorSkin["blue"] = "Room/room_blue_color.png";
                AisleColorSkin["bluish"] = "Room/room_bluish_color.png";
                AisleColorSkin["grass"] = "Room/room_grass_color.png";
                AisleColorSkin["green"] = "Room/room_green_color.png";
                AisleColorSkin["pink"] = "Room/room_pink_color.png";
                AisleColorSkin["purple"] = "Room/room_purple_color.png";
                AisleColorSkin["red"] = "Room/room_red_color.png";
                AisleColorSkin["yellow"] = "Room/room_yellow_color.png";
                AisleColorSkin["yellowish"] = "Room/room_yellowish_color.png";
                AisleColorSkin["common"] = "Room/room_common_color.png";
            })(AisleColorSkin = Enum.AisleColorSkin || (Enum.AisleColorSkin = {}));
            let gongzhuAni;
            (function (gongzhuAni) {
                gongzhuAni["walk"] = "walk";
                gongzhuAni["die"] = "die";
                gongzhuAni["die_xianglian"] = "die_xianglian";
                gongzhuAni["walk_gun"] = "walk_gun";
                gongzhuAni["walk_shuihu"] = "walk_shuihu";
                gongzhuAni["walk_xianglian"] = "walk_xianglian";
                gongzhuAni["attack_gun"] = "attack_gun";
                gongzhuAni["attack_shuihu"] = "attack_shuihu";
                gongzhuAni["win"] = "win";
                gongzhuAni["win_xianglian"] = "win_xianglian";
            })(gongzhuAni = Enum.gongzhuAni || (Enum.gongzhuAni = {}));
            let dogAni;
            (function (dogAni) {
                dogAni["standby"] = "standby";
                dogAni["walk"] = "walk";
                dogAni["die"] = "die";
            })(dogAni = Enum.dogAni || (Enum.dogAni = {}));
            let wangziAni;
            (function (wangziAni) {
                wangziAni["standby"] = "standby";
                wangziAni["win"] = "win";
                wangziAni["walk"] = "walk";
            })(wangziAni = Enum.wangziAni || (Enum.wangziAni = {}));
            let houseAni;
            (function (houseAni) {
                houseAni["box_01_open"] = "box_01_open";
                houseAni["box_02_open"] = "box_02_open";
                houseAni["box_01_static"] = "box_01_static";
                houseAni["box_02_static"] = "box_02_static";
            })(houseAni = Enum.houseAni || (Enum.houseAni = {}));
        })(Enum = lwg.Enum || (lwg.Enum = {}));
        let Click;
        (function (Click) {
            let ClickType;
            (function (ClickType) {
                ClickType["noEffect"] = "noEffect";
                ClickType["largen"] = "largen";
                ClickType["balloon"] = "balloon";
                ClickType["beetle"] = "beetle";
            })(ClickType = Click.ClickType || (Click.ClickType = {}));
            function on(effect, audioUrl, target, caller, down, move, up, out) {
                let btnEffect;
                if (audioUrl) {
                    Click.audioUrl = audioUrl;
                }
                else {
                    Click.audioUrl = Enum.voiceUrl.btn;
                }
                switch (effect) {
                    case ClickType.noEffect:
                        btnEffect = new Btn_NoEffect();
                        break;
                    case ClickType.largen:
                        btnEffect = new Btn_LargenEffect();
                        break;
                    case ClickType.balloon:
                        btnEffect = new Btn_Balloon();
                        break;
                    case ClickType.balloon:
                        btnEffect = new Btn_Beetle();
                        break;
                    default:
                        btnEffect = new Btn_LargenEffect();
                        break;
                }
                target.on(Laya.Event.MOUSE_DOWN, caller, down === null ? btnEffect.down : down);
                target.on(Laya.Event.MOUSE_MOVE, caller, move === null ? btnEffect.move : move);
                target.on(Laya.Event.MOUSE_UP, caller, up === null ? btnEffect.up : up);
                target.on(Laya.Event.MOUSE_OUT, caller, out === null ? btnEffect.out : out);
            }
            Click.on = on;
            function off(effect, target, caller, down, move, up, out) {
                let btnEffect;
                switch (effect) {
                    case 'largen':
                        btnEffect = new Btn_LargenEffect();
                        break;
                    case 'balloon':
                        btnEffect = new Btn_Balloon();
                        break;
                    case 'beetle':
                        btnEffect = new Btn_Beetle();
                        break;
                    default:
                        break;
                }
                target.off(Laya.Event.MOUSE_DOWN, caller, down === null ? btnEffect.down : down);
                target.off(Laya.Event.MOUSE_MOVE, caller, move === null ? btnEffect.move : move);
                target.off(Laya.Event.MOUSE_UP, caller, up === null ? btnEffect.up : up);
                target.off(Laya.Event.MOUSE_OUT, caller, out === null ? btnEffect.out : out);
            }
            Click.off = off;
        })(Click = lwg.Click || (lwg.Click = {}));
        class Btn_NoEffect {
            constructor() {
            }
            down(event) {
                console.log('无点击效果的点击');
            }
            move(event) {
            }
            up(event) {
            }
            out(event) {
            }
        }
        lwg.Btn_NoEffect = Btn_NoEffect;
        class Btn_LargenEffect {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(1.1, 1.1);
                if (lwg.PalyAudio._voiceSwitch) {
                    Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
                }
            }
            move(event) {
            }
            up(event) {
                event.currentTarget.scale(1, 1);
            }
            out(event) {
                event.currentTarget.scale(1, 1);
            }
        }
        lwg.Btn_LargenEffect = Btn_LargenEffect;
        class Btn_Balloon {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(Click.balloonScale + 0.06, Click.balloonScale + 0.06);
                Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
            }
            up(event) {
                event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
            }
            move(event) {
                event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
            }
            out(event) {
                event.currentTarget.scale(Click.balloonScale, Click.balloonScale);
            }
        }
        lwg.Btn_Balloon = Btn_Balloon;
        class Btn_Beetle {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(Click.beetleScale + 0.06, Click.beetleScale + 0.06);
                Laya.SoundManager.playSound(Click.audioUrl, 1, Laya.Handler.create(this, function () { }));
            }
            up(event) {
                event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
            }
            move(event) {
                event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
            }
            out(event) {
                event.currentTarget.scale(Click.beetleScale, Click.beetleScale);
            }
        }
        lwg.Btn_Beetle = Btn_Beetle;
        let Animation;
        (function (Animation) {
            function simple_Rotate(node, Frotate, Erotate, time, func) {
                node.rotation = Frotate;
                Laya.Tween.to(node, { rotation: Erotate }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), 0);
            }
            Animation.simple_Rotate = simple_Rotate;
            function upDown_Overturn(node, time, func) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), 0);
            }
            Animation.upDown_Overturn = upDown_Overturn;
            function leftRight_Overturn(node, time, func) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                            }), 0);
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Animation.leftRight_Overturn = leftRight_Overturn;
            function leftRight_Shake(node, range, time, delayed, func) {
                Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }));
                    }));
                }), delayed);
            }
            Animation.leftRight_Shake = leftRight_Shake;
            function upDwon_Shake(node, range, time, delayed, func) {
                Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { y: node.y - range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }));
                    }));
                }), delayed);
            }
            Animation.upDwon_Shake = upDwon_Shake;
            function fadeOut(node, alpha1, alpha2, time, delayed, func) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.fadeOut = fadeOut;
            function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.fadeOut_KickBack = fadeOut_KickBack;
            function move_FadeOut(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_FadeOut = move_FadeOut;
            function move_Fade_Out(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 1;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 0, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_Fade_Out = move_Fade_Out;
            function move_FadeOut_Scale_01(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.targetX = 0;
                node.targetY = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_FadeOut_Scale_01 = move_FadeOut_Scale_01;
            function move_Scale(node, fScale, fX, fY, tX, tY, eScale, time, delayed, func) {
                node.scaleX = fScale;
                node.scaleY = fScale;
                node.x = fX;
                node.y = fY;
                Laya.Tween.to(node, { x: tX, y: tY, scaleX: eScale, scaleY: eScale }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_Scale = move_Scale;
            function rotate_Scale(target, fRotate, fScaleX, fScaleY, eRotate, eScaleX, eScaleY, time, delayed, func) {
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                target.rotation = fRotate;
                Laya.Tween.to(target, { rotation: eRotate, scaleX: eScaleX, scaleY: eScaleY }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { rotation: 0, scaleX: 1, scaleY: 1 }, time / 2, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), delayed);
                }), 0);
            }
            Animation.rotate_Scale = rotate_Scale;
            function drop_Simple(node, fY, tY, rotation, time, delayed, func) {
                node.y = fY;
                Laya.Tween.to(node, { y: tY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.drop_Simple = drop_Simple;
            function drop_KickBack(target, fAlpha, firstY, targetY, extendY, time1, delayed, func) {
                target.alpha = fAlpha;
                target.y = firstY;
                Laya.Tween.to(target, { alpha: 1, y: targetY + extendY }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: targetY - extendY / 2 }, time1 / 2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { y: targetY }, time1 / 4, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.drop_KickBack = drop_KickBack;
            function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func) {
                Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.drop_Excursion = drop_Excursion;
            function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func) {
                node.y = initialY;
                node.rotation = initialR;
                Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.goUp_Simple = goUp_Simple;
            function cardRotateX_TowFace(node, arr, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (arr) {
                        for (let i = 0; i < arr.length; i++) {
                            let child = node.getChildByName(arr[i]);
                            if (child !== null) {
                                child['alpha'] = 0;
                            }
                        }
                    }
                    if (func1 !== null) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time * 0.9, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time * 0.8, null, Laya.Handler.create(this, function () {
                            if (arr) {
                                for (let i = 0; i < arr.length; i++) {
                                    let child = node.getChildByName(arr[i]);
                                    if (child !== null) {
                                        child['alpha'] = 1;
                                    }
                                }
                            }
                            Laya.Tween.to(node, { scaleX: 1 }, time * 0.7, null, Laya.Handler.create(this, function () {
                                if (func2 !== null) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.cardRotateX_TowFace = cardRotateX_TowFace;
            function cardRotateX_OneFace(node, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func1 !== null) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        if (func2 !== null) {
                            func2();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.cardRotateX_OneFace = cardRotateX_OneFace;
            function cardRotateY_TowFace(node, arr, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (arr) {
                        for (let i = 0; i < arr.length; i++) {
                            let child = node.getChildByName(arr[i]);
                            if (child !== null) {
                                child['alpha'] = 0;
                            }
                        }
                    }
                    if (func1 !== null) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time * 1 / 2, null, Laya.Handler.create(this, function () {
                                if (arr) {
                                    for (let i = 0; i < arr.length; i++) {
                                        let child = node.getChildByName(arr[i]);
                                        if (child !== null) {
                                            child['alpha'] = 1;
                                        }
                                    }
                                }
                                if (func2 !== null) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.cardRotateY_TowFace = cardRotateY_TowFace;
            function cardRotateY_OneFace(node, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func1 !== null) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        if (func2 !== null) {
                            func2();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.cardRotateY_OneFace = cardRotateY_OneFace;
            function move_changeRotate(node, targetX, targetY, per, rotation_pe, time, func) {
                let targetPerX = targetX * per + node.x * (1 - per);
                let targetPerY = targetY * per + node.y * (1 - per);
                Laya.Tween.to(node, { x: targetPerX, y: targetPerY, rotation: 45 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: targetX, y: targetY, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), 0);
            }
            Animation.move_changeRotate = move_changeRotate;
            function bombs_Appear(node, firstAlpha, firstScale, scale1, rotation, time1, time2, delayed, audioType, func) {
                node.scale(0, 0);
                node.alpha = firstAlpha;
                Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, rotation: rotation }, time1, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.2, scaleY: firstScale + (scale1 - firstScale) * 0.2, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.bombs_Appear = bombs_Appear;
            function bombs_Vanish(node, scale, alpha, rotation, time, delayed, func) {
                Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.bombs_Vanish = bombs_Vanish;
            function swell_shrink(node, firstScale, scale1, time, delayed, func) {
                Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.5, scaleY: firstScale + (scale1 - firstScale) * 0.5, rotation: 0 }, time * 0.5, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.swell_shrink = swell_shrink;
            function move_Simple(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_Simple = move_Simple;
            function move_Simple_01(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { x: targetX, y: targetY }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.move_Simple_01 = move_Simple_01;
            function move_Deform_X(node, firstX, firstR, targetX, scaleX, scaleY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.rotation = firstR;
                Laya.Tween.to(node, { x: targetX, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.move_Deform_X = move_Deform_X;
            function move_Deform_Y(target, firstY, firstR, targeY, scaleX, scaleY, time, delayed, func) {
                target.alpha = 0;
                if (firstY) {
                    target.y = firstY;
                }
                target.rotation = firstR;
                Laya.Tween.to(target, { y: targeY, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.move_Deform_Y = move_Deform_Y;
            function blink_FadeOut_v(target, minAlpha, maXalpha, time, delayed, func) {
                target.alpha = minAlpha;
                Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.blink_FadeOut_v = blink_FadeOut_v;
            function blink_FadeOut(target, minAlpha, maXalpha, time, delayed, func) {
                Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.blink_FadeOut = blink_FadeOut;
            function shookHead_Simple(target, rotate, time, delayed, func) {
                let firstR = target.rotation;
                Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { rotation: firstR - rotate * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(target, { rotation: firstR }, time, null, Laya.Handler.create(this, function () {
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation.shookHead_Simple = shookHead_Simple;
            function HintAni_01(target, upNum, time1, stopTime, downNum, time2, func) {
                target.alpha = 0;
                Laya.Tween.to(target, { alpha: 1, y: target.y - upNum }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: target.y - 15 }, stopTime, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { alpha: 0, y: target.y + upNum + downNum }, time2, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Animation.HintAni_01 = HintAni_01;
            function scale_Alpha(target, fAlpha, fScaleX, fScaleY, eScaleX, eScaleY, eAlpha, time, delayed, func) {
                target.alpha = fAlpha;
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY, alpha: eAlpha }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.scale_Alpha = scale_Alpha;
            function scale_Simple(target, fScaleX, fScaleY, eScaleX, eScaleY, time, delayed, func) {
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY, }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation.scale_Simple = scale_Simple;
            function scale_Scale(target, fScale, eScale, time, delayed, func) {
                target.scale(fScale, fScale);
                Laya.Tween.to(target, { scaleX: eScale, scaleY: eScale }, time / 2, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { scaleX: fScale, scaleY: fScale }, time / 2, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation.scale_Scale = scale_Scale;
            function rotate_Magnify_KickBack(node, eAngle, eScale, time1, time2, delayed1, delayed2, func) {
                node.alpha = 0;
                node.scaleX = 0;
                node.scaleY = 0;
                Laya.Tween.to(node, { alpha: 1, rotation: 360 + eAngle, scaleX: 1 + eScale, scaleY: 1 + eScale }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { rotation: 360 - eAngle / 2, scaleX: 1 + eScale / 2, scaleY: 1 + eScale / 2 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { rotation: 360 + eAngle / 3, scaleX: 1 + eScale / 5, scaleY: 1 + eScale / 5 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { rotation: 360, scaleX: 1, scaleY: 1 }, time2, null, Laya.Handler.create(this, function () {
                                node.rotation = 0;
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), delayed2);
                    }), 0);
                }), delayed1);
            }
            Animation.rotate_Magnify_KickBack = rotate_Magnify_KickBack;
        })(Animation = lwg.Animation || (lwg.Animation = {}));
        let PalyAudio;
        (function (PalyAudio) {
            PalyAudio._voiceSwitch = true;
            function playSound(url, number) {
                if (PalyAudio._voiceSwitch) {
                    Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () { }));
                }
            }
            PalyAudio.playSound = playSound;
            function playMusic(url, number, deley) {
                if (PalyAudio._voiceSwitch) {
                    Laya.SoundManager.playMusic(url, number, Laya.Handler.create(this, function () { }), deley);
                }
            }
            PalyAudio.playMusic = playMusic;
            function stopMusic() {
                Laya.SoundManager.stopMusic();
            }
            PalyAudio.stopMusic = stopMusic;
        })(PalyAudio = lwg.PalyAudio || (lwg.PalyAudio = {}));
        let Tools;
        (function (Tools) {
            function drawPieMask(parent, startAngle, endAngle) {
                parent.cacheAs = "bitmap";
                let drawPieSpt = new Laya.Sprite();
                drawPieSpt.blendMode = "destination-out";
                parent.addChild(drawPieSpt);
                let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                return drawPie;
            }
            Tools.drawPieMask = drawPieMask;
            function transitionScreenPointfor3D(v3, camera) {
                let ScreenV3 = new Laya.Vector3();
                camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV3);
                let point = new Laya.Vector2();
                point.x = ScreenV3.x;
                point.y = ScreenV3.y;
                return point;
            }
            Tools.transitionScreenPointfor3D = transitionScreenPointfor3D;
            function random(n, m) {
                m = m || 10;
                const c = m - n + 1;
                return Math.floor(Math.random() * c + n);
            }
            Tools.random = random;
            function getRandomArrayElements(arr, count) {
                var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
                while (i-- > min) {
                    index = Math.floor((i + 1) * Math.random());
                    temp = shuffled[index];
                    shuffled[index] = shuffled[i];
                    shuffled[i] = temp;
                }
                return shuffled.slice(min);
            }
            Tools.getRandomArrayElements = getRandomArrayElements;
            function getArrayDifElements(arr, count) {
                const result = [];
                let i = 0;
                for (i; i < count; i++) {
                    const temp = getDiffEle(arr.slice(), result, i);
                    result.push(temp);
                }
                return result;
            }
            Tools.getArrayDifElements = getArrayDifElements;
            function getDiffEle(arr, result, place) {
                let indexArr = [];
                let i = 0;
                for (i; i < arr.length - place; i++) {
                    indexArr.push(i);
                }
                const ranIndex = Math.floor(Math.random() * indexArr.length);
                if (result.indexOf(arr[ranIndex]) === -1) {
                    const backNum = arr[ranIndex];
                    arr[ranIndex] = arr[indexArr.length - 1];
                    return backNum;
                }
                else {
                    arr.splice(ranIndex, 1);
                    return getDiffEle(arr, result, place);
                }
            }
            Tools.getDiffEle = getDiffEle;
            Tools.roleDragCan = false;
            function copydata(obj) {
                const ret = {};
                Object.getOwnPropertyNames(obj).forEach(name => {
                    ret[name] = obj[name];
                });
                return ret;
            }
            Tools.copydata = copydata;
            function fillArray(value, len) {
                var arr = [];
                for (var i = 0; i < len; i++) {
                    arr.push(value);
                }
                return arr;
            }
            Tools.fillArray = fillArray;
            function speedByAngle(angle, XY) {
                if (angle % 90 === 0 || !angle) {
                    console.error("计算的角度异常,需要查看：", angle);
                    return;
                }
                let speedXY = { x: 0, y: 0 };
                speedXY.y = XY.y;
                speedXY.x = speedXY.y / Math.tan(angle * Math.PI / 180);
                return speedXY;
            }
            Tools.speedByAngle = speedByAngle;
            function speedXYByAngle(angle, speed) {
                const speedXY = { x: 0, y: 0 };
                speedXY.x = speed * Math.cos(angle * Math.PI / 180);
                speedXY.y = speed * Math.sin(angle * Math.PI / 180);
                return speedXY;
            }
            Tools.speedXYByAngle = speedXYByAngle;
            function speedLabelByAngle(angle, speed, speedBate) {
                const speedXY = { x: 0, y: 0 };
                const selfAngle = angle;
                const defaultSpeed = speed;
                const bate = speedBate || 1;
                if (selfAngle % 90 === 0) {
                    if (selfAngle === 0 || selfAngle === 360) {
                        speedXY.x = Math.abs(defaultSpeed) * bate;
                    }
                    else if (selfAngle === 90) {
                        speedXY.y = Math.abs(defaultSpeed) * bate;
                    }
                    else if (selfAngle === 180) {
                        speedXY.x = -Math.abs(defaultSpeed) * bate;
                    }
                    else {
                        speedXY.y = -Math.abs(defaultSpeed) * bate;
                    }
                }
                else {
                    const tempXY = Tools.speedXYByAngle(selfAngle, defaultSpeed);
                    speedXY.x = tempXY.x;
                    speedXY.y = tempXY.y;
                    if (selfAngle > 0 && selfAngle < 180) {
                        speedXY.y = Math.abs(speedXY.y) * bate;
                    }
                    else {
                        speedXY.y = -Math.abs(speedXY.y) * bate;
                    }
                    if (selfAngle > 90 && selfAngle < 270) {
                        speedXY.x = -Math.abs(speedXY.x) * bate;
                    }
                    else {
                        speedXY.x = Math.abs(speedXY.x) * bate;
                    }
                }
                return speedXY;
            }
            Tools.speedLabelByAngle = speedLabelByAngle;
            function getRad(degree) {
                return degree / 180 * Math.PI;
            }
            Tools.getRad = getRad;
            function getRoundPos(angle, radius, centPos) {
                var center = centPos;
                var radius = radius;
                var hudu = (2 * Math.PI / 360) * angle;
                var X = center.x + Math.sin(hudu) * radius;
                var Y = center.y - Math.cos(hudu) * radius;
                return { x: X, y: Y };
            }
            Tools.getRoundPos = getRoundPos;
            function converteNum(num) {
                if (typeof (num) !== "number") {
                    console.warn("要转化的数字并不为number");
                    return num;
                }
                let backNum;
                if (num < 1000) {
                    backNum = "" + num;
                }
                else if (num < 1000000) {
                    backNum = "" + (num / 1000).toFixed(1) + "k";
                }
                else if (num < 10e8) {
                    backNum = "" + (num / 1000000).toFixed(1) + "m";
                }
                else {
                    backNum = "" + num;
                }
                return backNum;
            }
            Tools.converteNum = converteNum;
        })(Tools = lwg.Tools || (lwg.Tools = {}));
    })(lwg || (lwg = {}));
    let Enum = lwg.Enum;
    let Global = lwg.Global;
    let Admin = lwg.Admin;
    let Click = lwg.Click;
    let Animation = lwg.Animation;
    let EventAdmin = lwg.EventAdmin;
    let Tools = lwg.Tools;
    let Effects = lwg.Effects;

    class UIAdvertising extends lwg.Admin.Scene {
        selfVars() {
            this.SceneContent = this.self['SceneContent'];
            this.Star = this.self['Star'];
        }
        adaptive() {
            this.SceneContent.y = Laya.stage.height / 2;
        }
        lwgInit() {
        }
        btnOnClick() {
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['background'], this, null, null, this.backgroundUp, null);
        }
        backgroundUp() {
            console.log('防止穿透！');
        }
        openAni() {
            this.aniTime = 100;
            this.aniDelayde = 100;
            Animation.scale_Alpha(this.SceneContent, 0, 0, 0, 1, 1, 1, this.aniTime * 5, this.aniDelayde * 0, f => {
                Laya.timer.once(this.aniTime * 15, this, () => {
                    Animation.scale_Alpha(this.SceneContent, 1, 1, 1, 0, 0, 0, this.aniTime * 2, this.aniDelayde * 0, f => {
                        this.self.close();
                    });
                });
            });
            for (let index = 0; index < this.Star.numChildren; index++) {
                const element = this.Star.getChildAt(index);
                Animation.blink_FadeOut(element, 0, 1, this.aniTime * 5, Math.random() * 3 * this.aniDelayde, () => {
                    Animation.blink_FadeOut(element, Math.random() * 0.3 + 0.2, 1, this.aniTime * 3, Math.random() * 3 * 0, () => {
                        Animation.blink_FadeOut(element, Math.random() * 0.3 + 0.2, 1, this.aniTime * 3, Math.random() * 3 * 0, () => {
                            Animation.blink_FadeOut(element, Math.random() * 0.3 + 0.2, 1, this.aniTime * 3, Math.random() * 3 * 0, () => {
                            });
                        });
                    });
                });
            }
            return 100;
        }
        lwgDisable() {
            EventAdmin.notify(EventAdmin.EventType.advertising);
        }
    }

    class UIAnchorXD extends lwg.Admin.Scene {
        btnOnClick() {
            lwg.Click.on('largen', null, this.self['BtnYes'], this, null, null, this.btnYesClickUP, null);
            lwg.Click.on('largen', null, this.self['BtnNo'], this, null, null, this.btnNoClickUP, null);
        }
        btnYesClickUP(event) {
            event.currentTarget.scale(1, 1);
            ADManager.ShowReward(() => {
                this.btnYesFunc();
            });
        }
        btnYesFunc() {
            console.log('获得了一个主播限定皮肤！');
        }
        btnNoClickUP(event) {
            event.currentTarget.scale(1, 1);
            this.self.close();
        }
    }

    class UICaidanPifu extends lwg.Admin.Scene {
        constructor() { super(); }
        selfVars() {
            this.SceneContent = this.self['SceneContent'];
        }
        lwgInit() {
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_HMskin');
            ADManager.TAPoint(TaT.PageEnter, 'HMskinpage');
            lwg.Global._stageClick = false;
        }
        adaptive() {
            this.SceneContent.y = Laya.stage.height * 0.528;
        }
        btnOnClick() {
            lwg.Click.on('largen', null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
            lwg.Click.on('largen', null, this.self['BtnFreeGet'], this, null, null, this.btnFreeUp, null);
        }
        btnNoUp(event) {
            this.self.close();
        }
        btnFreeUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_HMskin');
            event.currentTarget.scale(1, 1);
            ADManager.ShowReward(() => {
                lwg.Global._haimiangongzhu = true;
                lwg.Global._createHint_01(lwg.Enum.HintType.haimiangongzhu);
                lwg.LocalStorage.addData();
                this.self.close();
            });
        }
        lwgDisable() {
            ADManager.TAPoint(TaT.PageLeave, 'HMskinpage');
            lwg.Global._stageClick = true;
        }
    }

    class CaiDanData {
        GetIconPath() {
            this.IconPath = "CaiDanQIang/Skin/" + this.ID + ".png";
            return this.IconPath;
        }
        GetIconPath_h() {
            this.IconPath_h = "CaiDanQIang/Skin/" + this.ID + "_01.png";
            return this.IconPath_h;
        }
    }

    class CaiDanQiang extends Laya.Script {
        constructor() {
            super(...arguments);
            this.icon = [
                { ID: 0, Name: "黄皮耗子", Info: "", MesLiayuan: "转盘", MesFangshi: "直接把它从转盘拖出来", Tip: lwg.Enum.CaidanPifuName.huangpihaozi },
                { ID: 1, Name: "自闭鸭子", Info: "", MesLiayuan: "转盘", MesFangshi: "转盘抽奖获得", Tip: lwg.Enum.CaidanPifuName.zibiyazi },
                { ID: 2, Name: "仓鼠公主", Info: "", MesLiayuan: "从彩蛋墙上的神蛋获得", MesFangshi: "点击左边的神蛋", Tip: lwg.Enum.CaidanPifuName.cangshugongzhu },
                { ID: 3, Name: "柯基公主", Info: "", MesLiayuan: "召唤神龙许愿概率获得", MesFangshi: "同时点击彩弹墙的两个彩蛋", Tip: lwg.Enum.CaidanPifuName.kejigongzhu },
                { ID: 4, Name: "塞牙人", Info: "（也可能不是）", MesLiayuan: "彩蛋墙内神秘操作获得", MesFangshi: "长按这个皮肤的剪影3秒", Tip: lwg.Enum.CaidanPifuName.saiyaren },
                { ID: 5, Name: "海绵公主", Info: "", MesLiayuan: "主界面神秘操作获得", MesFangshi: "同时点击皮肤和彩蛋墙按钮", Tip: lwg.Enum.CaidanPifuName.haimiangongzhu },
            ];
            this.Caidan = [];
            this.CaiDanDatas1 = [];
            this.CaiDanDatas2 = [];
            this.Skin = [];
            this.Skinitems = [];
            this.ImageX = 0;
            this.ImageY = 0;
            this.xmin = 160;
            this.xmax = 255;
            this.ymin = 103;
            this.ymax = 210;
            this.CanGet = false;
            this.props = [];
            this.Rewardindex = 5;
        }
        LoadXml() {
            let self = this;
            let loadXml = function () {
                self.LoadXml2();
            };
            Laya.loader.load("CaiDanQIang/CaiDanConfig.xml", Laya.Handler.create(this, function () {
                loadXml();
            }));
        }
        LoadXml2() {
            let xmlDom = Laya.Loader.getRes("CaiDanQIang/CaiDanConfig.xml");
            console.log(xmlDom);
            let attr = xmlDom.childNodes[0].childNodes;
            for (var i = 0; i < attr.length; i++) {
                let temp = new CaiDanData();
                for (var j = 0; j < attr[i].attributes.length; j++) {
                    if (attr[i].attributes[j].nodeName == "ID") {
                        temp.ID = parseInt(attr[i].attributes[j].nodeValue);
                    }
                    else if (attr[i].attributes[j].nodeName == "Name") {
                        temp.Name = attr[i].attributes[j].nodeValue;
                    }
                    else if (attr[i].attributes[j].nodeName == "MesLiayuan") {
                        temp.MesLiayuan = attr[i].attributes[j].nodeValue;
                    }
                    else if (attr[i].attributes[j].nodeName == "MesFangshi") {
                        temp.MesFangshi = attr[i].attributes[j].nodeValue;
                    }
                    else if (attr[i].attributes[j].nodeName == "Info") {
                        temp.Info = attr[i].attributes[j].nodeValue;
                    }
                }
                console.log(temp);
                this.CaiDanDatas1.push(temp);
            }
        }
        LoadJson() {
            for (let i = 0; i < this.icon.length; i++) {
                let temp = new CaiDanData();
                temp.ID = this.icon[i].ID;
                temp.Name = this.icon[i].Name;
                temp.Info = this.icon[i].Info;
                temp.MesLiayuan = this.icon[i].MesLiayuan;
                temp.MesFangshi = this.icon[i].MesFangshi;
                temp.Tip = this.icon[i].Tip;
                this.CaiDanDatas2.push(temp);
            }
        }
        StorageInit() {
            let firstuse = Laya.LocalStorage.getItem("firstuse");
            if (firstuse) {
                if (firstuse == "0") {
                    this.CaiDanDatas2.forEach((v) => {
                        Laya.LocalStorage.setItem("Caidanskin" + v.ID, "0_0_0");
                    });
                    Laya.LocalStorage.setItem("firstuse", "1");
                }
                else {
                    this.CaiDanDatas2.forEach((v) => {
                        if (Laya.LocalStorage.getItem("Caidanskin" + v.ID)) ;
                        else {
                            Laya.LocalStorage.setItem("Caidanskin" + v.ID, "0_0_0");
                        }
                    });
                }
            }
            else {
                this.CaiDanDatas2.forEach((v) => {
                    Laya.LocalStorage.setItem("Caidanskin" + v.ID, "0_0_0");
                });
                Laya.LocalStorage.setItem("firstuse", "1");
            }
            if (lwg.Global._huangpihaozi) {
                let skin = Laya.LocalStorage.getItem("Caidanskin" + 5);
                if (skin) {
                    let strs = skin.split("_");
                    Laya.LocalStorage.setItem("Caidanskin" + 0, "1" + "_" + strs[1] + "_" + strs[2]);
                }
                else {
                    Laya.LocalStorage.setItem("Caidanskin" + 0, "1" + "_" + 0 + "_" + 0);
                }
            }
            if (lwg.Global._zibiyazi) {
                let skin = Laya.LocalStorage.getItem("Caidanskin" + 5);
                if (skin) {
                    let strs = skin.split("_");
                    Laya.LocalStorage.setItem("Caidanskin" + 1, "1" + "_" + strs[1] + "_" + strs[2]);
                }
                else {
                    Laya.LocalStorage.setItem("Caidanskin" + 1, "1" + "_" + 0 + "_" + 0);
                }
            }
            if (lwg.Global._haimiangongzhu) {
                let skin = Laya.LocalStorage.getItem("Caidanskin" + 5);
                if (skin) {
                    let strs = skin.split("_");
                    Laya.LocalStorage.setItem("Caidanskin" + 5, "1" + "_" + strs[1] + "_" + strs[2]);
                }
                else {
                    Laya.LocalStorage.setItem("Caidanskin" + 5, "1" + "_" + 0 + "_" + 0);
                }
            }
        }
        onAwake() {
            ADManager.TAPoint(TaT.BtnShow, 'ADreward1bt_CDwall');
            ADManager.TAPoint(TaT.BtnShow, 'ADreward2bt_CDwall');
            ADManager.TAPoint(TaT.BtnShow, 'close_CDwall');
            ADManager.CloseBanner();
            this.LoadJson();
            this.Caidanqiang = this.owner;
            this.CaiDanShow = this.Caidanqiang.getChildByName("CaiDanShow");
            this.List0 = this.CaiDanShow.getChildByName("List0");
            this.List1 = this.CaiDanShow.getChildByName("List1");
            this.MesShow = this.Caidanqiang.getChildByName("MesShow");
            this.Icon = this.MesShow.getChildByName("Icon");
            this.IconDown = this.Icon.getChildByName("IconDown");
            this.IconUp = this.Icon.getChildByName("IconUp");
            this.IconUp_w = this.Icon.getChildByName("IconUp_w");
            this.MesLaiyuan = this.MesShow.getChildByName("MesLaiyuan");
            this.MesFangshi = this.MesShow.getChildByName("MesFangshi");
            this.Name = this.MesShow.getChildByName("Name");
            this.Info = this.MesShow.getChildByName("Info");
            this.LaiyuanADSafe = this.MesShow.getChildByName("LaiyuanADSafe");
            this.FangshiADSafe = this.MesShow.getChildByName("FangshiADSafe");
            lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.LaiyuanADSafe, this, null, null, this.LaiyuanADcLICK, null);
            lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.FangshiADSafe, this, null, null, this.FangshiADClick, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.owner.scene['BtnBack'], this, null, null, this.btnBackUP, null);
            this.CaidanRewardPanelinit1();
            this.CaiDanInit();
        }
        btnBackUP(e) {
            ADManager.TAPoint(TaT.BtnClick, 'close_CDwall');
            e.currentTarget.scale(1, 1);
            this.owner.scene.close();
        }
        onStart() {
            this.StorageInit();
            for (let i = 0; i < this.CaiDanShow.numChildren; i++) {
                let listitem = this.CaiDanShow.getChildAt(i);
                let itembox = listitem.getChildByName("ItermBox");
                for (let j = 0; j < itembox.numChildren; j++) {
                    this.Skin.push(itembox.getChildAt(j));
                    let a = itembox.getChildAt(j).getComponent(SkinItem);
                    this.Skinitems.push(a);
                }
            }
            this.Skinitems.forEach((v, i) => {
                v.Fell(this.CaiDanDatas2[i], this.Caidanqiang);
            });
            if (lwg.Global._pickPaintedNum) {
                this.CaiDanDatas2.forEach((v, i) => {
                    if (v.ID === lwg.Global._pickPaintedNum) {
                        this.NowCaidanDataq = v;
                    }
                });
            }
            else {
                this.NowCaidanDataq = this.CaiDanDatas2[0];
            }
        }
        RefreshView(skindata) {
            this.NowCaidanDataq = skindata;
            lwg.Global._pickPaintedNum = this.NowCaidanDataq.ID;
            this.IconDown.skin = skindata.GetIconPath();
            this.IconUp.skin = skindata.GetIconPath_h();
            this.MesFangshi.text = skindata.MesFangshi;
            this.MesLaiyuan.text = skindata.MesLiayuan;
            this.Name.text = skindata.Name;
            this.Info.text = skindata.Info;
            let itemstorage = Laya.LocalStorage.getItem("Caidanskin" + skindata.ID);
            let strs = itemstorage.split("_");
            this.IconUp.visible = strs[0] == "0";
            this.IconUp_w.visible = this.IconUp.visible;
            this.LaiyuanADSafe.visible = strs[1] == "0";
            this.FangshiADSafe.visible = strs[2] == "0";
            this.Skinitems.forEach((v, i) => {
                v.lightChange(skindata.ID);
            });
        }
        FangshiADClick() {
            ADManager.ShowReward(() => {
                ADManager.TAPoint(TaT.BtnClick, 'ADreward2bt_CDwall');
                let skin = Laya.LocalStorage.getItem("Caidanskin" + this.NowCaidanDataq.ID);
                let strs = skin.split("_");
                Laya.LocalStorage.setItem("Caidanskin" + this.NowCaidanDataq.ID, strs[0] + "_" + strs[1] + "_" + "1");
                this.RefreshView(this.NowCaidanDataq);
            });
        }
        LaiyuanADcLICK() {
            ADManager.TAPoint(TaT.BtnClick, 'ADreward1bt_CDwall');
            ADManager.ShowReward(() => {
                let skin = Laya.LocalStorage.getItem("Caidanskin" + this.NowCaidanDataq.ID);
                let strs = skin.split("_");
                Laya.LocalStorage.setItem("Caidanskin" + this.NowCaidanDataq.ID, strs[0] + "_" + "1" + "_" + strs[2]);
                this.RefreshView(this.NowCaidanDataq);
            });
        }
        CaidanRewardPanelinit1() {
            this.CaidanRewardPanel1 = this.Caidanqiang.getChildByName("CaidanRewardPanel");
            console.log(this.CaidanRewardPanel1);
            this.RewardBg1 = this.CaidanRewardPanel1.getChildByName("RewardBG");
            console.log(this.RewardBg1);
            this.ADGetReward1 = this.RewardBg1.getChildByName("ADGetReward");
            this.CloseRewardBtn1 = this.RewardBg1.getChildByName("CloseRewardBtn");
            console.log(this.ADGetReward1);
            console.log(this.CloseRewardBtn1);
            this.CaidanJiemianHide1();
            this.ADGetReward1.on(Laya.Event.CLICK, this, this.ADGetRewardClick1);
            this.CloseRewardBtn1.on(Laya.Event.CLICK, this, this.CaidanJiemianHide1);
        }
        CaidanJiemianShow1() {
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_SYskin');
            ADManager.TAPoint(TaT.PageEnter, 'SYskinpage');
            this.CaidanRewardPanel1.visible = true;
        }
        CaidanJiemianHide1() {
            this.CaidanRewardPanel1.visible = false;
            ADManager.TAPoint(TaT.PageLeave, 'SYskinpage');
        }
        ADGetRewardClick1() {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_SYskin');
            console.log('看广告');
            ADManager.ShowReward(() => {
                let skin = Laya.LocalStorage.getItem("Caidanskin" + 4);
                let strs = skin.split("_");
                Laya.LocalStorage.setItem("Caidanskin" + 4, "1" + "_" + strs[1] + "_" + strs[2]);
                this.CaidanJiemianHide1();
                this.Skinitems.forEach((v, i) => {
                    v.Fell(this.CaiDanDatas2[i], this.Caidanqiang);
                });
                lwg.Global._createHint_01(lwg.Enum.HintType.saiyaren);
            });
        }
        CaiDanInit() {
            this.Caidan1 = this.Caidanqiang.getChildByName("Caidan1");
            this.Caidan2 = this.Caidanqiang.getChildByName("Caidan2");
            this.Caidan1Init();
            this.Caidan2Init();
        }
        Caidan1Init() {
            this.Caidan1.on(Laya.Event.CLICK, this, this.CaidanJiemianShow2);
            this.CaidanRewardPanelinit2();
        }
        CaidanRewardPanelinit2() {
            this.CaidanRewardPanel2 = this.Caidanqiang.getChildByName("CaidanRewardPanel2");
            this.RewardBg2 = this.CaidanRewardPanel2.getChildByName("RewardBG");
            this.ADGetReward2 = this.RewardBg2.getChildByName("ADGetReward");
            this.CloseRewardBtn2 = this.RewardBg2.getChildByName("CloseRewardBtn");
            this.CaidanJiemianHide2();
            this.ADGetReward2.on(Laya.Event.CLICK, this, this.ADGetRewardClick2);
            this.CloseRewardBtn2.on(Laya.Event.CLICK, this, this.CaidanJiemianHide2);
        }
        CaidanJiemianShow2() {
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_CSskin');
            lwg.Animation.leftRight_Shake(this.Caidan1, 20, 100, 0, f => {
                lwg.Animation.leftRight_Shake(this.Caidan1, 20, 100, 0, f => {
                    let skin = Laya.LocalStorage.getItem("Caidanskin" + 2);
                    let strs = skin.split("_");
                    if (strs[0] == "1") ;
                    else {
                        this.CaidanRewardPanel2.visible = true;
                        ADManager.TAPoint(TaT.PageEnter, 'CSskinpage');
                    }
                });
            });
        }
        CaidanJiemianHide2() {
            this.CaidanRewardPanel2.visible = false;
        }
        ADGetRewardClick2() {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_CSskin');
            console.log('看广告!');
            ADManager.ShowReward(() => {
                ADManager.TAPoint(TaT.PageLeave, 'CSskinpage');
                let skin = Laya.LocalStorage.getItem("Caidanskin" + 2);
                let strs = skin.split("_");
                Laya.LocalStorage.setItem("Caidanskin" + 2, "1" + "_" + strs[1] + "_" + strs[2]);
                this.CaidanJiemianHide2();
                this.Skinitems.forEach((v, i) => {
                    v.Fell(this.CaiDanDatas2[i], this.Caidanqiang);
                });
                lwg.Global._createHint_01(lwg.Enum.HintType.cangshugongzhu);
            });
        }
        Caidan2Init() {
            this.xmax = this.Caidan1.x + 100;
            this.xmin = this.Caidan1.x - 100;
            this.ymax = this.Caidan1.y + 100;
            this.ymin = this.Caidan1.y - 100;
            this.caidanDan = this.Caidan2.getChildAt(0);
            console.log(this.caidanDan);
            this.caidanDan.on(Laya.Event.MOUSE_DOWN, this, this.CaiDanDown);
            this.caidanDan.on(Laya.Event.MOUSE_UP, this, this.CaiDanUp);
            this.caidanDan.on(Laya.Event.MOUSE_OUT, this, this.CaidanMoveOut);
            this.ImageX = this.caidanDan.x;
            this.ImageY = this.caidanDan.y;
            this.CaidanRewardPanelinit3();
        }
        CaiDanDown() {
            console.log("彩蛋点击事件");
            this.Caidanqiang.addChild(this.caidanDan);
            this.caidanDan.x = this.Caidanqiang.mouseX;
            this.caidanDan.y = this.Caidanqiang.mouseY;
            this.caidanDan.on(Laya.Event.MOUSE_MOVE, this, this.CaiDanMove);
        }
        CaiDanMove() {
            this.caidanDan.x = this.Caidanqiang.mouseX;
            this.caidanDan.y = this.Caidanqiang.mouseY;
            console.log(this.caidanDan.x, this.caidanDan.y);
            console.log(this.Caidanqiang.mouseX, this.Caidanqiang.mouseY);
        }
        CaidanMoveOut() {
            this.CaiDanUp();
        }
        CaiDanUp() {
            this.Caidan2.addChild(this.caidanDan);
            this.caidanDan.off(Laya.Event.MOUSE_MOVE, this, this.CaiDanMove);
            let x = this.caidanDan.x;
            let y = this.caidanDan.y;
            console.log(x, y);
            if (x > this.xmin && x < this.xmax && y > this.ymin && y < this.ymax) {
                console.log("展示神龙");
                this.CaidanRewardPanelShow();
            }
            else {
                console.log("位置恢复,不触发");
            }
            this.caidanDan.x = this.ImageX;
            this.caidanDan.y = this.ImageY;
        }
        CaidanRewardPanelinit3() {
            this.CaidanRewardPanel3 = this.Caidanqiang.getChildByName("CaidanRewardPanel3");
            this.Bg = this.CaidanRewardPanel3.getChildByName("Bg");
            this.Props = this.Bg.getChildByName("Props");
            this.ShenLongWenzi = this.Bg.getChildByName("ShenLongWenzi");
            for (let index = 0; index < this.Props.numChildren; index++) {
                this.props.push(this.Props.getChildAt(index));
            }
            this.ADGetReward = this.Bg.getChildByName("ADGetReward");
            this.GetReward = this.Bg.getChildByName("GetReward");
            this.ADGetReward.on(Laya.Event.CLICK, this, this.ADGetRewardClick);
            this.GetReward.on(Laya.Event.CLICK, this, this.GetRewardClick);
            console.log("this.props", this.props);
            this.CaidanRewardPanelHide();
        }
        CaidanRewardPanelShow() {
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_dragongift');
            ADManager.TAPoint(TaT.PageEnter, 'dragonpage');
            this.ShenLongWenzi.visible = this.Rewardindex == 5;
            this.Props.visible = !this.ShenLongWenzi.visible;
            this.ADGetReward.getChildAt(1).visible = !this.ShenLongWenzi.visible;
            this.CaidanRewardPanel3.visible = true;
        }
        CaidanRewardPanelHide() {
            this.CaidanRewardPanel3.visible = false;
        }
        ShowReward() {
            let ran = this.randomInRange_i(0, 100);
            if (ran >= 0 && ran < 1) {
                this.Rewardindex = 0;
            }
            else if (ran >= 1 && ran < 36) {
                this.Rewardindex = 1;
            }
            else if (ran >= 36 && ran < 66) {
                this.Rewardindex = 2;
            }
            else if (ran >= 66 && ran < 68) {
                this.Rewardindex = 3;
            }
            else if (ran >= 68 && ran < 100) {
                if (lwg.Global._kejigongzhu) {
                    this.Rewardindex = 3;
                }
                else {
                    this.Rewardindex = 4;
                }
            }
            if (this.Rewardindex == 5) ;
            else {
                this.props.forEach((v, i) => {
                    if (this.Rewardindex == i) {
                        v.visible = true;
                    }
                    else {
                        v.visible = false;
                    }
                });
            }
            this.ShenLongWenzi.visible = this.Rewardindex == 5;
            this.Props.visible = !this.ShenLongWenzi.visible;
            this.ADGetReward.getChildAt(1).visible = !this.ShenLongWenzi.visible;
            ADManager.TAPoint(TaT.PageEnter, 'dragongiftpage');
        }
        ADGetRewardClick() {
            ADManager.TAPoint(TaT.PageLeave, 'dragongiftpage');
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_dragongift');
            console.log("看广告");
            ADManager.ShowReward(() => {
                this.ShowReward();
                this.RewardGet();
            });
        }
        ClosePanel() {
            ADManager.TAPoint(TaT.PageLeave, 'dragonpage');
            this.RewardGet();
            this.ClosePanel();
        }
        GetRewardClick() {
            this.RewardGet();
            this.Rewardindex = 5;
            this.CaidanRewardPanelHide();
        }
        RewardGet() {
            if (this.Rewardindex == 0) {
                lwg.Global._addExecution(2);
                console.log("礼物", this.Rewardindex);
            }
            else if (this.Rewardindex == 1) {
                lwg.Global._addExecution(3);
                console.log("礼物", this.Rewardindex);
            }
            else if (this.Rewardindex == 2) {
                lwg.Global._addGold(20);
                console.log("礼物", this.Rewardindex);
            }
            else if (this.Rewardindex == 3) {
                lwg.Global._addGold(30);
                console.log("礼物", this.Rewardindex);
            }
            else if (this.Rewardindex == 4) {
                lwg.Global._kejigongzhu = true;
                lwg.LocalStorage.addData();
                let skin = Laya.LocalStorage.getItem("Caidanskin" + 3);
                let strs = skin.split("_");
                Laya.LocalStorage.setItem("Caidanskin" + 3, "1" + "_" + strs[1] + "_" + strs[2]);
                console.log("礼物", this.Rewardindex);
                lwg.Global._createHint_01(lwg.Enum.HintType.kejigongzhu);
            }
            else if (this.Rewardindex == 5) {
                console.log("无礼物");
            }
            this.Skinitems.forEach((v, i) => {
                v.Fell(this.CaiDanDatas2[i], this.Caidanqiang);
            });
        }
        randomInRange_i(x, y, s = null) {
            let rs;
            if (x == y) {
                rs = x;
            }
            else if (y > x) {
                let v = (y - x) * (s == null ? Math.random() : s) + x;
                rs = v.toFixed();
            }
            else {
                throw `x > y`;
            }
            return Number(rs);
        }
        onDisable() {
            let skin = Laya.LocalStorage.getItem("Caidanskin" + this.NowCaidanDataq.ID);
            let strs = skin.split("_");
            if (strs[0] === '1') {
                lwg.Global._currentPifu = this.NowCaidanDataq.Tip;
                lwg.LocalStorage.addData();
            }
            console.log(lwg.Global._currentPifu);
            ADManager.ShowBanner();
        }
    }

    class SkinItem extends Laya.Script {
        constructor() {
            super(...arguments);
            this.ID = 0;
            this.IsDown = false;
        }
        onAwake() {
            this.Skin = this.owner;
            this.Icon = this.Skin.getChildByName("Icon");
            this.Lock = this.Skin.getChildByName("Lock");
            this.light = this.Skin.getChildByName("light");
            this.light.visible = false;
            console.log(this.Icon, this.Lock, this.light);
            this.Skin.on(Laya.Event.MOUSE_DOWN, this, this.Down);
            this.Skin.on(Laya.Event.MOUSE_UP, this, this.Up);
            this.Skin.on(Laya.Event.MOUSE_OUT, this, this.Up);
        }
        Fell(_data, _caidanqiang) {
            this.data = _data;
            console.log("this.data ===>", this.data);
            this.caidanqiang = _caidanqiang.getComponent(CaiDanQiang);
            this.Refresh();
        }
        Refresh() {
            this.ID = this.data.ID;
            this.Icon.skin = this.data.GetIconPath();
            this.Lock.skin = this.data.GetIconPath_h();
            this.storage = Laya.LocalStorage.getItem("Caidanskin" + this.ID);
            this.storages = this.storage.split("_");
            this.Lock.visible = this.storages[0] == "0";
        }
        lightChange(ID) {
            if (this.ID === ID) {
                this.light.visible = true;
            }
            else {
                this.light.visible = false;
            }
        }
        Down() {
            console.log("按下后3S 不移开或是不抬起 并且皮肤未解锁 如果该皮肤为彩蛋 弹出框");
            if (this.ID == 4 && this.storages[0] == "0") {
                Laya.timer.once(3000, this, this.ShowReward);
            }
            this.IsDown = true;
        }
        Up() {
            if (this.IsDown) {
                this.caidanqiang.RefreshView(this.data);
                Laya.timer.clearAll(this);
                this.IsDown = false;
                this.light.visible = true;
            }
        }
        ShowReward() {
            console.log("展示奖励");
            this.caidanqiang.CaidanJiemianShow1();
        }
    }

    class UICheckIn extends lwg.Admin.Scene {
        constructor() {
            super();
            this.getNum = 3;
            this.aniSwitch = true;
        }
        selfVars() {
            this.checkList = this.self['CheckList'];
            this.createCheckList();
        }
        lwgInit() {
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_sign');
            let ChinkTip = this.self['BtnSeven'].getChildByName('ChinkTip');
            ChinkTip.visible = false;
            this.posArr = [
                [126, 262], [292, 262], [457, 262],
                [126, 422.5], [292, 422.5], [457, 422.5],
                [295, 588]
            ];
            if (lwg.Global._CheckInNum === 6) {
                Animation.shookHead_Simple(this.self['BtnSeven'], 10, 200, 0, f => {
                });
                Laya.timer.loop(1500, this, f => {
                    if (!this.aniSwitch) {
                        return;
                    }
                    Animation.shookHead_Simple(this.self['BtnSeven'], 10, 100, 0, f => {
                    });
                });
            }
            else {
                let todayCell = this.checkList.getCell(lwg.Global._CheckInNum);
                Animation.shookHead_Simple(todayCell, 10, 200, 0, f => {
                });
                Laya.timer.loop(1500, this, f => {
                    if (!this.aniSwitch) {
                        return;
                    }
                    Animation.shookHead_Simple(todayCell, 10, 100, 0, f => {
                    });
                });
            }
        }
        adaptive() {
            this.self['SceneContent'].y = Laya.stage.height / 2;
        }
        createCheckList() {
            this.checkList.spaceX = 5;
            this.checkList.spaceY = 0;
            this.checkList.selectHandler = new Laya.Handler(this, this.onSelect_List);
            this.checkList.renderHandler = new Laya.Handler(this, this.updateItem);
            this.refreshListData();
            this.listOpenAni();
        }
        listOpenAni() {
        }
        refreshListData() {
            var data = [];
            for (var m = 0; m < 6; m++) {
                let index = m.toString();
                let url = 'UI_new/CheckIn/word_' + (m + 1) + 'tian.png';
                let check = lwg.Global._CheckInNum > m ? true : false;
                data.push({
                    index,
                    url,
                    check
                });
            }
            this.checkList.array = data;
        }
        onSelect_List(index) {
        }
        updateItem(cell, index) {
            let dataSource = cell.dataSource;
            let DayNum = cell.getChildByName('DayNum');
            DayNum.skin = dataSource.url;
            let ChinkTip = cell.getChildByName('ChinkTip');
            ChinkTip.visible = dataSource.check;
        }
        btnOnClick() {
            lwg.Click.on('largen', null, this.self['BtnGet'], this, null, null, this.btnGetUp, null);
            lwg.Click.on('largen', null, this.self['BtnSelect'], this, null, null, this.btnSelectUp, null);
            lwg.Click.on('largen', null, this.self['BtnBack'], this, null, null, this.btnBackUp, null);
        }
        btnBackUp(event) {
            event.currentTarget.scale(1, 1);
            this.self.close();
        }
        btnGetUp(event) {
            let dot = this.self['BtnSelect'].getChildAt(0);
            if (dot.visible) {
                ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_sign');
                ADManager.ShowReward(() => {
                    this.aniSwitch = false;
                    this.btnGetUpFunc(3);
                });
            }
            else {
                this.btnGetUpFunc(1);
                this.aniSwitch = false;
            }
        }
        btnGetUpFunc(number) {
            if (lwg.Global._CheckInNum === 6) {
                let ChinkTip = this.self['BtnSeven'].getChildByName('ChinkTip');
                ChinkTip.visible = true;
                this.goldAni(50 * number);
            }
            else {
                this.checkList.array[lwg.Global._CheckInNum].check = true;
                this.checkList.refresh();
                this.goldAni(25 * number);
            }
            lwg.Global._CheckInNum++;
            if (lwg.Global._CheckInNum > 6) {
                lwg.Global._CheckInNum = 0;
            }
            lwg.Global._lastCheckIn = (new Date).getDate();
            lwg.LocalStorage.addData();
        }
        goldAni(number) {
            Laya.timer.frameOnce(30, this, f => {
                lwg.Effects.getGoldAni(Laya.stage, 10, Laya.stage.width / 2, Laya.stage.height / 2, lwg.Global.GoldNumNode.x - 53, lwg.Global.GoldNumNode.y - 12, f => {
                    lwg.Global._addGoldDisPlay(1);
                }, f => {
                    lwg.Global._addGold(number);
                    this.checkList.refresh();
                    this.self.close();
                });
            });
        }
        btnSelectUp(event) {
            event.currentTarget.scale(1, 1);
            let dot = this.self['BtnSelect'].getChildAt(0);
            if (dot.visible) {
                dot.visible = false;
            }
            else {
                dot.visible = true;
            }
        }
        lwgOnUpdta() {
            lwg.Global._stageClick = false;
        }
        lwgDisable() {
            lwg.Global._stageClick = true;
        }
    }

    class RecordManager {
        constructor() {
            this.GRV = null;
            this.isRecordVideoing = false;
            this.isVideoRecord = false;
            this.videoRecordTimer = 0;
            this.isHasVideoRecord = false;
        }
        static Init() {
            RecordManager.grv = new TJ.Platform.AppRt.DevKit.TT.GameRecorderVideo();
        }
        static startAutoRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (RecordManager.grv == null)
                RecordManager.Init();
            if (RecordManager.recording)
                return;
            RecordManager.autoRecording = true;
            console.log("******************开始录屏");
            RecordManager._start();
            RecordManager.lastRecordTime = Date.now();
        }
        static stopAutoRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (!RecordManager.autoRecording) {
                console.log("RecordManager.autoRecording", RecordManager.autoRecording);
                return false;
            }
            RecordManager.autoRecording = false;
            RecordManager._end(false);
            if (Date.now() - RecordManager.lastRecordTime > 6000) {
                return true;
            }
            if (Date.now() - RecordManager.lastRecordTime < 3000) {
                console.log("小于3秒");
                return false;
            }
            return true;
        }
        static startRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            if (RecordManager.autoRecording) {
                this.stopAutoRecord();
            }
            RecordManager.recording = true;
            RecordManager._start();
            RecordManager.lastRecordTime = Date.now();
        }
        static stopRecord() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("time:" + (Date.now() - RecordManager.lastRecordTime));
            if (Date.now() - RecordManager.lastRecordTime <= 3000) {
                return false;
            }
            RecordManager.recording = false;
            RecordManager._end(true);
            return true;
        }
        static _start() {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************180s  ？？？？？");
            RecordManager.grv.Start(180);
        }
        static _end(share) {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************180结束 ？？？？？");
            RecordManager.grv.Stop(share);
        }
        static _share(type, successedAc, completedAc = null, failAc = null) {
            if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt)
                return;
            console.log("******************吊起分享 ？？？？？", RecordManager.grv, RecordManager.grv.videoPath);
            if (RecordManager.grv.videoPath) {
                let p = new TJ.Platform.AppRt.Extern.TT.ShareAppMessageParam();
                p.extra.videoTopics = ["解救小王子", "番茄小游戏", "抖音小游戏"];
                p.channel = "video";
                p.success = () => {
                    lwg.Global._createHint_01(lwg.Enum.HintType.sharesuccess);
                    successedAc();
                };
                p.fail = () => {
                    if (type === 'noAward') {
                        lwg.Global._createHint_01(lwg.Enum.HintType.sharefailNoAward);
                    }
                    else {
                        lwg.Global._createHint_01(lwg.Enum.HintType.sharefail);
                    }
                    failAc();
                };
                RecordManager.grv.Share(p);
            }
            else {
                lwg.Global._createHint_01(lwg.Enum.HintType.novideo);
            }
        }
    }
    RecordManager.recording = false;
    RecordManager.autoRecording = false;

    class UIDefeated extends lwg.Admin.Scene {
        constructor() { super(); }
        lwgInit() {
            RecordManager.stopAutoRecord();
            this.BtnAgain = this.self['BtnAgain'];
            this.BtnLast = this.self['BtnLast'];
            this.BtnShare = this.self['BtnShare'];
            this.LvNum = this.self['LvNum'];
            this.LvNumDisplay();
            if (!lwg.Global._elect) {
                this.self['P201'].visible = false;
            }
            if (lwg.Global._shakeSwitch) {
                ADManager.Vibratelong();
            }
        }
        adaptive() {
            this.self['sceneContent'].y = Laya.stage.height / 2;
        }
        openAni() {
            this.self['BtnBack'].visible = false;
            setTimeout(() => {
                this.self['BtnBack'].visible = true;
            }, lwg.Global._btnDelayed);
            return 0;
        }
        LvNumDisplay() {
            if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                this.LvNum.value = lwg.Global._gameLevel.toString();
            }
            else {
                this.LvNum.value = lwg.Admin.openLevelNum.toString();
            }
        }
        btnOnClick() {
            ADManager.TAPoint(TaT.BtnShow, 'Share_success');
            ADManager.TAPoint(TaT.BtnShow, 'returnword_fail');
            ADManager.TAPoint(TaT.BtnShow, 'ADticketbt_fail');
            ADManager.TAPoint(TaT.BtnShow, 'Share_fail');
            lwg.Click.on('largen', null, this.BtnAgain, this, null, null, this.btnAgainUp, null);
            lwg.Click.on('largen', null, this.BtnLast, this, null, null, this.btnNextUp, null);
            lwg.Click.on('largen', null, this.BtnShare, this, null, null, this.btnShareUp, null);
            lwg.Click.on('largen', null, this.self['BtnBack'], this, null, null, this.btnBackUp, null);
        }
        btnAgainUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'returnword_fail');
            event.currentTarget.scale(1, 1);
            if (lwg.Global._execution < 2) {
                lwg.Global.intoBtn = 'BtnAgain';
                lwg.Admin._openScene('UIExecutionHint', null, null, null);
            }
            else {
                lwg.Global._execution -= 2;
                let num = lwg.Global.ExecutionNumNode.getChildByName('Num');
                num.value = lwg.Global._execution.toString();
                lwg.Global._createHint_01(lwg.Enum.HintType.consumeEx);
                lwg.Global.createConsumeEx(null);
                lwg.LocalStorage.addData();
                lwg.Admin._refreshScene();
                this.self.close();
            }
        }
        btnNextUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'ADnextbt_fail');
            event.currentTarget.scale(1, 1);
            if (lwg.Global._execution < 2) {
                lwg.Admin._openScene('UIExecutionHint', null, null, null);
                lwg.Global.intoBtn = 'BtnLast';
            }
            else {
                ADManager.ShowReward(() => {
                    this.btnNextUpFunc();
                });
            }
        }
        btnNextUpFunc() {
            if (Number(this.LvNum.value) >= 3) {
                lwg.Admin._openScene('UIPassHint', null, null, f => {
                    lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].afterDefeated = true;
                });
            }
            else {
                lwg.Admin._nextCustomScene(2);
            }
            this.self.close();
            lwg.LocalStorage.addData();
        }
        btnShareUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'Share_fail');
            event.currentTarget.scale(1, 1);
            RecordManager._share('noAward', () => {
                this.btnShareUpFunc();
            });
        }
        btnShareUpFunc() {
            console.log('分享成功，只是没有奖励！');
        }
        btnBackUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'ADticketbt_fail');
            event.currentTarget.scale(1, 1);
            lwg.Admin._openScene('UIStart', null, null, null);
            lwg.Admin._closeCustomScene();
            lwg.LocalStorage.addData();
            this.self.close();
        }
        onDisable() {
        }
    }

    class UIExecutionHint extends lwg.Admin.Scene {
        constructor() {
            super(...arguments);
            this.timeSwitch = false;
        }
        lwgInit() {
            ADManager.ShowBanner();
            lwg.Global._stageClick = false;
            if (!lwg.Global._elect) {
                this.self['P201'].visible = false;
            }
        }
        adaptive() {
            this.self['sceneContent'].y = Laya.stage.height * 0.481;
            this.self['P201'].y = Laya.stage.height * 0.093;
        }
        btnOnClick() {
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_noticket');
            ADManager.TAPoint(TaT.BtnShow, 'close_noticket');
            lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['BtnGet'], this, null, null, this.btnGetUp, null);
            lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['BtnClose'], this, this.btnCloseDown, null, this.btnCloseUp, this.btnCloseOut);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['Btn'], this, null, null, null, null);
        }
        btnGetUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_noticket');
            ADManager.ShowReward(() => {
                this.btnGetUp_advFunc();
            });
        }
        btnGetUp_advFunc() {
            lwg.Global._execution += 5;
            lwg.Global._createAddExecution(null, null, f => {
                let num = lwg.Global.ExecutionNumNode.getChildByName('Num');
                num.value = lwg.Global._execution.toString();
            });
            lwg.LocalStorage.addData();
            this.self.close();
        }
        btnCloseDown() {
            this.timeSwitch = true;
        }
        btnCloseUp(event) {
            this.timeSwitch = false;
            ADManager.TAPoint(TaT.BtnClick, 'close_noticket');
            this.self.close();
        }
        btnCloseOut() {
            this.timeSwitch = false;
        }
        onUpdate() {
            if (this.timeSwitch) {
                this.time++;
                if (this.time >= 180) {
                    this.timeSwitch = false;
                    if (!lwg.Global._exemptEx) {
                        lwg.Global._createHint_01(lwg.Enum.HintType.no_exemptExTime);
                        return;
                    }
                    this.time = 0;
                    lwg.Global._exemptExTime = (new Date).getDate();
                    lwg.Global._exemptEx = false;
                    if (lwg.Admin._gameState === lwg.Admin.GameState.GameStart) {
                        if (lwg.Admin._sceneControl['UIStart'].parent) {
                            lwg.Admin._sceneControl['UIStart']['UIStart'].openPlayScene_exemptEx();
                        }
                    }
                    else if (lwg.Admin._gameState === lwg.Admin.GameState.Victory) {
                        if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                            lwg.Admin._closeCustomScene();
                            lwg.Global._gameLevel++;
                            lwg.Admin._openGLCustoms();
                        }
                        else {
                            lwg.Admin._closeCustomScene();
                            lwg.Admin.openLevelNum++;
                            lwg.Admin._openLevelNumCustom();
                        }
                        let Num = lwg.Global.GoldNumNode.getChildByName('Num');
                        Num.value = (Number(Num.value) + 25).toString();
                    }
                    else if (lwg.Admin._gameState === lwg.Admin.GameState.Defeated) {
                        if (lwg.Global.intoBtn === 'BtnLast') {
                            if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                                lwg.Admin._closeCustomScene();
                                lwg.Global._gameLevel++;
                                lwg.Admin._openGLCustoms();
                            }
                            else {
                                lwg.Admin._closeCustomScene();
                                lwg.Admin.openLevelNum++;
                                lwg.Admin._openLevelNumCustom();
                            }
                        }
                        else {
                            lwg.Admin._refreshScene();
                        }
                    }
                    console.log('免费进入游戏一次');
                    lwg.LocalStorage.addData();
                    this.self.close();
                }
            }
            else {
                this.time = 0;
            }
        }
        lwgDisable() {
            lwg.Global._stageClick = true;
            ADManager.CloseBanner();
        }
    }

    class UILoding extends lwg.Admin.Scene {
        constructor() {
            super(...arguments);
            this.time = 0;
        }
        lwgInit() {
            ADManager.TAPoint(TaT.PageEnter, 'UIPreload');
            this.Mask = this.self['Mask'];
            lwg.Global._gameLevel = 1;
            lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 1000);
            lwg.Sk.skLoding();
            this.lodeUserInfo();
            this.dataLoading();
        }
        adaptive() {
            this.self['Logo'].y = Laya.stage.height * 0.242;
            this.self['Progress'].y = Laya.stage.height * 0.811;
        }
        dataLoading() {
            Laya.loader.load("Data/HintDec.json", Laya.Handler.create(this, this.levelsOnLoaded_01), null, Laya.Loader.JSON);
            Laya.loader.load("Data/StimulateDec.json", Laya.Handler.create(this, this.levelsOnLoaded_02), null, Laya.Loader.JSON);
        }
        levelsOnLoaded_01() {
            lwg.Global._hintDec = Laya.loader.getRes("Data/HintDec.json")["RECORDS"];
            Laya.MouseManager.multiTouchEnabled = false;
        }
        levelsOnLoaded_02() {
            lwg.Global._stimulateDec = Laya.loader.getRes("Data/StimulateDec.json")["RECORDS"];
        }
        lodeUserInfo() {
            let data = lwg.LocalStorage.getData();
            if (data) {
                lwg.Global._gameLevel = data._gameLevel;
                lwg.Global._goldNum = data._goldNum;
                lwg.Global._execution = data._execution;
                lwg.Global._exemptExTime = data._exemptExTime;
                let d = new Date();
                if (d.getDate() !== lwg.Global._exemptExTime) {
                    lwg.Global._exemptEx = true;
                    console.log('今天还有一次免体力进入的机会！');
                }
                else {
                    lwg.Global._exemptEx = false;
                    console.log('今天没有免体力进入的机会！');
                }
                lwg.Global._freeHintTime = data._freeHintTime;
                if (d.getDate() !== lwg.Global._freeHintTime) {
                    lwg.Global._freetHint = true;
                    console.log('今天还有一次双击免费提示的机会！');
                }
                else {
                    lwg.Global._freetHint = false;
                    console.log('今天没有双击免费提示的机会！');
                }
                lwg.Global._hotShareTime = data._hotShareTime;
                if (d.getDate() !== lwg.Global._hotShareTime) {
                    lwg.Global._hotShare = true;
                    console.log('今天还有一次热门分享的机会！');
                }
                else {
                    lwg.Global._hotShare = false;
                    console.log('今天没有热门分享的机会！');
                }
                lwg.Global._addExDate = data._addExDate;
                lwg.Global._addExHours = data._addExHours;
                lwg.Global._addMinutes = data._addMinutes;
                if (!data._currentPifu) {
                    lwg.LocalStorage.addData();
                }
                else {
                    lwg.Global._currentPifu = data._currentPifu;
                }
                if (!data._havePifu) {
                    lwg.LocalStorage.addData();
                }
                else {
                    lwg.Global._havePifu = data._havePifu;
                }
                if (!data._buyNum) {
                    lwg.LocalStorage.addData();
                }
                else {
                    lwg.Global._buyNum = data._buyNum;
                }
                if (!data._watchAdsNum) {
                    lwg.LocalStorage.addData();
                }
                else {
                    lwg.Global._watchAdsNum = data._watchAdsNum;
                }
                if (!data._huangpihaozi) {
                    lwg.LocalStorage.addData();
                }
                else {
                    lwg.Global._huangpihaozi = data._huangpihaozi;
                }
                if (!data._zibiyazi) {
                    lwg.LocalStorage.addData();
                }
                else {
                    lwg.Global._zibiyazi = data._zibiyazi;
                }
                if (!data._kejigongzhu) {
                    lwg.LocalStorage.addData();
                }
                else {
                    lwg.Global._kejigongzhu = data._kejigongzhu;
                }
                if (!data._haimiangongzhu) {
                    lwg.LocalStorage.addData();
                }
                else {
                    lwg.Global._haimiangongzhu = data._haimiangongzhu;
                }
                if (!data._pickPaintedNum) {
                    lwg.LocalStorage.addData();
                }
                else {
                    lwg.Global._pickPaintedNum = data._pickPaintedNum;
                }
                if (!data._todayCheckIn) {
                    lwg.LocalStorage.addData();
                }
                else {
                    lwg.Global._todayCheckIn = data._todayCheckIn;
                }
                if (!data._CheckInNum) {
                    lwg.LocalStorage.addData();
                }
                else {
                    lwg.Global._CheckInNum = data._CheckInNum;
                }
                lwg.Global._lastCheckIn = data._lastCheckIn;
                if (d.getDate() !== lwg.Global._lastCheckIn) {
                    lwg.Global._todayCheckIn = false;
                    console.log('今天还没有签到！');
                }
                else {
                    lwg.Global._todayCheckIn = true;
                    console.log('今天已经签到了！');
                }
            }
            lwg.Global._createGoldNum(Laya.stage);
            lwg.Global._createExecutionNum(Laya.stage);
        }
        onUpdate() {
            this.time++;
            if (this.time === 60) {
                this.Mask.x = -72;
                ADManager.TAPoint(TaT.PageLeave, 'UIPreload');
                lwg.Admin._openScene('UIStart', 0, this.self, f => {
                });
            }
            else if (this.time === 80) ;
        }
    }

    class UIMain extends lwg.Admin.Scene {
        constructor() {
            super();
            this.victory = false;
            this.timer = 0;
        }
        selfVars() {
            this.BtnAgain = this.self['BtnAgain'];
            this.Wangzi = this.self['Wangzi'];
            this.KeyNum = this.self['KeyNum'];
            this.Gongzhu = this.self['Gongzhu'];
        }
        lwgInit() {
            this.createHuliAdvertising();
            ADManager.TAPoint(TaT.LevelStart, 'level' + lwg.Admin.openLevelNum);
            RecordManager.startAutoRecord();
            Laya.MouseManager.multiTouchEnabled = false;
            lwg.Global._gameStart = true;
            lwg.Global._createBtnAgain(this.self);
            lwg.Global._createBtnPause(this.self);
            lwg.Global._createBtnHint(this.self);
            lwg.Global._createStimulateDec(this.self);
            if (this.self.name === 'UIMain_001' && lwg.Global._gameLevel !== 1) {
                this.self['Finger'].visible = false;
                this.self['guideRoom'].visible = false;
            }
            EventAdmin.register(EventAdmin.EventType.victory, this, f => {
                this.victoryAni();
            });
            this.gameOverAniDir = Math.floor(Math.random() * 2) === 1 ? 'left' : 'right';
            EventAdmin.register(EventAdmin.EventType.advertising, this, () => {
                this.createHuliRoom();
            });
        }
        createHuliAdvertising() {
            if (lwg.Global._currentPifu === lwg.Sk.PifuMatching.huli) {
                Admin._openScene(Admin.SceneName.UIAdvertising);
            }
        }
        createHuliRoom() {
            this.Gongzhu.zOrder = 10;
            let sp;
            Laya.loader.load('prefab/Room8.json', Laya.Handler.create(this, function (prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                this.self.addChild(sp);
                sp.pos(sp.width / 2 + 60, Laya.stage.height - sp.height / 2 - 100);
                sp.zOrder = -1;
                Animation.bombs_Appear(sp, 0, 1, 1.1, Math.floor(Math.random() * 2) === 1 ? 5 : -5, 200, 150, 0, null, () => { });
                Effects.createExplosion_Rotate(this.self, 30, sp.x, sp.y, Effects.SkinStyle.dot, 10, 12);
            }));
        }
        openAni() {
            return 0;
        }
        btnOnClick() {
            this.self.on(Laya.Event.DOUBLE_CLICK, this, this.stageDB);
        }
        stageDB() {
            if (lwg.Global._freetHint && lwg.Global._gameLevel !== 1 && lwg.Global._gameLevel !== 29 && lwg.Admin.openLevelNum !== 1 && lwg.Admin.openLevelNum !== 29) {
                console.log('免费提示出现！');
                lwg.Global._freeHintTime = (new Date).getDate();
                lwg.Global._freetHint = false;
                lwg.LocalStorage.addData();
                lwg.Admin._openScene('UIPassHint', null, null, f => {
                    lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].setStyle();
                });
            }
            else if (!lwg.Global._freetHint) {
                console.log('今日免费提示机会用完了！');
            }
            else {
                console.log('第1关和第29关不会出现免费提示！');
            }
        }
        victoryAni() {
            lwg.Global._gameStart = false;
            let self = this.self;
            let i = Laya.Physics.I;
            i.worldRoot = self;
            let targetX = (this.Wangzi.x + this.Gongzhu.x) / 2;
            let targetY = (this.Wangzi.y + this.Gongzhu.y) / 2;
            self.x += targetX;
            self.y += targetY;
            self.anchorX = targetX / self.width;
            self.anchorY = targetY / self.height;
            lwg.Animation.move_Scale(self, 1, self.x, self.y, Laya.stage.width / 2, Laya.stage.height / 2, 2, 500, 100, f => {
                Laya.timer.frameOnce(40, this, f => {
                    lwg.Global._gameOverAni = true;
                    Laya.timer.frameOnce(100, this, f => {
                        lwg.Admin._openScene(lwg.Admin.SceneName.UIVictoryBox, null, null, null);
                    });
                });
            });
        }
        onUpdate() {
            if (!lwg.Global._gameStart) {
                return;
            }
            this.timer++;
            if (this.self.name === 'UIMain_001') {
                if (lwg.Global._gameLevel === 1) {
                    if (this.timer % 85 === 0 || this.timer === 1) {
                        lwg.Animation.move_Simple(this.self['Finger'], this.self['Room1'].x, this.self['Room1'].y, this.self['guideRoom'].x, this.self['guideRoom'].y, 800, 0, f => {
                        });
                        if (this.self['Wangzi']['UIMain_Wangzi'].belongRoom === this.self['Gongzhu']['UIMain_Gongzhu'].belongRoom) {
                            this.self['Finger'].alpha = 0;
                            this.self['Finger'].alpha = 0;
                        }
                        else {
                            this.self['Finger'].alpha = 1;
                            this.self['Finger'].alpha = 1;
                        }
                    }
                }
            }
        }
        lwgDisable() {
            if (this.victory) {
                ADManager.TAPoint(TaT.LevelFinish, 'level' + lwg.Admin.openLevelNum);
            }
            else {
                ADManager.TAPoint(TaT.LevelFail, 'level' + lwg.Admin.openLevelNum);
            }
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
            lwg.Global._gameOverAni = false;
        }
    }

    class UIMain_Aisle extends lwg.Admin.Object {
        constructor() {
            super();
            this.openSwitch = false;
            this.oppositeAisle = null;
            this.connectRoom = null;
        }
        lwgInit() {
            this.interactionPicStyle('exit');
            this.colorFormat();
        }
        colorFormat() {
            let parent = this.self.parent;
            let pSkin = parent.skin;
            let wall = this.self.getChildByName('wall');
            let color = this.self.getChildByName('color');
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
        onTriggerEnter(other, self) {
            let otherName = other.owner.name;
            let selfName = this.self.name;
            if (other.label === 'aisle' && self.label === 'aisle') ;
            else if (other.label === 'interaction' && self.label === 'interaction') {
                let n1 = otherName.substring(0, 1);
                let n2 = selfName.substring(0, 1);
                if ((n1 === 'l' && n2 === 'r') || (n1 === 'r' && n2 === 'l') || (n1 === 'u' && n2 === 'd') || (n1 === 'd' && n2 === 'u')) {
                    this.connectRoom = other.owner.parent;
                    this.oppositeAisle = other.owner;
                    this.interactionPicStyle('enter');
                }
            }
        }
        interactionPicStyle(type) {
            let interaction = this.self.getChildByName('interaction');
            let url1 = 'Room/ui_interaction_01.png';
            let url2 = 'Room/ui_interaction_02.png';
            if (type === 'enter') {
                interaction.skin = url2;
            }
            else if (type === 'exit') {
                interaction.skin = url1;
            }
        }
        roomAdsorption() {
            let posX = this.oppositeAisle.x + this.connectRoom.x - this.connectRoom.width / 2;
            let posY = this.oppositeAisle.y + this.connectRoom.y - this.connectRoom.height / 2;
            let parent = this.self.parent;
            let selfX = this.self.x + parent.x - parent.width / 2;
            let selfY = this.self.y + parent.y - parent.height / 2;
            let diffX = posX - selfX;
            let diffY = posY - selfY;
            if ((Math.abs(diffX) > 100 || Math.abs(diffY) > 100)) {
                return;
            }
            let _roomMove = parent['UIMain_Room']._roomMove;
            if (!_roomMove && lwg.Global._roomPickup === parent) {
                Laya.Tween.clearAll(this);
                lwg.Animation.move_Simple(parent, parent.x, parent.y, parent.x + diffX, parent.y + diffY, 10, 0, f => { });
                parent['UIMain_Room']._roomMove = false;
                lwg.Global._roomPickup = null;
                lwg.Effects.createCommonExplosion(Laya.stage, 15, posX, posY, 'dot', 7, 8);
            }
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
            }
            else {
                this.openSwitch = true;
                this.gzAndWzConnect();
                if (lwg.Global._gameLevel === 1 && this.selfScene['Finger']) {
                    if (this.selfScene['Finger']) {
                        this.selfScene['Finger'].alpha = 0;
                        this.selfScene['guideRoom'].alpha = 0;
                    }
                }
            }
        }
        styleChanges() {
            let interaction = this.self.getChildByName('interaction');
            let color = this.self.getChildByName('color');
            let wall = this.self.getChildByName('wall');
            if (this.openSwitch) {
                interaction.alpha = 0;
                color.alpha = 0;
                wall.alpha = 1;
            }
            else {
                interaction.alpha = 1;
                color.alpha = 1;
                wall.alpha = 0;
            }
        }
        gzAndWzConnect() {
            let gongzhu = this.selfScene['UIMain'].Gongzhu;
            let wangzi = this.selfScene['UIMain'].Wangzi;
            let gongzhuRoom = gongzhu['UIMain_Gongzhu'].belongRoom;
            let wangziRoom = wangzi['UIMain_Wangzi'].belongRoom;
            let parent = this.self.parent;
            if ((gongzhuRoom === parent && wangziRoom === this.connectRoom) || (wangziRoom === parent && gongzhuRoom === this.connectRoom)) {
                wangzi['UIMain_Wangzi'].gzConnect = true;
            }
        }
        onTriggerExit(other, self) {
            let otherName = other.owner.name;
            let selfName = this.self.name;
            if (other.label === 'aisle' && self.label === 'aisle') ;
            else if (other.label === 'interaction' && self.label === 'interaction') {
                this.openSwitch = false;
                this.connectRoom = null;
                this.oppositeAisle = null;
                let n1 = otherName.substring(0, 1);
                let n2 = selfName.substring(0, 1);
                this.interactionPicStyle('exit');
            }
        }
        roomDistanceJudge() {
            let parent = this.self.parent;
            for (let index = 0; index < this.selfScene.numChildren; index++) {
                const element = this.selfScene.getChildAt(index);
                if (element.name.substring(0, 4) === 'Room' && element !== parent) {
                    if (this.self.name.substring(0, 1) === 'l' || this.self.name.substring(0, 1) === 'r') {
                        if (Math.abs(element.x - parent.x) > element.width / 2 + parent.width / 2 + 100) {
                            this.interactionPicStyle('exit');
                        }
                    }
                    else if (this.self.name.substring(0, 1) === 'u' || this.self.name.substring(0, 1) === 'd') {
                        if (Math.abs(element.y - parent.y) > element.height / 2 + parent.height / 2 + 100) {
                            this.interactionPicStyle('exit');
                        }
                    }
                }
            }
        }
        onUpdate() {
            if (this.connectRoom && this.oppositeAisle) {
                this.roomAdsorption();
            }
            this.styleChanges();
        }
        onDisable() {
        }
    }

    class UIMain_Gongzhu extends lwg.Admin.Person {
        constructor() {
            super(...arguments);
            this.necklace = false;
            this.drumstick = false;
            this.skScale = 1;
            this.parachute = new Laya.Image();
            this.inAir = false;
            this.targetP = new Laya.Point();
            this.attackSwitch = false;
            this.speed = 2.5;
            this._belongX = null;
            this._belongY = null;
            this._belongChange = false;
            this.accelerated = 14;
            this.gameOverAniTime = 0;
            this.overAniSwitch = true;
        }
        lwgInit() {
            this.createskeleton();
            this.notCommon();
            this.createPlaint();
            this.directionJudge();
            this.setBelongRoom();
        }
        notCommon() {
            this.buffState = null;
            this.signSkin = 'Room/icon_love.png';
        }
        createPlaint() {
            let img = new Laya.Image();
            img.skin = this.signSkin;
            img.y = -60;
            img.x = this.self.width / 2 - 6 - img.width / 2;
            this.self.addChild(img);
            img.zOrder = 10;
            this.plaint = img;
        }
        directionJudge() {
            let pic = this.self.getChildByName('pic');
            if (pic.scaleX === -1) {
                this.moveDirection = lwg.Enum.PersonDir.left;
            }
            else if (pic.scaleX === 1) {
                this.moveDirection = lwg.Enum.PersonDir.right;
            }
        }
        createskeleton() {
            switch (lwg.Global._currentPifu) {
                case lwg.Sk.PifuMatching.gongzhu:
                    this.skeleton = lwg.Sk.gongzhuTem.buildArmature(0);
                    this.skScale = 0.9;
                    break;
                case lwg.Sk.PifuMatching.chiji:
                    this.skeleton = lwg.Sk.chijiTem.buildArmature(0);
                    this.skScale = 0.9;
                    break;
                case lwg.Sk.PifuMatching.change:
                    this.skeleton = lwg.Sk.changeTem.buildArmature(0);
                    this.skScale = 0.9;
                    break;
                case lwg.Sk.PifuMatching.huiguniang:
                    this.skeleton = lwg.Sk.huiguniangTem.buildArmature(0);
                    this.skScale = 0.9;
                    break;
                case lwg.Sk.PifuMatching.tianshi:
                    this.skeleton = lwg.Sk.tianshiTem.buildArmature(0);
                    this.skScale = 0.9;
                    break;
                case lwg.Sk.PifuMatching.xiaohongmao:
                    this.skeleton = lwg.Sk.xiaohongmaoTem.buildArmature(0);
                    this.skScale = 0.9;
                    break;
                case lwg.Sk.PifuMatching.xiaohuangya:
                    this.skeleton = lwg.Sk.xiaohuangyaTem.buildArmature(0);
                    this.skScale = 0.9;
                    break;
                case lwg.Sk.PifuMatching.zhenzi:
                    this.skeleton = lwg.Sk.zhenziTem.buildArmature(0);
                    this.skScale = 0.9;
                    break;
                case lwg.Sk.PifuMatching.aisha:
                    this.skeleton = lwg.Sk.aishaTem.buildArmature(0);
                    this.skScale = 0.9;
                case lwg.Sk.PifuMatching.huli:
                    this.skeleton = lwg.Sk.dajiTem.buildArmature(0);
                    this.skScale = 0.9;
                    break;
                case lwg.Enum.CaidanPifuName.daji:
                    this.skeleton = lwg.Sk.dajiTem.buildArmature(0);
                    this.skScale = 1;
                    break;
                case lwg.Enum.CaidanPifuName.cangshugongzhu:
                    this.skeleton = lwg.Sk.cangshuTem.buildArmature(0);
                    this.skScale = 1;
                    break;
                case lwg.Enum.CaidanPifuName.haimiangongzhu:
                    this.skeleton = lwg.Sk.haimianbaobaoTem.buildArmature(0);
                    this.skScale = 1;
                    break;
                case lwg.Enum.CaidanPifuName.zibiyazi:
                    this.skeleton = lwg.Sk.kedayaTem.buildArmature(0);
                    this.skScale = 1;
                    break;
                case lwg.Enum.CaidanPifuName.kejigongzhu:
                    this.skeleton = lwg.Sk.kejiTem.buildArmature(0);
                    this.skScale = 1;
                    break;
                case lwg.Enum.CaidanPifuName.huangpihaozi:
                    this.skeleton = lwg.Sk.pikaqiuTem.buildArmature(0);
                    this.skScale = 1;
                    break;
                case lwg.Enum.CaidanPifuName.saiyaren:
                    this.skeleton = lwg.Sk.shiziTem.buildArmature(0);
                    this.skScale = 1;
                    break;
                default:
                    break;
            }
            this.self.addChild(this.skeleton);
            this.skeleton.scale(this.skScale, this.skScale);
            this.skeleton.pos(this.self.width / 2, this.self.height - 9);
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk, true);
            this.createParachute();
        }
        createParachute() {
            this.parachute.skin = 'Room/icon_parachute.png';
            this.self.addChild(this.parachute);
            this.parachute.pos(23, -105);
            this.parachute.width = 170;
            this.parachute.height = 150;
            this.parachute.pivotX = 150;
            this.parachute.pivotX = 85;
            this.parachute.zOrder = -1;
            this.parachute.scale(0, 0);
            this.parachute.visible = false;
        }
        setBelongRoom() {
            for (let index = 0; index < this.selfScene.numChildren; index++) {
                const child = this.selfScene.getChildAt(index);
                if (child.name.substring(0, 4) === 'Room') {
                    let dx = Math.abs(child.x - this.self.x);
                    let dy = Math.abs(child.y - this.self.y);
                    if (dx <= child.width / 2 && dy <= child.height / 2) {
                        this.belongRoom = child;
                        break;
                    }
                }
            }
        }
        onTriggerEnter(other, self) {
            console.log('上面是通的' + other.label);
            if (!lwg.Global._gameStart) {
                return;
            }
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
        houmaAndPerson(other, self) {
            console.log('houma');
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            if (this.drumstick) {
                return;
            }
            else {
                this.attackSwitch = true;
                otherOwner['UIMain_Houma'].attackSwitch = true;
                let apple = otherOwner.getChildByName('apple');
                apple.visible = true;
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
        drumstickAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            otherOwner.removeSelf();
            this.drumstick = true;
        }
        bananaAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            otherOwner.removeSelf();
            lwg.Global._gameStart = false;
            this.skeleton.play(lwg.Enum.gongzhuAni.die, false);
            Laya.timer.frameOnce(100, this, f => {
                this.selfScene['UIMain'].victory = false;
                lwg.Admin._openScene('UIPassHint', null, null, f => {
                    lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = lwg.Admin.SceneName.UIDefeated;
                });
            });
        }
        speedAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            otherOwner.removeSelf();
            this.speed = this.speed * 2;
        }
        necklaceAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            this.necklace = true;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk_xianglian, true);
            otherOwner.removeSelf();
        }
        bonfireAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            if (this.buffState === lwg.Enum.BuffState.kettle) {
                this.skeleton.play(lwg.Enum.gongzhuAni.attack_shuihu, false);
                this.attackSwitch = true;
                Laya.timer.frameOnce(100, this, f => {
                    otherOwner.removeSelf();
                    this.attackSwitch = false;
                    this.skeleton.play(lwg.Enum.gongzhuAni.walk_shuihu, true);
                });
                this.skeleton.on(Laya.Event.LABEL, this, this.shuihuComplete, [otherOwner]);
            }
            else {
                this.skeleton.play(lwg.Enum.gongzhuAni.die, false);
                lwg.Global._gameStart = false;
                Laya.timer.frameOnce(100, this, f => {
                    this.selfScene['UIMain'].victory = false;
                    lwg.Admin._openScene('UIPassHint', null, null, f => {
                        lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = lwg.Admin.SceneName.UIDefeated;
                    });
                });
            }
        }
        shuihuComplete() {
        }
        kettleAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            this.buffState = lwg.Enum.BuffState.kettle;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk_shuihu, true);
            otherOwner.removeSelf();
        }
        stickAndPerson(other, self) {
            let otherOwner = other.owner;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk_gun, true);
            this.buffState = lwg.Enum.BuffState.stick;
            otherOwner.removeSelf();
        }
        dogAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            this.attackSwitch = true;
            if (otherOwnerName.substring(0, 1) === 'm') {
                otherOwner['Dog'].eatFood = true;
            }
            if (this.buffState === lwg.Enum.BuffState.stick) {
                this.skeleton.play(lwg.Enum.gongzhuAni.attack_gun, false);
                this.skeleton.on(Laya.Event.LABEL, this, this.attackComplete, [otherOwner]);
            }
            else {
                lwg.Global._gameStart = false;
                this.targetP.x = this.self.x;
                this.targetP.y = this.self.y;
                this.skeleton.play(lwg.Enum.gongzhuAni.die, false);
                if (otherOwnerName.substring(0, 1) === 's') {
                    otherOwner['UIMain_StaticDog'].skeleton.play(lwg.Enum.dogAni.walk, true);
                }
                else if (otherOwnerName.substring(0, 1) === 'm') {
                    otherOwner['Dog'].skeleton.play(lwg.Enum.dogAni.walk, true);
                }
                Laya.timer.frameOnce(100, this, f => {
                    this.selfScene['UIMain'].victory = false;
                    lwg.Admin._openScene('UIPassHint', null, null, f => {
                        lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = lwg.Admin.SceneName.UIDefeated;
                    });
                });
            }
        }
        attackComplete(otherOwner) {
            let otherOwnerName = otherOwner.name;
            if (otherOwnerName.substring(0, 1) === 's') {
                let dogSk = otherOwner['UIMain_StaticDog'].skeleton;
                dogSk.play(lwg.Enum.dogAni.die, false);
            }
            else if (otherOwnerName.substring(0, 1) === 'm') {
                otherOwner['Dog'].skeleton.play(lwg.Enum.dogAni.die);
            }
            this.skeleton.play(lwg.Enum.gongzhuAni.walk_gun, true);
            this.attackSwitch = false;
            Laya.timer.frameOnce(30, this, f => {
                otherOwner.removeSelf();
            });
        }
        wallAndPerson(other, self) {
            if (this.moveDirection === lwg.Enum.PersonDir.left || this.moveDirection === lwg.Enum.PersonDir.right) {
                if (this.belongRoom === other.owner.parent) {
                    this.changeDirection();
                }
            }
        }
        wangziAndPerson(other, self) {
            lwg.Global._gameStart = false;
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            this.targetP.x = this.self.x;
            this.targetP.y = this.self.y;
            otherOwner['UIMain_Wangzi'].skeleton.play(lwg.Enum.wangziAni.win, true);
            this.selfScene[lwg.Admin.SceneName.UIMain].victory = true;
            this.skeleton.play(lwg.Enum.gongzhuAni.win, true);
            this.selfScene['UIMain'].victoryAni();
        }
        floorAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            let belongName = otherOwnerName.substring(otherOwnerName.length - 5, otherOwnerName.length);
            if (this.belongRoom) {
                if (this.belongRoom.name === belongName) {
                    if (this.personState === lwg.Enum.MoveState.onLadder) {
                        this.moveDirection = this.beforeLadderDir;
                    }
                    else if (this.personState === lwg.Enum.MoveState.inAir) {
                        this.moveDirection = this.beforeInAirDir;
                    }
                    this.personState = lwg.Enum.MoveState.onFloor;
                    this.currentFloor = otherOwner;
                }
            }
        }
        ladderAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherName = otherOwner.name;
            let otherNamelen = otherOwner.name.length;
            let num = otherOwner.name.substring(otherNamelen - 2, otherNamelen);
            let aisleName = 'up_Aisle_' + num;
            let upAisle = this.belongRoom.getChildByName(aisleName);
            if (!upAisle) {
                if (otherOwner.name.substring(0, 8) === 'ladder_a') {
                    if (this.personState !== lwg.Enum.MoveState.onLadder) {
                        if (other.y > otherOwner.width / 2) {
                            this.beforeLadderDir = this.moveDirection;
                            this.moveDirection = lwg.Enum.PersonDir.up;
                            this.personState = lwg.Enum.MoveState.onLadder;
                        }
                        else {
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
            if (!upOpenSwitch) ;
            else {
                console.log(otherOwner.name + '连接梯子');
                if (this.personState === lwg.Enum.MoveState.onFloor) {
                    this.beforeLadderDir = this.moveDirection;
                    this.moveDirection = lwg.Enum.PersonDir.up;
                    this.personState = lwg.Enum.MoveState.onLadder;
                }
                else {
                    if (this.beforeInAirDir === lwg.Enum.PersonDir.left || this.beforeInAirDir === lwg.Enum.PersonDir.right) {
                        this.beforeLadderDir = this.beforeInAirDir;
                        this.personState = lwg.Enum.MoveState.onLadder;
                        this.moveDirection = lwg.Enum.PersonDir.down;
                    }
                }
                this.currentLadder = otherOwner;
            }
        }
        aisleAndPerson(other, self) {
            let otherOwner = other.owner;
            let otherName = otherOwner.name;
            let openSwitch = otherOwner['UIMain_Aisle'].openSwitch;
            let connectRoom = otherOwner['UIMain_Aisle'].connectRoom;
            let otherDir = otherName.substring(0, 1);
            let selfDir = this.moveDirection.substring(0, 1);
            let oppositeAisle = otherOwner['UIMain_Aisle'].oppositeAisle;
            if (otherDir === 'l' || otherDir === 'r') {
                if (!openSwitch) {
                    let lrAisle = this.belongRoom.getChildByName(otherOwner.name);
                    if (otherOwner === lrAisle) {
                        this.changeDirection();
                    }
                }
                else {
                    if (oppositeAisle) {
                        let openSwitch_02 = oppositeAisle['UIMain_Aisle'].openSwitch;
                        if (!openSwitch_02) {
                            this.changeDirection();
                            return;
                        }
                    }
                    if (otherDir === selfDir) {
                        if (this.belongRoom !== connectRoom) {
                            this.belongRoom = connectRoom;
                            this._belongChange = true;
                            this.beforeInAirDir = this.moveDirection;
                            this.personState = lwg.Enum.MoveState.inAir;
                        }
                    }
                }
            }
            else if (otherDir === 'd' || otherDir === 'u') {
                if (otherDir === 'd') {
                    if (!openSwitch) ;
                    else {
                        if (oppositeAisle) {
                            let openSwitch_02 = oppositeAisle['UIMain_Aisle'].openSwitch;
                            if (!openSwitch_02) {
                                return;
                            }
                        }
                        if (selfDir === 'l' || selfDir === 'r') {
                            if (this.belongRoom !== connectRoom) {
                                this.belongRoom = connectRoom;
                                this._belongChange = true;
                                this.beforeInAirDir = this.moveDirection;
                                this.personState = lwg.Enum.MoveState.inAir;
                                this.moveDirection = lwg.Enum.PersonDir.down;
                            }
                        }
                    }
                }
                else if (otherDir === 'u') {
                    if (openSwitch === false) {
                        let upAisle = this.belongRoom.getChildByName(otherOwner.name);
                        if (otherOwner === upAisle) {
                            this.changeDirection();
                        }
                    }
                    else {
                        if (otherDir === selfDir) {
                            if (this.belongRoom !== connectRoom) {
                                this.belongRoom = connectRoom;
                                this._belongChange = true;
                                this.beforeInAirDir = this.beforeLadderDir;
                                this.personState = lwg.Enum.MoveState.inAir;
                            }
                        }
                    }
                }
            }
        }
        onTriggerExit(other, self) {
            if (!lwg.Global._gameStart) {
                return;
            }
            if (other.label === 'floor') {
                let belongName = other.owner.name.substring(other.owner.name.length - 5, other.owner.name.length);
                if (this.belongRoom.name === belongName) {
                    if (this.personState === lwg.Enum.MoveState.onLadder) ;
                    else if (this.personState === lwg.Enum.MoveState.inAir) ;
                    else if (this.personState === lwg.Enum.MoveState.onFloor) {
                        this.beforeFloorDir = this.moveDirection;
                        this.personState = lwg.Enum.MoveState.inAir;
                        this.moveDirection = lwg.Enum.PersonDir.down;
                    }
                }
            }
            else if (other.label === 'ladder') {
                let belongName = other.owner.name.substring(other.owner.name.length - 5, other.owner.name.length);
                if (this.belongRoom.name === belongName) {
                    if (this.personState === lwg.Enum.MoveState.onFloor) {
                        this.moveDirection = this.beforeFloorDir;
                    }
                }
            }
        }
        changeDirection() {
            if (this.moveDirection === lwg.Enum.PersonDir.left) {
                this.moveDirection = lwg.Enum.PersonDir.right;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                this.moveDirection = lwg.Enum.PersonDir.left;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.up) {
                this.moveDirection = lwg.Enum.PersonDir.down;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.down) {
                this.moveDirection = lwg.Enum.PersonDir.up;
            }
        }
        move() {
            if (this.attackSwitch) {
                this.rig.setVelocity({ x: 0, y: 0 });
                return;
            }
            if (this.moveDirection === lwg.Enum.PersonDir.left) {
                this.rig.setVelocity({ x: -this.speed, y: 0 });
                this.skeleton.scaleX = -this.skScale;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                this.rig.setVelocity({ x: this.speed, y: 0 });
                this.skeleton.scaleX = this.skScale;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.up) {
                this.rig.setVelocity({ x: 0, y: -6 });
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.down) {
                this.rig.setVelocity({ x: 0, y: 6 });
            }
        }
        positionOffset() {
            if (this.belongRoom) {
                switch (this.personState) {
                    case lwg.Enum.MoveState.onFloor:
                        if (this.currentFloor) {
                            let y = this.currentFloor.y + this.belongRoom.y - this.belongRoom.height / 2;
                            this.self.y = y - 20;
                            this.positionOffsetXY();
                        }
                        break;
                    case lwg.Enum.MoveState.onLadder:
                        if (this.currentLadder) {
                            let x = this.currentLadder.x + this.belongRoom.x - this.belongRoom.width / 2;
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
        positionOffsetXY() {
            if (!this._belongY || !this._belongX) {
                if (this.belongRoom) {
                    this._belongX = this.belongRoom.x;
                    this._belongY = this.belongRoom.y;
                }
            }
            else {
                if (this._belongChange) {
                    this._belongY = null;
                    this._belongChange = false;
                }
                else {
                    let x = this.belongRoom.x - this._belongX;
                    let y = this.belongRoom.y - this._belongY;
                    this.self.x = this.self.x + x;
                    this.self.y = this.self.y + y;
                    this._belongX = this.belongRoom.x;
                    this._belongY = this.belongRoom.y;
                }
            }
        }
        gameOverMove() {
            if (this.targetP) {
                this.rig.setVelocity({ x: 0, y: 0 });
                this.positionOffsetXY();
            }
        }
        noMoveDirection() {
            if (!this.moveDirection) {
                if (this.belongRoom) {
                    if (this.self.x > this.belongRoom.x) {
                        this.moveDirection = lwg.Enum.PersonDir.left;
                    }
                    else {
                        this.moveDirection = lwg.Enum.PersonDir.right;
                    }
                }
            }
        }
        scopeControl() {
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
        parachuteOpen() {
            this.overAniSwitch = false;
            this.parachute.visible = true;
            Animation.scale_Simple(this.parachute, 0, 0, 1, 1, 300, 100, f => {
                this.accelerated = -0.15;
            });
        }
        gameOverAni() {
            this.gameOverAniTime++;
            if (this.gameOverAniTime > 35) {
                this.self.y -= this.accelerated * 1.5;
                if (this.selfScene['UIMain'].gameOverAniDir === 'left') {
                    this.self.x -= 0.05;
                }
                else {
                    this.self.x += 0.05;
                }
                if (this.overAniSwitch) {
                    this.parachuteOpen();
                }
            }
            else {
                if (this.accelerated > -5) {
                    this.accelerated -= 1;
                    if (this.selfScene['UIMain'].gameOverAniDir === 'left') {
                        this.self.x--;
                    }
                    else {
                        this.self.x++;
                    }
                }
                this.self.y -= this.accelerated;
            }
        }
        GameOver() {
            if (!lwg.Global._gameOverAni) {
                this.gameOverMove();
            }
            else {
                this.gameOverAni();
            }
        }
        lwgOnUpdate() {
            if (!lwg.Global._gameStart) {
                this.GameOver();
                return;
            }
            this.noMoveDirection();
            this.move();
            this.positionOffset();
            this.scopeControl();
        }
        onDisable() {
            this.destroy();
        }
    }

    class Dog extends UIMain_Gongzhu {
        constructor() {
            super(...arguments);
            this.eatFood = false;
        }
        notCommon() {
            this.signSkin = 'Room/icon_plaint.png';
            if (!this.speed) {
                this.speed = 2.1;
            }
        }
        createskeleton() {
            this.skeleton = lwg.Sk.gouTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height;
            this.skeleton.zOrder = 5;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            this.skeleton.play(lwg.Enum.dogAni.walk, true);
        }
        onTriggerEnter(other, self) {
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
                case 'wangzi':
                    break;
                case 'doghouse':
                    this.dogAndDoghouse(other, self);
                    break;
                case 'dogfood':
                    this.dogAnddogfood(other, self);
                    break;
                default:
                    break;
            }
        }
        dogAnddogfood(other, self) {
            console.log('吃了狗粮变大了');
            let otherOnwer = other.owner;
            let otherOnwerParent = otherOnwer.parent;
            this.skeleton.play(lwg.Enum.dogAni.standby, true);
            this.eatFood = true;
            self.width += 60;
            self.x -= 35;
            this.self.x = otherOnwer.x + otherOnwerParent.x - otherOnwerParent.width / 2;
            other.owner.removeSelf();
            if (this.moveDirection === lwg.Enum.PersonDir.left) {
                this.skeleton.scale(1.5, 1.5);
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                this.skeleton.scale(-1.5, 1.5);
            }
        }
        dogAndDoghouse(other, self) {
            this.self.removeSelf();
            let sleepPic = other.owner.getChildByName('sleepPic');
            sleepPic.visible = true;
        }
        move() {
            if (this.eatFood) {
                this.rig.setVelocity({ x: 0, y: 0 });
            }
            else {
                if (this.moveDirection === lwg.Enum.PersonDir.left) {
                    this.rig.setVelocity({ x: -this.speed, y: 0 });
                    this.skeleton.scaleX = 1;
                    this.plaint.x = 20;
                }
                else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                    this.rig.setVelocity({ x: this.speed, y: 0 });
                    this.skeleton.scaleX = -1;
                    this.plaint.x = 30;
                }
                else if (this.moveDirection === lwg.Enum.PersonDir.up) {
                    this.rig.setVelocity({ x: 0, y: -6 });
                }
                else if (this.moveDirection === lwg.Enum.PersonDir.down) {
                    this.rig.setVelocity({ x: 0, y: 6 });
                }
            }
        }
        GameOver() {
            this.gameOverMove();
        }
        ;
    }

    class UIMain_Rival extends UIMain_Gongzhu {
        notCommon() {
        }
        createskeleton() {
            this.skeleton = lwg.Sk.qingdi_01Tem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height - 10;
            this.skScale = 0.9;
            this.skeleton.scale(this.skScale, this.skScale);
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk, true);
        }
        onTriggerEnter(other, self) {
            if (!lwg.Global._gameStart) {
                return;
            }
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
                case 'wangzi':
                    this.wangziAndPerson(other, self);
                    break;
                default:
                    break;
            }
        }
        wangziAndPerson(other, self) {
            lwg.Global._gameStart = false;
            let otherOwner = other.owner;
            let otherOwnerName = otherOwner.name;
            this.targetP.x = this.self.x;
            this.targetP.y = this.self.y;
            otherOwner['UIMain_Wangzi'].skeleton.play(lwg.Enum.wangziAni.win, true);
            let gz = this.selfScene['UIMain'].Gongzhu;
            if (gz['UIMain_Gongzhu'].necklace) {
                gz['UIMain_Gongzhu'].skeleton.play(lwg.Enum.gongzhuAni.die_xianglian, false);
            }
            else {
                gz['UIMain_Gongzhu'].skeleton.play(lwg.Enum.gongzhuAni.die, false);
            }
            this.skeleton.play(lwg.Enum.gongzhuAni.win, true);
            Laya.timer.frameOnce(100, this, f => {
                this.selfScene['UIMain'].victory = false;
                lwg.Admin._openScene('UIPassHint', null, null, f => {
                    lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = lwg.Admin.SceneName.UIDefeated;
                });
            });
        }
        GameOver() {
            this.gameOverMove();
        }
        ;
    }

    class UIMain_Bonfire extends lwg.Admin.Object {
        lwgInit() {
            this.ani = this.self.getChildByName('ani');
            this.time = 0;
        }
        onUpdate() {
            this.time++;
            let url1 = 'Room/ani_fire_01.png';
            let url2 = 'Room/ani_fire_02.png';
            let url3 = 'Room/ani_fire_03.png';
            let speed = 5;
            if (this.time % (speed * 3) === 0) {
                this.ani.skin = url3;
            }
            else if (this.time % (speed * 2) === 0) {
                this.ani.skin = url2;
            }
            else if (this.time % speed === 0) {
                this.ani.skin = url1;
            }
        }
    }

    class UIMain_Wangzi extends UIMain_Gongzhu {
        constructor() {
            super(...arguments);
            this.aniSwitch = false;
        }
        notCommon() {
            this.gzConnect = false;
            this.signSkin = 'Room/icon_love.png';
        }
        createskeleton() {
            this.skeleton = lwg.Sk.wangziTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height - 14;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            if (pic.scaleX === -1) {
                this.skeleton.scaleX = 1;
            }
            else {
                this.skeleton.scaleX = -1;
            }
            this.skeleton.play(lwg.Enum.wangziAni.standby, true);
            this.createParachute();
        }
        onTriggerEnter(other, self) {
            if (!lwg.Global._gameStart) {
                return;
            }
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
                default:
                    break;
            }
        }
        move() {
            if (!this.gzConnect) {
                if (this.aniSwitch) {
                    this.skeleton.play(lwg.Enum.wangziAni.standby, true);
                    this.aniSwitch = false;
                }
                this.rig.setVelocity({ x: 0, y: 0 });
                return;
            }
            if (!this.aniSwitch) {
                this.skeleton.play(lwg.Enum.wangziAni.walk, true);
                this.aniSwitch = true;
            }
            if (this.moveDirection === lwg.Enum.PersonDir.left) {
                this.rig.setVelocity({ x: -2.5, y: 0 });
                this.skeleton.scaleX = -1;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                this.rig.setVelocity({ x: 2.5, y: 0 });
                this.skeleton.scaleX = 1;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.up) {
                this.rig.setVelocity({ x: 0, y: -6 });
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.down) {
                this.rig.setVelocity({ x: 0, y: 6 });
            }
        }
        lwgOnUpdate() {
            if (!lwg.Global._gameStart) {
                this.GameOver();
                return;
            }
            let necklace = this.self.scene['UIMain'].Gongzhu['UIMain_Gongzhu'].necklace;
            if (necklace) {
                this.noMoveDirection();
                this.move();
                this.scopeControl();
            }
            this.positionOffset();
        }
    }

    class UIMain_Follow extends lwg.Admin.Object {
        constructor() {
            super();
            this.firstPos = new Laya.Point();
        }
        lwgInit() {
            this.self = this.owner;
            let parent = this.self.parent;
            this.posAndFormat();
        }
        posAndFormat() {
            let boxColLabel = this.self.getComponent(Laya.BoxCollider).label;
            if (boxColLabel === 'aisle') {
                let parent = this.self.parent;
                let pSkin = parent.skin;
                let wall = this.self.getChildByName('wall');
                let color = this.self.getChildByName('color');
                let interaction = this.self.getChildByName('interaction');
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
                    }
                    else if (nameStr === 'u') {
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
                }
                else if (nameStr === 'l' || nameStr === 'r') {
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
                    }
                    else if (nameStr === 'r') {
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
        lwgOnUpdate() {
            if (this.self.name !== 'Person') {
                this.self.x = this.firstPos.x;
                this.self.y = this.firstPos.y;
            }
        }
        onDisable() {
        }
    }

    class UIMain_Houzi extends lwg.Admin.Object {
        constructor() {
            super(...arguments);
            this.timeSwitch = true;
        }
        lwgInit() {
            this.createskeleton();
            let Progress = this.self.getChildByName('Progress');
            let ProgressBar = Progress.getChildByName('ProgressBar');
            this.Mask = ProgressBar.mask;
        }
        createskeleton() {
            this.skeleton = lwg.Sk.houziTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            this.skeleton.play(lwg.Enum.dogAni.standby, true);
        }
        createBanana() {
            let banana;
            let self = this.self;
            let parent1 = this.self.parent;
            Laya.loader.load('prefab/banana.json', Laya.Handler.create(this, function (prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                banana = Laya.Pool.getItemByCreateFun('banana', _prefab.create, _prefab);
                parent1.addChild(banana);
                banana.pos(self.x, self.y + 4);
                banana.addComponent(UIMain_Follow);
                self.visible = false;
            }));
        }
        lwgOnUpdate() {
            if (this.timeSwitch && lwg.Global._gameLevel) {
                if (this.Mask.x > -78) {
                    if (!this.eatSpeed) {
                        this.eatSpeed = 1;
                    }
                    this.Mask.x -= this.eatSpeed * 0.1;
                }
                else {
                    this.timeSwitch = false;
                    console.log('丢下香蕉');
                    this.createBanana();
                }
            }
        }
    }

    class UIMain_StaticDog extends lwg.Admin.Object {
        lwgInit() {
            this.skeleton = lwg.Sk.gouTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            if (pic.scaleX === -1) {
                this.skeleton.scaleX = -1;
            }
            else {
                this.skeleton.scaleX = 1;
            }
            this.skeleton.play(lwg.Enum.dogAni.standby, true);
            this.createPlaint();
        }
        createPlaint() {
            let img = new Laya.Image();
            img.skin = 'Room/icon_plaint.png';
            img.y = -40;
            img.x = this.self.width / 2;
            this.self.addChild(img);
            img.zOrder = 10;
            this.plaint = img;
        }
        onDisable() {
        }
    }

    class UIMain_Houma extends UIMain_Gongzhu {
        createskeleton() {
            this.skeleton = lwg.Sk.houmaTem.buildArmature(0);
            this.self.addChild(this.skeleton);
            this.skeleton.x = this.self.width / 2;
            this.skeleton.y = this.self.height - 8;
            let pic = this.self.getChildByName('pic');
            pic.visible = false;
            let apple = this.self.getChildByName('apple');
            apple.visible = false;
            this.skeleton.play(lwg.Enum.gongzhuAni.walk, true);
        }
        notCommon() {
            this.signSkin = 'Room/icon_plaint.png';
        }
        onTriggerEnter(other, self) {
            if (!lwg.Global._gameStart) {
                return;
            }
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
                default:
                    break;
            }
        }
        move() {
            if (this.attackSwitch) {
                this.rig.setVelocity({ x: 0, y: 0 });
                return;
            }
            if (this.moveDirection === lwg.Enum.PersonDir.left) {
                this.rig.setVelocity({ x: -this.speed, y: 0 });
                this.skeleton.scaleX = -1;
                let apple = this.self.getChildByName('apple');
                apple.x = -2;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.right) {
                this.rig.setVelocity({ x: this.speed, y: 0 });
                this.skeleton.scaleX = 1;
                let apple = this.self.getChildByName('apple');
                apple.x = 55;
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.up) {
                this.rig.setVelocity({ x: 0, y: -6 });
            }
            else if (this.moveDirection === lwg.Enum.PersonDir.down) {
                this.rig.setVelocity({ x: 0, y: 6 });
            }
        }
        GameOver() {
            this.gameOverMove();
        }
        ;
    }

    class UIMain_Room extends lwg.Admin.Object {
        constructor() {
            super();
            this._roomMove = false;
            this.diffX = null;
            this.diffY = null;
        }
        lwgInit() {
            this.self.pivotX = this.self.width / 2;
            this.self.pivotY = this.self.height / 2;
            this.self['UIMain_Room'] = this;
            this.rig = this.self.getComponent(Laya.RigidBody);
            this.rig.setVelocity({ x: 0, y: 0 });
            this.fX = this.self.x;
            this.fY = this.self.y;
            this.collisionNodeFollow();
            this.boxColliderSet();
            this.wallpaperSet();
        }
        boxColliderSet() {
            let boxCol = this.self.getComponent(Laya.BoxCollider);
            boxCol.width = this.self.width - 6;
            boxCol.height = this.self.height - 6;
            boxCol.x = 3;
            boxCol.y = 3;
        }
        wallpaperSet() {
            let wallpaper = this.self.getChildByName('wallpaper');
            if (wallpaper) {
                wallpaper.removeSelf();
            }
            let wallpaper0 = new Laya.Sprite();
            wallpaper0.loadImage(lwg.Enum.WallpaperSkin[lwg.Enum.RoomSkinZoder[this.self.skin]]);
            this.self.addChild(wallpaper0);
            wallpaper0.zOrder = -5;
            wallpaper0.pos(15.5, 0);
            wallpaper0.height = 50;
            wallpaper0.y = this.self.height - 50 - 15.5;
            let mask = new Laya.Sprite();
            mask.loadImage(lwg.Enum.WallpaperSkin[lwg.Enum.RoomSkinZoder[this.self.skin]]);
            wallpaper0.mask = mask;
            mask.width = this.self.width - 32;
            mask.height = 200;
            mask.y = -10;
        }
        collisionNodeFollow() {
            for (let index = 0; index < this.self.numChildren; index++) {
                const child = this.self.getChildAt(index);
                let rig = child.getComponent(Laya.RigidBody);
                if (rig) {
                    let followScript = child.getComponent(UIMain_Follow);
                    if (!followScript) {
                        child.addComponent(UIMain_Follow);
                    }
                    if (child.name === 'doghouse') {
                        let house = child.getChildByName('house');
                        house.x = -4.5;
                        house.y = -19;
                    }
                }
            }
        }
        onTriggerEnter(other, self) {
        }
        onTriggerStay() {
        }
        btnOnClick() {
            lwg.Click.on('noEffect', null, this.self, this, this.houseDwon, null, null, null);
        }
        houseDwon(e) {
            if (!lwg.Global._gameStart) {
                return;
            }
            if (lwg.Global._gameLevel === 1 && this.self.name === 'Room2') {
                return;
            }
            this._roomX = this.self.x;
            this._roomY = this.self.y;
            this._roomMove = true;
            lwg.Global._roomPickup = this.self;
        }
        onStageMouseDown(e) {
            if (!this._stageX && !this._stageY) {
                this._stageX = e.stageX;
                this._stageY = e.stageY;
            }
        }
        onStageMouseMove(e) {
            if (this._roomMove) {
                this.diffX = e.stageX - this._stageX;
                this.diffY = e.stageY - this._stageY;
                this.self.x = this._roomX + this.diffX;
                this.self.y = this._roomY + this.diffY;
            }
        }
        onStageMouseUp() {
            this.selfScene['UIMain'].currentRoom = null;
            this._roomMove = false;
            this._roomX = null;
            this._roomY = null;
            this._stageX = null;
            this._stageY = null;
            this.diffX = null;
            this.diffY = null;
        }
        onUpdate() {
            if (lwg.Global._gameLevel === 1 && this.self.name === 'Room2') {
                this.self.x = this.fX;
                this.self.y = this.fY;
                return;
            }
        }
        onDisable() {
        }
    }

    class UIPassHint extends lwg.Admin.Scene {
        constructor() {
            super(...arguments);
            this.advAfter = false;
        }
        lwgInit() {
            console.log('出现提示界面');
            ADManager.ShowBanner();
            lwg.Global._stageClick = false;
        }
        adaptive() {
            this.self['sceneContent'].y = Laya.stage.height * 0.481;
        }
        openAni() {
            this.self['BtnNo'].visible = false;
            setTimeout(() => {
                if (this.intoScene === 'UIMain') ;
                else if (lwg.Admin._gameState === lwg.Admin.GameState.Play) {
                    if (this.advAfter) {
                        this.self['BtnNo'].visible = false;
                    }
                    else {
                        this.self['BtnNo'].visible = true;
                    }
                }
                else {
                    this.self['BtnNo'].visible = true;
                }
            }, lwg.Global._btnDelayed);
            return 0;
        }
        setStyle() {
            this.self['Pic'].skin = 'UI_new/PassHint/word_yes.png';
            this.self['BtnNo'].visible = false;
            this.self['iconAdv'].visible = false;
            let num = lwg.Admin.openCustomName.substring(lwg.Admin.openCustomName.length - 3, lwg.Admin.openCustomName.length);
            this.self['Dec'].text = '  ' + lwg.Global._hintDec[Number(num) - 1]['dec'];
            this.self['Pic'].x = this.self['BtnYse'].width / 2 + 10;
            this.self['Pic'].y -= 3;
            this.intoScene = 'UIMain';
        }
        btnOnClick() {
            ADManager.TAPoint(TaT.BtnShow, 'ADrewordbt_freegift');
            ADManager.TAPoint(TaT.BtnShow, 'closeword_freegift');
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnYse'], this, null, null, this.btnYseUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
        }
        btnYseUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewordbt_freegift');
            event.currentTarget.scale(1, 1);
            if (this.self['Pic'].skin === 'UI_new/PassHint/word_yes.png') {
                this.closeScene();
            }
            else if (this.self['Pic'].skin === 'UI_new/Defeated/word_freereplay.png') {
                lwg.Admin._refreshScene();
                this.self.close();
            }
            else {
                ADManager.ShowReward(() => {
                    this.btnYseUpFunc();
                });
            }
        }
        btnYseUpFunc() {
            this.advAfter = true;
            if (this.intoScene === lwg.Admin.SceneName.UIDefeated) {
                this.self['Pic'].skin = 'UI_new/Defeated/word_freereplay.png';
                this.self['Pic'].x -= 30;
            }
            else {
                this.self['Pic'].skin = 'UI_new/PassHint/word_yes.png';
                this.self['Pic'].x = this.self['BtnYse'].width / 2 + 10;
                this.self['Pic'].y -= 3;
            }
            this.self['BtnNo'].visible = false;
            this.self['iconAdv'].visible = false;
            let num = lwg.Admin.openCustomName.substring(lwg.Admin.openCustomName.length - 3, lwg.Admin.openCustomName.length);
            this.self['Dec'].text = '  ' + lwg.Global._hintDec[Number(num) - 1]['dec'];
        }
        btnNoUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'closeword_freegift');
            event.currentTarget.scale(1, 1);
            this.closeScene();
        }
        closeScene() {
            if (lwg.Admin._gameState === lwg.Admin.GameState.GameStart) {
                lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].openPlayScene();
            }
            else if (lwg.Admin._gameState === lwg.Admin.GameState.Victory) {
                lwg.Admin._nextCustomScene(2);
                lwg.Global._goldNum += 25;
                lwg.LocalStorage.addData();
            }
            else if (lwg.Admin._gameState === lwg.Admin.GameState.Defeated) {
                if (this.afterDefeated) {
                    lwg.Admin._nextCustomScene(2);
                }
                else {
                    lwg.Admin._openScene(lwg.Admin.SceneName.UIDefeated, null, null, null);
                }
            }
            else if (lwg.Admin._gameState === lwg.Admin.GameState.Play) {
                if (this.intoScene === 'UIMain') {
                    this.self.close();
                }
                else {
                    lwg.Admin._openScene(lwg.Admin.SceneName.UIDefeated, null, null, null);
                }
            }
            this.self.close();
        }
        lwgDisable() {
            ADManager.CloseBanner();
            lwg.Global._stageClick = true;
            console.log('关闭提示界面');
        }
    }

    class UIPuase extends lwg.Admin.Scene {
        lwgInit() {
            Laya.timer.pause();
            lwg.Global._gameStart = false;
            this.BtnUIStart = this.self['BtnUIStart'];
            this.BtnContinue = this.self['BtnContinue'];
        }
        adaptive() {
            this.self['SceneContent'].y = Laya.stage.height / 2;
        }
        btnOnClick() {
            ADManager.TAPoint(TaT.BtnShow, 'home_pause');
            ADManager.TAPoint(TaT.BtnShow, 'continue_pause');
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnUIStart, this, null, null, this.BtnUIStartUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnContinue, this, null, null, this.BtnContinueUp, null);
        }
        BtnUIStartUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'home_pause');
            event.currentTarget.scale(1, 1);
            lwg.Admin._openScene('UIStart', null, this.self, f => {
                this.self.close();
                lwg.Admin._closeCustomScene();
            });
        }
        BtnContinueUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'continue_pause');
            event.currentTarget.scale(1, 1);
            this.self.close();
        }
        lwgDisable() {
            Laya.timer.resume();
            lwg.Global._gameStart = true;
        }
    }

    class UIPifu extends lwg.Admin.Scene {
        constructor() {
            super();
            this.moveSwitch = false;
            this.noHaveIndex = 0;
        }
        selfVars() {
            ADManager.CloseBanner();
            this.PifuList = this.self['PifuList'];
            this.BtnBack = this.self['BtnBack'];
            this.BtnBuy = this.self['BtnBuy'];
            this.BtnSelect = this.self['BtnSelect'];
            ADManager.TAPoint(TaT.BtnShow, 'gold_skin');
            ADManager.TAPoint(TaT.BtnShow, 'choose_skin');
            if (!lwg.Global._elect) {
                this.self['P201'].visible = false;
            }
            this.background = this.self['background'];
        }
        lwgInit() {
            lwg.Global._havePifu.push(lwg.Enum.PifuAllName[9]);
            lwg.Global.ExecutionNumNode.alpha = 0;
            lwg.Global._stageClick = false;
            if (lwg.Enum.PifuAllName[lwg.Global._currentPifu]) {
                this.listFirstIndex = lwg.Enum.PifuAllName[lwg.Global._currentPifu];
            }
            else {
                this.listFirstIndex = lwg.Enum.PifuAllName['01_gongzhu'];
            }
            lwg.Global.notHavePifuSubXD();
            this.createPifuList();
            this.priceDisplay();
        }
        adaptive() {
            this.self['TowBtn'].y = Laya.stage.height * 0.766;
            this.self['PifuLogo'].y = Laya.stage.height * 0.160;
            this.self['PifuName'].y = Laya.stage.height * 0.261;
            this.self['MatchDot'].y = Laya.stage.height * 0.684;
            this.self['background_01'].height = Laya.stage.height;
            this.self['BtnBack'].y = Laya.stage.height * 0.883;
            this.self['P201'].y = Laya.stage.height * 0.208;
            this.PifuList.y = Laya.stage.height * 0.471;
        }
        priceDisplay() {
            let price = 250 * lwg.Global._buyNum - 150;
            let num = this.BtnBuy.getChildByName('Num');
            num.text = 'x' + price.toString();
        }
        createPifuList() {
            this.PifuList.hScrollBarSkin = "";
            this.PifuList.selectHandler = new Laya.Handler(this, this.onSelect_List);
            this.PifuList.renderHandler = new Laya.Handler(this, this.updateItem);
            this.refreshListData(null);
            this.matchDotStaly();
            this.selectPifuStyle();
            this.listOpenAni();
        }
        listOpenAni() {
            if (0 <= this.listFirstIndex && this.listFirstIndex <= 4) {
                this.PifuList.scrollTo(this.PifuList.length - 1);
            }
            else {
                this.PifuList.scrollTo(0);
            }
            this.PifuList.tweenTo(this.listFirstIndex, 600);
        }
        refreshListData(func) {
            var data = [];
            for (var m = -1; m < 11; m++) {
                if (m === -1 || m === 10) {
                    data.push({
                        stance: true
                    });
                    continue;
                }
                let name = lwg.Global._allPifu[m];
                let have = false;
                for (let index = 0; index < lwg.Global._havePifu.length; index++) {
                    const element = lwg.Global._havePifu[index];
                    if (lwg.Global._allPifu[m] === lwg.Global._havePifu[index]) {
                        have = true;
                    }
                }
                let pifuUrl;
                if (have) {
                    pifuUrl = lwg.Enum.PifuSkin[m];
                }
                else {
                    pifuUrl = lwg.Enum.PifuSkin_No[m];
                }
                let selectWord;
                if (lwg.Global._currentPifu === lwg.Enum.PifuAllName[m]) {
                    selectWord = true;
                }
                else {
                    selectWord = false;
                }
                let scale;
                if (m === this.listFirstIndex) {
                    scale = 1;
                }
                else {
                    scale = 0.7;
                }
                data.push({
                    have,
                    pifuUrl,
                    selectWord,
                    scale
                });
            }
            this.PifuList.array = data;
            if (func !== null) {
                func();
            }
        }
        onSelect_List(index) {
        }
        updateItem(cell, index) {
            let dataSource = cell.dataSource;
            let pifuImg = cell.getChildByName('PifuImg');
            let select = cell.getChildByName('Select');
            pifuImg.skin = dataSource.pifuUrl;
            cell.scale(dataSource.scale, dataSource.scale);
        }
        onStageMouseDown() {
            this.firstX = Laya.MouseManager.instance.mouseX;
            this.moveSwitch = true;
        }
        onStageMouseUp() {
            let x = Laya.MouseManager.instance.mouseX;
            if (!this.moveSwitch) {
                return;
            }
            let diffX = x - this.firstX;
            if (diffX > 80) {
                this.listFirstIndex -= 1;
                if (this.listFirstIndex < 0) {
                    this.listFirstIndex = 0;
                }
            }
            else if (diffX < -80) {
                this.listFirstIndex += 1;
                if (this.listFirstIndex > 9) {
                    this.listFirstIndex = 9;
                }
            }
            this.moveSwitch = false;
            this.PifuList.tweenTo(this.listFirstIndex, 50, Laya.Handler.create(this, this.moveCompelet));
        }
        moveCompelet() {
            this.refreshListData(null);
            this.matchDotStaly();
            this.whetherHaveThisPifu();
            this.selectPifuStyle();
        }
        selectPifuStyle() {
            let wordpic = this.BtnSelect.getChildByName('wordpic');
            if (this.PifuList.array[this.listFirstIndex + 1].selectWord) {
                wordpic.skin = 'UI_new/Pifu/word_scelet_02.png';
                wordpic.x = 67;
            }
            else {
                wordpic.skin = 'UI_new/Pifu/word_scelet_01.png';
                wordpic.x = 87;
            }
        }
        matchDotStaly() {
            let MatchDot = this.self['MatchDot'];
            console.log(this.listFirstIndex);
            for (let index = 0; index < MatchDot.numChildren; index++) {
                const element = MatchDot.getChildAt(index);
                if (element.name === this.listFirstIndex.toString()) {
                    element.getChildAt(0)['visible'] = false;
                    element.getChildAt(1)['visible'] = true;
                }
                else {
                    element.getChildAt(1)['visible'] = false;
                    element.getChildAt(0)['visible'] = true;
                }
            }
            let namePic = this.self['PifuName'].getChildByName('namePic');
            namePic.skin = lwg.Enum.PifuNameSkin[this.listFirstIndex];
            namePic.pivotX = namePic.width / 2;
            namePic.x = this.self['PifuName'].width / 2;
        }
        whetherHaveThisPifu() {
            let cell = this.PifuList.getCell(this.listFirstIndex + 1);
            if (cell.dataSource.have) {
                this.showSelect = true;
                this.BtnSelect.skin = 'UI_new/Victory/green_btn.png';
            }
            else {
                this.showSelect = false;
                this.BtnSelect.skin = 'UI_new/Victory/rede_btn_01.png';
            }
        }
        btnOnClick() {
            lwg.Click.on('largen', null, this.BtnBack, this, null, null, this.btnBackUp, null);
            lwg.Click.on('largen', null, this.BtnBuy, this, null, null, this.btnBuyUp, null);
            lwg.Click.on('largen', null, this.BtnSelect, this, null, null, this.btnSelectUp, null);
        }
        btnBackUp(event) {
            event.stopPropagation();
            event.currentTarget.scale(1, 1);
            this.self.close();
            lwg.LocalStorage.addData();
        }
        btnBuyUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'gold_skin');
            event.currentTarget.scale(1, 1);
            event.stopPropagation();
            let price = 250 * lwg.Global._buyNum - 150;
            if (lwg.Global._goldNum < price || lwg.Global._notHavePifuSubXD.length <= 0) {
                if (lwg.Global._goldNum < price) {
                    lwg.Global._createHint_01(lwg.Enum.HintType.noGold);
                }
                else if (lwg.Global._notHavePifuSubXD.length <= 0) {
                    lwg.Global._createHint_01(lwg.Enum.HintType.noGetPifu);
                }
                return;
            }
            else {
                lwg.Global._goldNum -= price;
                let Num = lwg.Global.GoldNumNode.getChildByName('Num');
                Num.value = lwg.Global._goldNum.toString();
                lwg.Global._buyNum++;
                let random = Math.floor(Math.random() * lwg.Global._notHavePifuSubXD.length);
                this.buyIndex = lwg.Enum.PifuAllName[lwg.Global._notHavePifuSubXD[random]];
                console.log('购买了第' + this.buyIndex + '位置的皮肤');
                this.nohavePifuAni();
            }
        }
        nohavePifuAni() {
            let noHavePifu_00 = lwg.Global._notHavePifuSubXD[this.noHaveIndex];
            console.log(noHavePifu_00);
            let index;
            if (noHavePifu_00) {
                index = lwg.Enum.PifuAllName[noHavePifu_00];
                this.listFirstIndex = index;
                this.refreshListData(null);
                this.PifuList.tweenTo(index, 200, Laya.Handler.create(this, function () {
                    this.noHaveIndex++;
                    this.nohavePifuAni();
                }));
            }
            else {
                console.log('循环完毕，准备循环到被购买的那个皮肤', this.buyIndex);
                this.PifuList.tweenTo(this.buyIndex, (11 - this.buyIndex) * 100, Laya.Handler.create(this, function () {
                    this.noHaveIndex = 0;
                    this.listFirstIndex = this.buyIndex;
                    this.buyCompelet();
                }));
            }
        }
        buyCompelet() {
            lwg.Global._havePifu.push(lwg.Enum.PifuAllName[this.buyIndex]);
            lwg.Global.notHavePifuSubXD();
            this.refreshListData(f => {
                this.priceDisplay();
                this.selectPifuStyle();
                this.matchDotStaly();
                lwg.LocalStorage.addData();
            });
            console.log('购买完成！');
        }
        btnSelectUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'choose_skin');
            event.stopPropagation();
            event.currentTarget.scale(1, 1);
            this.whetherHaveThisPifu();
            if (this.showSelect) {
                lwg.Global._currentPifu = lwg.Global._allPifu[this.listFirstIndex];
                this.refreshListData(null);
                this.selectPifuStyle();
            }
        }
        lwgDisable() {
            lwg.LocalStorage.addData();
            lwg.Global._stageClick = true;
            lwg.Global.ExecutionNumNode.alpha = 1;
            ADManager.ShowBanner();
        }
    }

    class UIPifuTry extends lwg.Admin.Scene {
        constructor() { super(); }
        lwgInit() {
            this.self = this.owner;
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_skintry');
            ADManager.TAPoint(TaT.BtnShow, 'close_skintry');
            if (!lwg.Global._elect) {
                this.self['P201'].visible = false;
            }
            lwg.Global.notHavePifuSubXD();
            this.randomNoHave();
        }
        adaptive() {
            this.self['SceneContent'].y = Laya.stage.height / 2;
            this.self['P201'].y = Laya.stage.height * 0.237;
            this.self['background_01'].height = Laya.stage.height;
        }
        openAni() {
            return 0;
        }
        randomNoHave() {
            let len = lwg.Global._notHavePifuSubXD.length;
            if (len === 0) {
                this.self.close();
                lwg.Global._gameStart = true;
                return;
            }
            let random = Math.floor(Math.random() * len);
            let pifuName = lwg.Global._notHavePifu[random];
            let oder1 = lwg.Enum.PifuAllName[pifuName];
            this.pifuNum = oder1;
            let pifuImg = this.self['Pifu'].getChildByName('img');
            let oder2 = lwg.Enum.PifuAllName[pifuName];
            pifuImg.skin = lwg.Enum.PifuSkin[oder2];
        }
        btnOnClick() {
            lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['BtnCheck'], this, null, null, this.btnCheckUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnGet'], this, null, null, this.btnAdvUp, null);
        }
        btnAdvUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_skintry');
            event.currentTarget.scale(1, 1);
            let check = this.self['BtnCheck'].getChildByName('Check');
            if (check.visible) {
                ADManager.ShowReward(() => {
                    this.btnAdvFunc();
                });
            }
            else {
                event.currentTarget.scale(1, 1);
                this.self.close();
                lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].openPlayScene();
            }
        }
        btnCheckUp(e) {
            let check = this.self['BtnCheck'].getChildByName('Check');
            let word = this.self['BtnGet'].getChildByName('word');
            if (check.visible) {
                check.visible = false;
                word.skin = 'UI_new/PifuTry/free_btn1.png';
            }
            else {
                check.visible = true;
                word.skin = 'UI_new/PifuTry/word_freetry.png';
            }
        }
        btnNoUp(event) {
            event.currentTarget.scale(1, 1);
            this.self.close();
            lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].openPlayScene();
        }
        btnAdvFunc() {
            this.self.close();
            lwg.Global._yuanpifu = lwg.Global._currentPifu;
            lwg.Global._currentPifu = lwg.Enum.PifuAllName[this.pifuNum];
            lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].openPlayScene();
            this.self.close();
            lwg.LocalStorage.addData();
        }
        onDisable() {
        }
    }

    class UIRedeem extends lwg.Admin.Scene {
        selfVars() {
            this.TextInput = this.self['TextInput'];
        }
        adaptive() {
            this.self['SceneContent'].y = Laya.stage.height * 0.478;
        }
        btnOnClick() {
            lwg.Click.on('largen', null, this.self['BtnYes'], this, null, null, this.btnYesClickUP, null);
            lwg.Click.on('largen', null, this.self['BtnNo'], this, null, null, this.btnNoClickUP, null);
        }
        btnYesClickUP(event) {
            let input = this.TextInput.getChildAt(0);
            if (input.text === '23332333') {
                lwg.Admin._openScene(lwg.Admin.SceneName.UIAnchorXD, null, this.self, null);
            }
            else {
                lwg.Global._createHint_01(lwg.Enum.HintType.inputerr);
            }
            event.currentTarget.scale(1, 1);
        }
        btnNoClickUP(event) {
            event.currentTarget.scale(1, 1);
            this.self.close();
        }
    }

    class UISet extends lwg.Admin.Scene {
        lwgInit() {
            this.self = this.owner;
            this.BtnVoice = this.self['BtnVoice'];
            this.BtnShake = this.self['BtnShake'];
            this.BtnClose = this.self['BtnClose'];
            this.btnVoiceAndBtnShake();
            if (!lwg.Global._elect) {
                this.self['P204'].visible = false;
            }
        }
        adaptive() {
            this.self['P204'].y = Laya.stage.height - 75;
            this.self['SceneContent'].y = Laya.stage.height * 0.471;
        }
        btnVoiceAndBtnShake() {
            let voiceImg = this.BtnVoice.getChildAt(0);
            let voiceUrl1 = 'UI_new/Set/icon_voice_on.png';
            let voiceUrl2 = 'UI_new/Set/icon_voice_off.png';
            if (lwg.PalyAudio._voiceSwitch) {
                voiceImg.skin = voiceUrl1;
            }
            else {
                voiceImg.skin = voiceUrl2;
            }
            let shakeImg = this.BtnShake.getChildAt(0);
            let shakeUrl1 = 'UI_new/Set/icon_shake_on.png';
            let shakeUrl2 = 'UI_new/Set/icon_shake_off.png';
            if (lwg.Global._shakeSwitch) {
                shakeImg.skin = shakeUrl1;
            }
            else {
                shakeImg.skin = shakeUrl2;
            }
        }
        btnOnClick() {
            lwg.Click.on('largen', null, this.BtnVoice, this, null, null, this.btnVoiceClickUP, null);
            lwg.Click.on('largen', null, this.BtnShake, this, null, null, this.btnShakeClickUP, null);
            lwg.Click.on('largen', null, this.BtnClose, this, null, null, this.btnCloseClickUP, null);
            lwg.Click.on('largen', null, this.self['BtnRedeem'], this, null, null, this.btnRedeemClickUP, null);
        }
        btnRedeemClickUP(event) {
            event.currentTarget.scale(1, 1);
            lwg.Admin._openScene(lwg.Admin.SceneName.UIRedeem, null, null, null);
        }
        btnVoiceClickUP(event) {
            event.currentTarget.scale(1, 1);
            let voiceImg = this.BtnVoice.getChildAt(0);
            let voiceUrl1 = 'UI_new/Set/icon_voice_on.png';
            let voiceUrl2 = 'UI_new/Set/icon_voice_off.png';
            if (voiceImg.skin === voiceUrl1) {
                voiceImg.skin = voiceUrl2;
                lwg.PalyAudio._voiceSwitch = false;
                lwg.PalyAudio.stopMusic();
            }
            else if (voiceImg.skin === voiceUrl2) {
                voiceImg.skin = voiceUrl1;
                lwg.PalyAudio._voiceSwitch = true;
                lwg.PalyAudio.playMusic(lwg.Enum.voiceUrl.bgm, 0, 0);
            }
        }
        btnShakeClickUP(event) {
            event.currentTarget.scale(1, 1);
            let img = this.BtnShake.getChildAt(0);
            let url1 = 'UI_new/Set/icon_shake_on.png';
            let url2 = 'UI_new/Set/icon_shake_off.png';
            if (img.skin === url1) {
                img.skin = url2;
                lwg.Global._shakeSwitch = false;
            }
            else if (img.skin === url2) {
                img.skin = url1;
                lwg.Global._shakeSwitch = true;
            }
        }
        btnCloseClickUP(event) {
            event.currentTarget.scale(1, 1);
            this.self.close();
        }
        onDisable() {
        }
    }

    class UIShare extends lwg.Admin.Scene {
        adaptive() {
            this.self['SceneContent'].y = Laya.stage.height / 2;
        }
        btnOnClick() {
            ADManager.TAPoint(TaT.BtnShow, 'home_pause');
            ADManager.TAPoint(TaT.BtnShow, 'continue_pause');
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['Photo'], this, null, null, this.photoUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnNoShare'], this, null, null, this.btnNoShareUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
        }
        photoUp(event) {
            event.currentTarget.scale(1, 1);
            RecordManager._share('award', () => {
                this.btnShareUpFunc();
            });
        }
        btnNoShareUp(event) {
            this.self.close();
            event.currentTarget.scale(1, 1);
        }
        btnShareUp(event) {
            console.log('点击按钮的分享！');
            event.currentTarget.scale(1, 1);
            RecordManager._share('award', () => {
                this.btnShareUpFunc();
            });
        }
        btnShareUpFunc() {
            console.log('分享成功了！');
            lwg.Global._createHint_01(lwg.Enum.HintType.shareyes);
            lwg.Global._goldNum += 125;
            let Num = lwg.Global.GoldNumNode.getChildByName('Num');
            Num.value = (Number(Num.value) + 125).toString();
            this.self.close();
            let d = new Date();
            lwg.Global._hotShare = false;
            lwg.Global._hotShareTime = d.getDate();
        }
    }

    class UISmallHint extends lwg.Admin.Scene {
        adaptive() {
            this.self['SceneContent'].y = Laya.stage.height / 2;
        }
        btnOnClick() {
            lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['BtnYes'], this, null, null, this.btnYesUp, null);
            lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
        }
        btnYesUp() {
            ADManager.ShowReward(() => {
                lwg.Admin._openScene(lwg.Admin.SceneName.UIPassHint, null, null, f => {
                    lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].intoScene = 'UIMain';
                    lwg.Admin._sceneControl['UIPassHint']['UIPassHint'].setStyle();
                    this.self.close();
                });
            });
        }
        btnNoUp() {
            this.self.close();
        }
    }

    class UIStart extends lwg.Admin.Scene {
        constructor() {
            super();
            this.listWPos = new Laya.Point();
            this.moveSwitch = false;
            this.btnPainted = false;
            this.btnPifu = false;
        }
        selfVars() {
            this.CustomsList = this.self['CustomsList'];
            this.SceneContent = this.self['SceneContent'];
            this.BtnStart = this.self['BtnStart'];
            this.BtnPifu = this.self['BtnPifu'];
            this.BtnLocation = this.self['BtnLocation'];
        }
        lwgInit() {
            lwg.Global._stageClick = false;
            ADManager.TAPoint(TaT.BtnShow, 'startbt_main');
            ADManager.TAPoint(TaT.BtnShow, 'CDwall_mainpage');
            ADManager.TAPoint(TaT.BtnShow, 'turn_mainpage');
            this.BtnLocation.visible = false;
            if (lwg.Global._watchAdsNum >= 3) {
                this.self['BtnXD'].removeSelf();
            }
            this.listWPos.x = this.CustomsList.x + this.SceneContent.x - this.SceneContent.width / 2;
            this.listWPos.y = this.CustomsList.y + this.SceneContent.y - this.SceneContent.height / 2;
            this.createCustomsList();
            ADManager.ShowBanner();
            if (!lwg.Global._elect) {
                this.self['P201'].visible = false;
            }
            Laya.MouseManager.multiTouchEnabled = true;
        }
        adaptive() {
            this.SceneContent.y = Laya.stage.height * 0.468;
        }
        openAni() {
            let time = 80;
            let delayed = 100;
            let zhuanpan = this.self['BtnTurntable'].getChildByName('zhuanpan');
            Animation.drop_KickBack(this.self['BtnTurntable'], 0, -1200, this.self['BtnTurntable'].y, 30, time * 4, 0, f => {
                Laya.timer.frameLoop(1, this, f => {
                    zhuanpan.rotation++;
                });
            });
            let dan = this.self['BtnPainted'].getChildByName('dan');
            Animation.drop_KickBack(this.self['BtnPainted'], 0, -1200, this.self['BtnPainted'].y, 30, time * 4, delayed * 2, f => {
                Laya.timer.loop(3000, this, f => {
                    Animation.shookHead_Simple(dan, 10, time * 3, 0, f => { });
                });
                Laya.timer.loop(1500, this, f => {
                    let scope = 20;
                    let ranX;
                    if (Math.floor(Math.random() * 2) === 1) {
                        ranX = this.self['BtnPainted'].width / 2 + Math.random() * scope;
                    }
                    else {
                        ranX = this.self['BtnPainted'].width / 2 - Math.random() * scope;
                    }
                    let ranY;
                    if (Math.floor(Math.random() * 2) === 1) {
                        ranY = this.self['BtnPainted'].height / 2 + Math.random() * scope - 25;
                    }
                    else {
                        ranY = this.self['BtnPainted'].height / 2 - Math.random() * scope - 25;
                    }
                    Effects.createExplosion_Rotate(this.self['BtnPainted'], 10, ranX, ranY, 'star', 3, 15);
                });
            });
            Animation.drop_KickBack(this.self['BtnPifu'], 0, -1200, this.self['BtnPifu'].y, 30, time * 4, delayed * 3, f => { });
            if (this.self['BtnXD'].visible) {
                let wordXd = this.self['BtnXD'].getChildByName('wordXd');
                let wordXd_01 = this.self['BtnXD'].getChildByName('wordXd_01');
                wordXd_01.alpha = 0;
                wordXd.alpha = 0;
                Animation.drop_KickBack(this.self['BtnXD'], 0, -1200, this.self['BtnXD'].y, 30, time * 4, delayed * 1, f => {
                    wordXd.alpha = 1;
                    lwg.Animation.move_Scale(wordXd, 1, 200, 75, 99, 59, 2, time * 3, 200, f => {
                        lwg.Animation.move_Scale(wordXd, wordXd.scaleX, wordXd.x, wordXd.y, 68, 73, 1, time * 0.7, 0, f => {
                            wordXd.removeSelf();
                            wordXd_01.alpha = 1;
                            lwg.Animation.rotate_Scale(this.self['BtnXD'], 0, 1, 1, 0, 0.88, 0.88, time * 1.2, 0, f => {
                                lwg.Global._stageClick = true;
                            });
                            if (!lwg.Global._todayCheckIn) {
                                lwg.Global._todayCheckIn = true;
                                lwg.Admin._openScene(lwg.Admin.SceneName.UICheckIn, null, null, null);
                            }
                        });
                    });
                });
            }
            Animation.bombs_Appear(this.BtnStart, 0, 1, 1.1, 0, time * 3, time, delayed, null, f => {
                Animation.swell_shrink(this.BtnStart, 1, 1.1, time * 1.5, delayed, f => {
                    Laya.timer.loop(3000, this, f => {
                        Animation.swell_shrink(this.BtnStart, 1, 1.1, time * 1.5, delayed, f => {
                        });
                    });
                });
            });
            Animation.blink_FadeOut(lwg.Global.ExecutionNumNode, 0, 1, time * 5, delayed * 2, f => {
            });
            Animation.blink_FadeOut(lwg.Global.GoldNumNode, 0, 1, time * 5, delayed * 2, f => {
            });
            return time * 5;
        }
        createCustomsList() {
            this.CustomsList.selectEnable = false;
            this.CustomsList.vScrollBarSkin = "";
            this.CustomsList.selectHandler = new Laya.Handler(this, this.onSelect_List);
            this.CustomsList.renderHandler = new Laya.Handler(this, this.updateItem);
            this.listFirstIndex = lwg.Global._gameLevel;
            this.refreshListData();
            this.listOpenAni();
        }
        listOpenAni() {
            this.CustomsList.scrollTo(lwg.Global._CustomsNum);
            this.CustomsList.tweenTo(this.listFirstIndex, 600, Laya.Handler.create(this, f => {
                let cell = this.CustomsList.getCell(this.listFirstIndex);
                cell.alpha = 1;
                let pic = cell.getChildByName('pic');
                if (this.listFirstIndex % 2 == 0) {
                    pic.skin = 'UI_new/GameStart/icon_box01_open.png';
                }
                else {
                    pic.skin = 'UI_new/GameStart/icon_box02_open.png';
                }
            }));
        }
        refreshListData() {
            var data = [];
            for (var index = 0; index < lwg.Global._CustomsNum; index++) {
                let customNum = index;
                let picUrl;
                let offsetX;
                if (index % 2 == 0) {
                    picUrl = 'UI_new/GameStart/icon_box01.png';
                    offsetX = 135;
                }
                else {
                    picUrl = 'UI_new/GameStart/icon_box02.png';
                    offsetX = 155;
                }
                let zOder = lwg.Global._CustomsNum - index;
                let lock;
                if (index >= lwg.Global._gameLevel) {
                    lock = false;
                }
                else {
                    lock = true;
                }
                data.push({
                    customNum,
                    picUrl,
                    offsetX,
                    zOder,
                    lock
                });
            }
            this.CustomsList.array = data;
        }
        onSelect_List(index) {
        }
        updateItem(cell, index) {
            let dataSource = cell.dataSource;
            cell.zOrder = dataSource.zOder;
            let pic = cell.getChildByName('pic');
            pic.skin = dataSource.picUrl;
            pic.x = dataSource.offsetX;
            let num = pic.getChildByName('LvNum');
            num.value = dataSource.customNum.toString();
            let lock = pic.getChildByName('lock');
            lock.visible = dataSource.lock;
            cell.name = 'item' + dataSource.customNum;
            if (index === this.listFirstIndex) {
                cell.alpha = 0;
            }
            else {
                cell.alpha = 1;
            }
            if (this.listFirstIndex > lwg.Global._gameLevel || this.listFirstIndex < lwg.Global._gameLevel - 3) {
                this.BtnLocation.visible = true;
            }
            else {
                this.BtnLocation.visible = false;
            }
        }
        onStageMouseDown(e) {
            if (!lwg.Global._stageClick || lwg.Global._openXD) {
                return;
            }
            this.firstY = Laya.MouseManager.instance.mouseY;
            this.moveSwitch = true;
        }
        onStageMouseUp() {
            let y = Laya.MouseManager.instance.mouseY;
            if (!this.moveSwitch) {
                return;
            }
            let diffY = y - this.firstY;
            if (diffY > 10) {
                this.listFirstIndex -= 1;
                if (this.listFirstIndex < 1) {
                    this.listFirstIndex = 1;
                }
                else {
                    this.createAddHouse();
                }
            }
            else if (diffY < -10) {
                this.listFirstIndex += 1;
                if (this.listFirstIndex > lwg.Global._CustomsNum) {
                    this.listFirstIndex = lwg.Global._CustomsNum;
                }
                else {
                    this.creatSubHouse();
                }
            }
            this.moveSwitch = false;
            this.CustomsList.tweenTo(this.listFirstIndex, 100, Laya.Handler.create(this, f => { }));
        }
        createAddHouse() {
            let time = 600;
            let house = Laya.Pool.getItemByCreateFun('house', this.house.create, this.house);
            this.SceneContent.addChild(house);
            house.pos(this.CustomsList.x - 400, this.CustomsList.y - 300);
            house['UIStart_House'].index = this.listFirstIndex;
            lwg.Animation.move_Simple(house, house.x, house.y, this.CustomsList.x, this.CustomsList.y, time, 0, f => {
                house.removeSelf();
                let cell1 = this.CustomsList.getCell(house['UIStart_House'].index);
                if (cell1) {
                    cell1.alpha = 1;
                    let pic1 = cell1.getChildByName('pic');
                    if (house['UIStart_House'].index <= lwg.Global._gameLevel) {
                        if (house['UIStart_House'].index % 2 == 0) {
                            pic1.skin = 'UI_new/GameStart/icon_box01_open.png';
                        }
                        else {
                            pic1.skin = 'UI_new/GameStart/icon_box02_open.png';
                        }
                    }
                    else {
                        if (house['UIStart_House'].index % 2 == 0) {
                            pic1.skin = 'UI_new/GameStart/icon_box01.png';
                        }
                        else {
                            pic1.skin = 'UI_new/GameStart/icon_box02.png';
                        }
                    }
                }
                let cell2 = this.CustomsList.getCell(house['UIStart_House'].index + 1);
                if (cell2) {
                    let pic2 = cell2.getChildByName('pic');
                    if ((house['UIStart_House'].index + 1) % 2 === 0) {
                        pic2.skin = 'UI_new/GameStart/icon_box01.png';
                    }
                    else {
                        pic2.skin = 'UI_new/GameStart/icon_box02.png';
                    }
                }
            });
            let pic = house.getChildByName('pic');
            let lvNum = pic.getChildByName('LvNum');
            lvNum.value = this.listFirstIndex.toString();
            if (this.listFirstIndex <= lwg.Global._gameLevel) {
                if (this.listFirstIndex % 2 == 0) {
                    pic.skin = 'UI_new/GameStart/icon_box01_open.png';
                    pic.x = 135;
                }
                else {
                    pic.skin = 'UI_new/GameStart/icon_box02_open.png';
                    pic.x = 155;
                }
            }
            else {
                if (this.listFirstIndex % 2 == 0) {
                    pic.skin = 'UI_new/GameStart/icon_box01.png';
                    pic.x = 135;
                }
                else {
                    pic.skin = 'UI_new/GameStart/icon_box02.png';
                    pic.x = 155;
                }
            }
            let lock = pic.getChildByName('lock');
            if (this.listFirstIndex >= lwg.Global._gameLevel) {
                lock.visible = false;
            }
            else {
                lock.visible = true;
            }
            lwg.Animation.simple_Rotate(pic, 250, 360, time, null);
        }
        creatSubHouse() {
            let cell1 = this.CustomsList.getCell(this.listFirstIndex);
            if (cell1) {
                let pic = cell1.getChildByName('pic');
                if (this.listFirstIndex <= lwg.Global._gameLevel) {
                    if (this.listFirstIndex % 2 == 0) {
                        pic.skin = 'UI_new/GameStart/icon_box01_open.png';
                        pic.x = 135;
                    }
                    else {
                        pic.skin = 'UI_new/GameStart/icon_box02_open.png';
                        pic.x = 155;
                    }
                }
                else {
                    if (this.listFirstIndex % 2 == 0) {
                        pic.skin = 'UI_new/GameStart/icon_box01.png';
                        pic.x = 135;
                    }
                    else {
                        pic.skin = 'UI_new/GameStart/icon_box02.png';
                        pic.x = 155;
                    }
                }
            }
            let time = 1000;
            let house = Laya.Pool.getItemByCreateFun('house', this.house.create, this.house);
            this.SceneContent.addChild(house);
            house.pos(this.CustomsList.x, this.CustomsList.y);
            lwg.Animation.move_Simple(house, house.x, house.y, this.CustomsList.x + 800, this.CustomsList.y + 500, time, 0, f => {
                house.removeSelf();
            });
            let pic = house.getChildByName('pic');
            let lvNum = pic.getChildByName('LvNum');
            lvNum.value = (this.listFirstIndex - 1).toString();
            if (this.listFirstIndex <= lwg.Global._gameLevel) {
                if (this.listFirstIndex % 2 == 0) {
                    pic.skin = 'UI_new/GameStart/icon_box01_open.png';
                    pic.x = 135;
                }
                else {
                    pic.skin = 'UI_new/GameStart/icon_box02_open.png';
                    pic.x = 155;
                }
            }
            else {
                if (this.listFirstIndex % 2 == 0) {
                    pic.skin = 'UI_new/GameStart/icon_box01.png';
                    pic.x = 135;
                }
                else {
                    pic.skin = 'UI_new/GameStart/icon_box02.png';
                    pic.x = 155;
                }
            }
            let lock = pic.getChildByName('lock');
            if (this.listFirstIndex >= lwg.Global._gameLevel) {
                lock.visible = false;
            }
            else {
                lock.visible = true;
            }
            lwg.Animation.simple_Rotate(pic, 0, 180, time, null);
        }
        btnOnClick() {
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnStart, this, null, null, this.btnStartClickUp, null);
            lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.BtnLocation, this, null, null, this.btnLocationUp, null);
            lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.CustomsList, this, null, null, this.customsListUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnXD'], this, null, null, this.btnXDUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnSet'], this, null, null, this.btnSetUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnPainted'], this, this.btnPaintedDown, null, this.btnPaintedUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnPifu, this, this.btnPifuDown, null, this.btnPifuUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnTurntable'], this, null, null, this.btnTurntableUp, null);
        }
        btnPaintedDown(e) {
            e.stopPropagation();
            if (lwg.Global._haimiangongzhu) {
                return;
            }
            e.currentTarget.scale(1.1, 1.1);
            this.btnPainted = true;
        }
        btnPaintedUp(e) {
            ADManager.TAPoint(TaT.BtnClick, 'CDwall_mainpage');
            e.currentTarget.scale(1, 1);
            if (!this.candanFunc()) {
                lwg.Admin._openScene(lwg.Admin.SceneName.UICaiDanQiang, null, null, null);
            }
            this.btnPainted = false;
            this.btnPifu = false;
        }
        btnPifuDown(e) {
            e.stopPropagation();
            if (lwg.Global._haimiangongzhu) {
                return;
            }
            e.currentTarget.scale(1.1, 1.1);
            this.btnPifu = true;
        }
        btnPifuUp(event) {
            event.currentTarget.scale(1, 1);
            if (!this.candanFunc()) {
                lwg.Admin._openScene('UIPifu', null, null, null);
            }
            this.btnPainted = false;
            this.btnPifu = false;
        }
        candanFunc() {
            if (this.btnPainted && this.btnPifu) {
                lwg.Admin._openScene(lwg.Admin.SceneName.UICaidanPifu, null, null, f => {
                    this.btnPainted = false;
                    this.btnPifu = false;
                });
                return true;
            }
            else {
                return false;
            }
        }
        btnTurntableUp(e) {
            e.currentTarget.scale(1, 1);
            lwg.Admin._openScene(lwg.Admin.SceneName.UITurntable, null, null, null);
            ADManager.TAPoint(TaT.BtnClick, 'turn_mainpage');
        }
        btnSetUp() {
            lwg.Admin._openScene(lwg.Admin.SceneName.UISet, null, null, null);
        }
        btnXDUp() {
            lwg.Admin._openScene(lwg.Admin.SceneName.UIXDpifu, null, null, null);
        }
        btnStartClickUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'startbt_main');
            event.currentTarget.scale(1, 1);
            if (this.listFirstIndex > lwg.Global._gameLevel) {
                lwg.Global._createHint_01(lwg.Enum.HintType.nopass);
            }
            else {
                if (lwg.Global._execution < 2) {
                    lwg.Admin._openScene('UIExecutionHint', null, null, null);
                }
                else {
                    if (lwg.Global._havePifu.length < 7) {
                        if (this.listFirstIndex <= 9) {
                            lwg.Admin.openCustomName = 'UIMain_00' + this.listFirstIndex;
                        }
                        else if (9 < this.listFirstIndex || this.listFirstIndex <= 99) {
                            lwg.Admin.openCustomName = 'UIMain_0' + this.listFirstIndex;
                        }
                        lwg.Admin.openLevelNum = this.listFirstIndex;
                        lwg.Admin._openScene(lwg.Admin.SceneName.UIPifuTry, null, null, null);
                    }
                    else {
                        this.openPlayScene();
                    }
                }
            }
        }
        openPlayScene() {
            lwg.Global._execution -= 2;
            let num = lwg.Global.ExecutionNumNode.getChildByName('Num');
            num.value = lwg.Global._execution.toString();
            lwg.Global._createHint_01(lwg.Enum.HintType.consumeEx);
            lwg.Global.createConsumeEx(null);
            lwg.LocalStorage.addData();
            lwg.Admin._openNumCustom(this.listFirstIndex);
            this.self.close();
        }
        openPlayScene_exemptEx() {
            lwg.Admin._openNumCustom(this.listFirstIndex);
            this.self.close();
        }
        btnLocationUp(event) {
            event.currentTarget.scale(1, 1);
            this.listFirstIndex = lwg.Global._gameLevel;
            this.CustomsList.refresh();
            this.createAddHouse();
        }
        cellStyle(cell) {
            let pic = cell.getChildByName('pic');
            if (this.listFirstIndex % 2 == 0) {
                pic.skin = 'UI_new/GameStart/icon_box01_open.png';
            }
            else {
                pic.skin = 'UI_new/GameStart/icon_box02_open.png';
            }
            let lock = pic.getChildByName('lock');
            if (this.listFirstIndex > lwg.Global._gameLevel) {
                lock.visible = true;
            }
            else {
                lock.visible = false;
            }
        }
        customsListUp() {
        }
        lwgDisable() {
            ADManager.CloseBanner();
            Laya.MouseManager.multiTouchEnabled = false;
        }
    }

    class UIStart_House extends lwg.Admin.Object {
        constructor() { super(); }
        lwgInit() {
        }
        onDisable() {
        }
    }

    class RotateSelfPro extends Laya.Script {
        constructor() {
            super(...arguments);
            this.speed = 2;
            this.targetSpeed = 2;
            this.reducespeed = 0;
            this.degree = 0;
            this.start = 0;
            this.lastzhizhen = 0;
            this.TargetAngle = 0;
            this.TargetTurn = 0;
            this.IsLeft = true;
            this.RoteCut = 1;
            this.RoteSpeed = 2;
        }
        onAwake() {
            this.zhuanpanParent = this.owner;
            this.ZhunpanBg = this.zhuanpanParent.getChildByName("ZhunpanBG");
            this.zhizhen = this.zhuanpanParent.getChildByName("ZhiZhen");
            this.zhizhen.rotation = 0;
            this.speed = 0.02;
            this.lastzhizhen = -1;
        }
        OpenZhiZhen() {
            Laya.timer.loop(1, this, this.FixedUpdate);
        }
        AddSpeed() {
            this.speed = 0;
            this.reducespeed = 0;
            this.RoteSpeed = 3;
            console.log("添加转速");
            let a = this.ZhunpanBg.rotation;
            console.log("初始角度" + a);
            a = a % 360;
            console.log("初始角度" + a);
            if (a > 60) {
                a -= 360;
            }
            this.TargetTurn = 0;
            this.startStop = false;
            this.ZhunpanBg.rotation = a;
            console.log(this.ZhunpanBg.rotation);
            this.reducespeed = 0;
            Laya.timer.loop(1, this, this.SpeedUp);
            Laya.timer.loop(1, this, this.ZhiZhenMove);
        }
        StopSpeed(_degree, _action) {
            console.log("转盘停止 开始减速" + _degree);
            Laya.timer.clear(this, this.SpeedUp);
            this.degree = _degree;
            this.degree %= 360;
            this.action = _action;
            this.reducespeed = 0.2;
            this.RoteSpeed = 1;
            console.log("转盘停止2 目标角度", this.degree);
        }
        FixedUpdate() {
            if (this.startStop) {
                return;
            }
            if (this.speed > 4) {
                this.speed -= this.reducespeed;
            }
            this.ZhunpanBg.rotation += this.speed;
            if (this.ZhunpanBg.rotation > 360) {
                this.ZhunpanBg.rotation %= 360;
                this.TargetTurn++;
                if (this.TargetTurn > 3) {
                    let a = this.ZhunpanBg.rotation;
                    let b = this.degree;
                    let c = Math.abs((a - b) / 360);
                    Laya.timer.clear(this, this.ZhiZhenMove);
                    Laya.timer.loop(1, this, this.ZhizhenStop);
                    Laya.Tween.to(this.ZhunpanBg, { rotation: this.degree }, c * 2500, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                        this.action();
                    }));
                    this.startStop = true;
                }
            }
            if (this.lastzhizhen != Math.ceil((this.ZhunpanBg.rotation + 30) / 60)) {
                this.lastzhizhen = (Math.ceil((this.ZhunpanBg.rotation + 30) / 60));
            }
        }
        onStart() {
        }
        SpeedDown() {
        }
        SpeedUp() {
            this.speed += 0.5;
            if (this.speed >= 8) {
                Laya.timer.clear(this, this.SpeedUp);
            }
        }
        ZhizhenStop() {
            if (this.zhizhen.rotation < 0) {
                this.zhizhen.rotation += 0.2;
            }
            else {
                Laya.timer.clearAll(this);
                console.log("消除所有");
            }
        }
        ZhiZhenMove() {
            if (this.IsLeft) {
                this.zhizhen.rotation -= this.RoteSpeed;
                if (this.zhizhen.rotation <= -12) {
                    this.IsLeft = !this.IsLeft;
                }
            }
            else {
                this.zhizhen.rotation += this.RoteSpeed;
                if (this.zhizhen.rotation >= 1) {
                    this.IsLeft = !this.IsLeft;
                }
            }
        }
    }

    class ZhuanPan extends Laya.Script {
        constructor() {
            super(...arguments);
            this.lotteryProps = [];
            this.firstUseed = "1";
            this.lotteryGift = LotteryGift.prop1;
            this.lotteryNum = 0;
            this.lotteryindex = 0;
            this.mouseDwon = false;
            this.mouseMove = false;
        }
        onAwake() {
            ADManager.CloseBanner();
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_turn');
            lwg.Global._stageClick = false;
            this.Zhuanpan = this.owner;
            this.zhuanpanParent = this.Zhuanpan.getChildByName("zhuanpanParent");
            this.RewardPanel = this.Zhuanpan.getChildByName("RewardPanel");
            this.StartBtn = this.Zhuanpan.getChildByName("StartBtn");
            this.ZhuanpanBG = this.zhuanpanParent.getChildByName("ZhunpanBG");
            this.ZhuanpanZhizhen = this.zhuanpanParent.getChildByName("ZhiZhen");
            this.BG = this.ZhuanpanBG.getChildByName("BG");
            for (let index = 0; index < this.BG.numChildren; index++) {
                this.lotteryProps.push(this.BG.getChildByName('prop' + (index + 1)));
            }
            this.RewardPanelInit();
            this._rotateSelfPro = this.zhuanpanParent.getComponent(RotateSelfPro);
            this._rotateSelfPro.OpenZhiZhen();
            this.StartBtn.on(Laya.Event.CLICK, this, this.ZhunapanStart);
            this.CaiDanMoveInit();
            this.First = this.StartBtn.getChildByName("First");
            this.Second = this.StartBtn.getChildByName("Second");
            this.RefreshBtn();
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.owner.scene['BtnBack'], this, null, null, this.btnCloseUp, null);
        }
        btnCloseUp(e) {
            e.currentTarget.scale(1, 1);
            this.owner.scene.close();
        }
        RefreshBtn() {
            this.firstUseed = Laya.LocalStorage.getItem("firstUseed");
            if (this.firstUseed) {
                if (this.firstUseed == "0") {
                    this.First.visible = true;
                    this.Second.visible = false;
                }
                else {
                    this.First.visible = false;
                    this.Second.visible = true;
                }
            }
            else {
                this.First.visible = true;
                this.Second.visible = false;
                Laya.LocalStorage.setItem("firstUseed", "0");
            }
        }
        ZhunapanStart() {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_turn');
            console.log("点击转盘");
            if (this.First.visible) {
                Laya.LocalStorage.setItem("firstUseed", "1");
                this.StartLottery();
                this.StartBtn.visible = false;
            }
            else {
                ADManager.ShowReward(() => {
                    this.StartLottery();
                    this.StartBtn.visible = false;
                });
            }
        }
        StartLottery() {
            this._rotateSelfPro.AddSpeed();
            this._rotateSelfPro.OpenZhiZhen();
            Laya.timer.once(1500, this, this.StopLottery);
        }
        StopLottery() {
            this.lotteryNum++;
            console.log("转盘停止");
            let ran = this.randomInRange_i(0, 100);
            if (ran >= 0 && ran < 20) {
                this.lotteryGift = 0;
            }
            else if (ran >= 20 && ran < 40) {
                if (lwg.Global._zibiyazi || this.lotteryNum === 1) {
                    this.lotteryGift = 2;
                }
                else {
                    this.lotteryGift = 1;
                    lwg.Global._zibiyazi = true;
                }
            }
            else if (ran >= 40 && ran < 60) {
                this.lotteryGift = 2;
            }
            else if (ran >= 60 && ran < 80) {
                this.lotteryGift = 3;
            }
            else if (ran >= 80 && ran < 100) {
                this.lotteryGift = 5;
            }
            let degree = 60 * this.lotteryGift + this.randomInRange_i(25, 35);
            this._rotateSelfPro.StopSpeed(degree, () => {
                this.lotteryindex = this.lotteryGift;
                switch (this.lotteryGift) {
                    case 0:
                        lwg.Global._addExecution(3);
                        break;
                    case 1:
                        lwg.Global._paintedPifu.push[RewardDec.prop2];
                        lwg.Global._createHint_01(lwg.Enum.HintType.zibiyazi);
                        break;
                    case 2:
                        lwg.Global._addGold(30);
                        break;
                    case 3:
                        lwg.Global._addExecution(2);
                        break;
                    case 4:
                        break;
                    case 5:
                        lwg.Global._addGold(60);
                        break;
                }
                console.log("获取礼物", this.lotteryGift + 1);
                Laya.timer.once(500, this, this.ShowReward);
            });
        }
        RewardPanelInit() {
            let BtnADAgain = this.RewardPanel.getChildByName("BtnADAgain");
            let BtnNo = this.RewardPanel.getChildByName("BtnNo");
            console.log(BtnNo);
            lwg.Click.on(lwg.Click.ClickType.largen, null, BtnADAgain, this, null, null, this.btnADAgainUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, BtnNo, this, null, null, this.btnNoUp, null);
        }
        btnADAgainUp() {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_turngift');
            ADManager.ShowReward(() => {
                this.ClosePanel();
                this.StartLottery();
                this.StartBtn.visible = false;
            });
        }
        btnNoUp(e) {
            this.ClosePanel();
        }
        ShowReward() {
            ADManager.TAPoint(TaT.PageEnter, 'turngiftpage');
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_turngift');
            this.RewardPanel.x = 0;
            this.RewardPanel.y = 0;
            this.RefreshBtn();
            this.StartBtn.visible = true;
            let prop = this.RewardPanel.getChildByName('Prop');
            let pic = prop.getChildByName('Pic');
            pic.skin = RewardSkin['prop' + (this.lotteryindex + 1)];
            let dec = prop.getChildByName('Dec');
            dec.text = RewardDec['prop' + (this.lotteryindex + 1)];
            if (this.lotteryindex + 1 === 2 || this.lotteryindex + 1 === 5) {
                pic.scale(0.5, 0.5);
                pic.x = -35;
                pic.y = -53;
            }
            else {
                if (this.lotteryindex + 1 === 1 || this.lotteryindex + 1 === 4) {
                    pic.x = 12.5;
                    pic.y = 26;
                }
                else if (this.lotteryindex + 1 === 3 || this.lotteryindex + 1 === 6) {
                    pic.x = 12.5;
                    pic.y = 26;
                }
                pic.scale(1, 1);
            }
        }
        ClosePanel() {
            ADManager.TAPoint(TaT.PageLeave, 'turngiftpage');
            this.RewardPanel.x = 1500;
            this.RewardPanel.y = 0;
        }
        CaiDanMoveInit() {
            lwg.Click.on(lwg.Click.ClickType.noEffect, null, this.owner.scene['Caidan'], this, this.caidanDwon, null, null, null);
            let BtnNo = this.owner.scene['Painted_Pikaqiu'].getChildByName('BtnNo');
            let BtnFreeGet = this.owner.scene['Painted_Pikaqiu'].getChildByName('BtnFreeGet');
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_dragongift');
            lwg.Click.on(lwg.Click.ClickType.largen, null, BtnNo, this, null, null, this.btnNoUp_P, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, BtnFreeGet, this, null, null, this.btnFreeGetUp_P, null);
        }
        btnNoUp_P(e) {
            ADManager.TAPoint(TaT.PageLeave, 'PKskinQpage');
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_PKskin');
            e.currentTarget.scale(1, 1);
            this.owner.scene['Painted_Pikaqiu'].x = 1500;
            this.owner.scene['Painted_Pikaqiu'].y = 0;
        }
        btnFreeGetUp_P(e) {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_PKskin');
            e.currentTarget.scale(1, 1);
            ADManager.ShowReward(() => {
                lwg.Global._huangpihaozi = true;
                lwg.LocalStorage.addData();
                this.owner.scene['Painted_Pikaqiu'].x = 1500;
                this.owner.scene['Painted_Pikaqiu'].y = 0;
                lwg.Global._paintedPifu.push[RewardDec.prop5];
                lwg.Global._createHint_01(lwg.Enum.HintType.huangpihaozi);
            });
        }
        caidanDwon() {
            if (!lwg.Global._huangpihaozi) {
                this.mouseDwon = true;
            }
            else {
                console.log('已经获得了黄皮耗子皮肤！');
            }
        }
        onStageMouseMove(e) {
            if (this.mouseDwon) {
                this.mouseMove = true;
                this.owner.scene.addChild(this.owner.scene['Caidan']);
                this.owner.scene['Caidan'].x = e.stageX;
                this.owner.scene['Caidan'].y = e.stageY;
            }
        }
        onStageMouseUp(e) {
            if (this.mouseMove) {
                this.owner.scene['CaidanParent'].addChild(this.owner.scene['Caidan']);
                this.owner.scene['Caidan'].x = 472;
                this.owner.scene['Caidan'].y = 301;
                this.mouseDwon = false;
                this.mouseMove = false;
                let point = new Laya.Point(e.stageX, e.stageY);
                let dis = point.distance(this.owner.scene['ZhunpanBG'].x, this.owner.scene['ZhunpanBG'].y);
                if (dis - this.owner.scene['ZhunpanBG'].width / 2 > 0) {
                    ADManager.TAPoint(TaT.PageEnter, 'PKskinQpage');
                    this.owner.scene['Painted_Pikaqiu'].x = 0;
                    this.owner.scene['Painted_Pikaqiu'].y = 0;
                }
            }
        }
        randomInRange_i(x, y, s = null) {
            let rs;
            if (x == y) {
                rs = x;
            }
            else if (y > x) {
                let v = (y - x) * (s == null ? Math.random() : s) + x;
                rs = v.toFixed();
            }
            else {
                throw `x > y`;
            }
            return Number(rs);
        }
        onDisable() {
            lwg.Global._stageClick = true;
            ADManager.ShowBanner();
        }
    }
    var LotteryGift;
    (function (LotteryGift) {
        LotteryGift[LotteryGift["prop1"] = 0] = "prop1";
        LotteryGift[LotteryGift["prop2"] = 1] = "prop2";
        LotteryGift[LotteryGift["prop3"] = 2] = "prop3";
        LotteryGift[LotteryGift["prop4"] = 3] = "prop4";
        LotteryGift[LotteryGift["prop5"] = 4] = "prop5";
        LotteryGift[LotteryGift["prop6"] = 5] = "prop6";
    })(LotteryGift || (LotteryGift = {}));
    var RewardDec;
    (function (RewardDec) {
        RewardDec["prop1"] = "\u4F53\u529Bx3";
        RewardDec["prop2"] = "\u81EA\u95ED\u9E2D\u5B50";
        RewardDec["prop3"] = "\u91D1\u5E01x30";
        RewardDec["prop4"] = "\u4F53\u529Bx2";
        RewardDec["prop5"] = "\u9EC4\u76AE\u8017\u5B50";
        RewardDec["prop6"] = "\u91D1\u5E01x60";
    })(RewardDec || (RewardDec = {}));
    var RewardSkin;
    (function (RewardSkin) {
        RewardSkin["prop1"] = "UI_new/conmmon/icon_execution_big.png";
        RewardSkin["prop2"] = "CaiDanQIang/Skin/1.png";
        RewardSkin["prop3"] = "UI_new/conmmon/icon_gold_big.png";
        RewardSkin["prop4"] = "UI_new/conmmon/icon_execution_big.png";
        RewardSkin["prop5"] = "CaiDanQIang/Skin/0.png";
        RewardSkin["prop6"] = "UI_new/conmmon/icon_gold_big.png";
    })(RewardSkin || (RewardSkin = {}));

    class UIVictory extends lwg.Admin.Scene {
        constructor() { super(); }
        lwgInit() {
            ADManager.ShowNormal();
            RecordManager.stopAutoRecord();
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_success');
            ADManager.TAPoint(TaT.BtnShow, 'Share_success');
            ADManager.TAPoint(TaT.BtnShow, 'nextword_success');
            ADManager.TAPoint(TaT.BtnShow, 'ADticketbt_success');
            this.BtnGoldAdv = this.self['BtnGoldAdv'];
            this.BtnExAdv = this.self['BtnExAdv'];
            this.GetGold = this.self['GetGold'];
            this.LvNum = this.self['LvNum'];
            this.LvNum.value = lwg.Global._gameLevel.toString();
            this.BtnNext = this.self['BtnNext'];
            this.getGoldDisplay();
            this.LvNumDisplay();
            lwg.PalyAudio.playSound(lwg.Enum.voiceUrl.victory, 1);
            if (lwg.Global._hotShare && lwg.Global._gameLevel !== 1) {
                lwg.Admin._openScene(lwg.Admin.SceneName.UIShare, null, null, null);
            }
            if (!lwg.Global._elect) {
                this.self['P201_01'].removeSelf();
                this.self['P201_02'].removeSelf();
            }
            if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                lwg.Global._gameLevel++;
                lwg.LocalStorage.addData();
            }
        }
        adaptive() {
            this.self['sceneContent'].y = Laya.stage.height / 2;
        }
        openAni() {
            lwg.Effects.createFireworks(this.self['sceneContent'], 30, 430, 40);
            lwg.Effects.createFireworks(this.self['sceneContent'], 30, 109, 49.5);
            lwg.Effects.createLeftOrRightJet(this.self['sceneContent'], 'right', 30, 582, 141.5);
            lwg.Effects.createLeftOrRightJet(this.self['sceneContent'], 'left', 30, -21.5, 141.5);
            this.BtnNext.visible = false;
            setTimeout(() => {
                this.BtnNext.visible = true;
            }, lwg.Global._btnDelayed);
            this.self['BtnBack'].visible = false;
            return 0;
        }
        getGoldAni(number, thisFunc) {
            let x = this.self['GetGold'].x + this.self['sceneContent'].x - this.self['sceneContent'].width / 2;
            let y = this.self['GetGold'].y + this.self['sceneContent'].y - this.self['sceneContent'].height / 2;
            for (let index = 0; index < number; index++) {
                lwg.Effects.createAddGold(Laya.stage, index, x, y, lwg.Global.GoldNumNode.x - 53, lwg.Global.GoldNumNode.y - 12, f => {
                    let Num = lwg.Global.GoldNumNode.getChildByName('Num');
                    Num.value = (Number(Num.value) + 1).toString();
                    let goldNum = this.self['GoldNum'];
                    goldNum.value = 'x' + (number - index - 2);
                    if (index === number - 1) {
                        if (thisFunc !== null) {
                            thisFunc();
                        }
                    }
                });
            }
        }
        getGoldDisplay() {
            let goldNum = this.GetGold.getChildByName('GoldNum');
            goldNum.value = 'x' + 25;
            lwg.Global._goldNum += 25;
            lwg.LocalStorage.addData();
        }
        LvNumDisplay() {
            if (lwg.Admin.openLevelNum >= lwg.Global._gameLevel) {
                this.LvNum.value = lwg.Global._gameLevel.toString();
            }
            else {
                this.LvNum.value = lwg.Admin.openLevelNum.toString();
            }
        }
        btnOnClick() {
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnGoldAdv, this, null, null, this.btnGoldAdvUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnNext, this, null, null, this.btnNextUp, null);
            lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
        }
        btnOffClick() {
            lwg.Click.off(lwg.Click.ClickType.largen, this.BtnNext, this, null, null, this.btnNextUp, null);
            lwg.Click.off(lwg.Click.ClickType.largen, this.BtnGoldAdv, this, null, null, this.btnGoldAdvUp, null);
            lwg.Click.off(lwg.Click.ClickType.largen, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
        }
        btnNextUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'nextword_success');
            event.currentTarget.scale(1, 1);
            this.btnOffClick();
            if (this.goldAdv_3Get) {
                this.getGoldAniFunc();
            }
            else {
                this.getGoldAni(15, f => {
                    this.getGoldAniFunc();
                    let Num = lwg.Global.GoldNumNode.getChildByName('Num');
                    Num.value = (Number(Num.value) + 10).toString();
                    Num.value = lwg.Global._goldNum.toString();
                });
            }
        }
        getGoldAniFunc() {
            lwg.Admin._closeCustomScene();
            if (lwg.Global._watchAdsNum < 3) {
                lwg.Admin._openScene(lwg.Admin.SceneName.UIXDpifu, null, null, f => {
                    lwg.Admin._openScene(lwg.Admin.SceneName.UIStart, 1, null, f => {
                        lwg.Admin._sceneControl['UIXDpifu']['_zOrder'] = 1;
                        lwg.Admin._sceneControl['UIStart']['_zOrder'] = 0;
                    });
                });
            }
            else {
                lwg.Admin._openScene(lwg.Admin.SceneName.UIStart, 0, null, f => { });
            }
            this.self.close();
        }
        btnGoldAdvUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_success');
            event.currentTarget.scale(1, 1);
            ADManager.ShowReward(() => {
                this.btnGoldAdvUpFunc();
            });
        }
        btnGoldAdvUpFunc() {
            let btnpic = this.BtnGoldAdv.getChildByName('btnpic');
            let iconpic = this.BtnGoldAdv.getChildByName('iconpic');
            btnpic.skin = 'UI_new/Victory/rede_btn_01.png';
            iconpic.skin = 'UI_new/Victory/icon_adv_h.png';
            this.btnOffClick();
            let goldNum = this.GetGold.getChildByName('GoldNum');
            goldNum.value = 'x' + 75;
            let Num = lwg.Global.GoldNumNode.getChildByName('Num');
            Num.value = (Number(Num.value) + 60).toString();
            this.goldAdv_3Get = true;
            this.getGoldAni(15, fun => {
                lwg.Global._goldNum += 25 * 2;
                lwg.LocalStorage.addData();
                Num.value = lwg.Global._goldNum.toString();
                lwg.Click.on(lwg.Click.ClickType.largen, null, this.BtnNext, this, null, null, this.btnNextUp, null);
                lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnBack'], this, null, null, this.btnBackUp, null);
                lwg.Click.on(lwg.Click.ClickType.largen, null, this.self['BtnShare'], this, null, null, this.btnShareUp, null);
                goldNum.value = 'x' + 0;
            });
        }
        btnBackUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'ADticketbt_success');
            event.currentTarget.scale(1, 1);
            this.btnOffClick();
            if (this.goldAdv_3Get) {
                this.btnBackUpFunc();
            }
            else {
                this.getGoldAni(15, f => {
                    this.btnBackUpFunc();
                    let Num = lwg.Global.GoldNumNode.getChildByName('Num');
                    Num.value = (Number(Num.value) + 10).toString();
                    Num.value = lwg.Global._goldNum.toString();
                });
            }
        }
        btnBackUpFunc() {
            lwg.Admin._openScene('UIStart', null, null, null);
            lwg.Admin._closeCustomScene();
            lwg.LocalStorage.addData();
            this.self.close();
            lwg.LocalStorage.addData();
        }
        btnShareUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'Share_success');
            event.currentTarget.scale(1, 1);
            RecordManager._share('noAward', () => {
                this.btnShareUpFunc();
            });
        }
        btnShareUpFunc() {
            console.log('分享成功，只是没有奖励！');
        }
        lwgDisable() {
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
        }
    }

    class UIVictoryBox_Cell extends lwg.Admin.Object {
        constructor() {
            super();
            this.byGet = false;
        }
        lwgInit() {
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbox_box');
            this.posArr = [
                [129.5, 254], [295, 254], [458.5, 254],
                [129.5, 403.5], [295, 403.5], [458.5, 403.5],
                [129.5, 553], [295, 553], [458.5, 553],
            ];
            this.SceneContent = this.selfScene['SceneContent'];
            this.Pic_Gold = this.self.getChildByName('Pic_Gold');
            this.Num = this.self.getChildByName('Num');
            this.Pic_Box = this.self.getChildByName('Pic_Box');
            this.BoxList = this.selfScene[lwg.Admin.SceneName.UIVictoryBox].BoxList;
            this.byGet = false;
        }
        btnOnClick() {
            lwg.Click.on('largen', null, this.self, this, null, null, this.up, null);
        }
        up(e) {
            e.currentTarget.scale(1, 1);
            let getNum = this.selfScene[lwg.Admin.SceneName.UIVictoryBox].getNum;
            if (!this.byGet && getNum >= 1) {
                let url1 = 'UI_new/VictoryBox/icon_chai.png';
                if (this.Pic_Box.skin === url1) {
                    this.upFunc();
                }
                else {
                    ADManager.TAPoint(TaT.BtnClick, 'ADrewardbox_box');
                    ADManager.ShowReward(() => {
                        this.upFunc();
                    });
                }
            }
            else {
                lwg.Global._createHint_01(lwg.Enum.HintType.watchAdv);
            }
        }
        upFunc() {
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
                });
            });
            this.byGet = true;
        }
        lwgDisable() {
        }
    }

    class UIVictoryBox extends lwg.Admin.Scene {
        constructor() {
            super();
            this.getNum = 3;
            this.ranArray = [];
            this.maxAdvGet = 6;
            this.maxGetNum = 0;
        }
        selfVars() {
            this.BoxList = this.self['BoxList'];
        }
        lwgInit() {
            lwg.Global._victoryBoxNum++;
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_box');
            this.randomAdvBox();
            this.createBoxList();
            this.self['BtnAgain'].visible = false;
            this.self['BtnNo'].visible = false;
        }
        adaptive() {
            this.self['SceneContent'].y = Laya.stage.height / 2;
        }
        randomAdvBox() {
            let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            let ran1 = Math.floor(Math.random() * (arr.length - 1));
            let a1 = arr[ran1];
            arr.splice(ran1, 1);
            console.log('1', arr);
            let ran2 = Math.floor(Math.random() * (arr.length - 1));
            let a2 = arr[ran2];
            arr.splice(ran2, 1);
            console.log('2', arr);
            let ran3 = Math.floor(Math.random() * (arr.length - 1));
            let a3 = arr[ran3];
            this.ranArray = [a1, a2, a3];
        }
        createBoxList() {
            this.BoxList.spaceX = 36;
            this.BoxList.spaceY = 20;
            this.BoxList.selectHandler = new Laya.Handler(this, this.onSelect_List);
            this.BoxList.renderHandler = new Laya.Handler(this, this.updateItem);
            this.refreshListData();
            this.listOpenAni();
        }
        listOpenAni() {
        }
        refreshListData() {
            var data = [];
            for (var m = 0; m < 9; m++) {
                let pic_Gold = false;
                let num = Math.floor(Math.random() * 10) + 5;
                let pic_Box = true;
                let index = m.toString();
                let adv = false;
                if (lwg.Global._victoryBoxNum !== 1) {
                    for (let index = 0; index < this.ranArray.length; index++) {
                        if (m === this.ranArray[index]) {
                            adv = true;
                            break;
                        }
                    }
                }
                data.push({
                    pic_Gold,
                    num,
                    pic_Box,
                    index,
                    adv
                });
            }
            this.BoxList.array = data;
        }
        onSelect_List(index) {
        }
        updateItem(cell, index) {
            let dataSource = cell.dataSource;
            let Pic_Gold = cell.getChildByName('Pic_Gold');
            Pic_Gold.visible = dataSource.pic_Gold;
            let Num = cell.getChildByName('Num');
            Num.text = dataSource.num;
            Num.visible = Pic_Gold.visible;
            let Pic_Box = cell.getChildByName('Pic_Box');
            Pic_Box.visible = dataSource.pic_Box;
            if (dataSource.adv) {
                Pic_Box.skin = 'UI_new/VictoryBox/icon_advbox.png';
            }
            else {
                Pic_Box.skin = 'UI_new/VictoryBox/icon_chai.png';
            }
            cell.name = dataSource.index;
        }
        btnOnClick() {
            lwg.Click.on('largen', null, this.self['BtnNo'], this, null, null, this.btnNoUp, null);
            lwg.Click.on('largen', null, this.self['BtnAgain'], this, null, null, this.btnAgainUp, null);
        }
        btnOffClick() {
            lwg.Click.off('largen', this.self['BtnNo'], this, null, null, this.btnNoUp, null);
            lwg.Click.off('largen', this.self['BtnAgain'], this, null, null, this.btnAgainUp, null);
        }
        btnNoUp(event) {
            event.currentTarget.scale(1, 1);
            lwg.Admin._openScene(lwg.Admin.SceneName.UIVictory, null, null, null);
            this.self.close();
        }
        btnAgainUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_box');
            event.currentTarget.scale(1, 1);
            if (this.maxGetNum < 9) {
                if (this.maxAdvGet <= 0) {
                    lwg.Global._createHint_01(lwg.Enum.HintType.noGetNum);
                }
                else {
                    ADManager.ShowReward(() => {
                        lwg.Global._createHint_01(lwg.Enum.HintType.getBoxOne);
                        this.getNum += 3;
                        this.maxAdvGet -= 3;
                        this.self['BtnAgain'].visible = false;
                        this.self['BtnNo'].visible = false;
                    });
                }
            }
            else {
                lwg.Global._createHint_01(lwg.Enum.HintType["没有宝箱领可以领了！"]);
            }
        }
        lwgOnUpdta() {
            if (this.getNum > 0) {
                this.self['BtnAgain'].visible = false;
                this.self['BtnNo'].visible = false;
            }
            else {
                this.self['BtnAgain'].visible = true;
                this.self['BtnNo'].visible = true;
            }
        }
        lwgDisable() {
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
        }
    }

    class UIXDpifu extends lwg.Admin.Scene {
        constructor() { super(); }
        selfVars() {
            this.BtnBack = this.self['BtnBack'];
            this.BtnGet = this.self['BtnGet'];
            this.SceneContent = this.self['SceneContent'];
            this.background = this.self['background'];
            this.logo = this.self['logo'];
        }
        lwgInit() {
            lwg.Global._openXD = true;
            lwg.Global.GoldNumNode.alpha = 0;
            lwg.Global.ExecutionNumNode.alpha = 0;
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_limitskin');
            ADManager.TAPoint(TaT.BtnShow, 'close_limitskin');
            this.btnGetNum();
        }
        adaptive() {
            this.SceneContent.y = Laya.stage.height * 0.528;
            this.self['background_01'].height = Laya.stage.height;
        }
        openAniFunc() {
        }
        btnGetNum() {
            let num = this.BtnGet.getChildByName('Num');
            num.text = '(' + lwg.Global._watchAdsNum + '/' + 3 + ')';
        }
        btnOnClick() {
            lwg.Click.on('largen', null, this.BtnBack, this, null, null, this.btnBackUp, null);
            lwg.Click.on('largen', null, this.BtnGet, this, null, null, this.btnGetUp, null);
        }
        btnBackUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'close_limitskin');
            event.currentTarget.scale(1, 1);
            this.self.close();
        }
        btnGetUp(event) {
            ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_limitskin');
            event.currentTarget.scale(1, 1);
            ADManager.ShowReward(() => {
                this.btnGetFunc();
            });
        }
        btnGetFunc() {
            lwg.Global._watchAdsNum += 1;
            this.btnGetNum();
            if (lwg.Global._watchAdsNum >= 3) {
                lwg.Global._havePifu.push('09_aisha');
                lwg.Global._currentPifu = lwg.Enum.PifuAllName[8];
                this.self.close();
                lwg.Admin._sceneControl[lwg.Admin.SceneName.UIStart]['UIStart'].self['BtnXD'].removeSelf();
                lwg.Global._createHint_01(lwg.Enum.HintType.getXD);
            }
            lwg.LocalStorage.addData();
        }
        lwgOnUpdta() {
        }
        lwgDisable() {
            lwg.Global._openXD = false;
            lwg.Global.GoldNumNode.alpha = 1;
            lwg.Global.ExecutionNumNode.alpha = 1;
        }
    }

    class UILoding_ExecutionNumNode extends lwg.Admin.Object {
        constructor() {
            super(...arguments);
            this.time = 0;
            this.countNum = 59;
            this.timeSwitch = true;
        }
        lwgInit() {
            this.Num = this.self.getChildByName('Num');
            this.CountDown = this.self.getChildByName('CountDown');
            this.CountDown_board = this.self.getChildByName('CountDown_board');
            this.countNum = 59;
            this.CountDown.text = '00:' + this.countNum;
            this.CountDown_board.text = this.CountDown.text;
            let d = new Date;
            if (d.getDate() !== lwg.Global._addExDate) {
                lwg.Global._execution = 15;
            }
            else {
                if (d.getHours() === lwg.Global._addExHours) {
                    lwg.Global._execution += (d.getMinutes() - lwg.Global._addMinutes);
                    if (lwg.Global._execution > 15) {
                        lwg.Global._execution = 15;
                    }
                }
                else {
                    lwg.Global._execution = 15;
                }
            }
            this.Num.value = lwg.Global._execution.toString();
            lwg.Global._addExDate = d.getDate();
            lwg.Global._addExHours = d.getHours();
            lwg.Global._addMinutes = d.getMinutes();
            lwg.LocalStorage.addData();
        }
        countDownAddEx() {
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
                }
                else if (this.countNum >= 0 && this.countNum < 10) {
                    this.CountDown.text = '00:0' + this.countNum;
                    this.CountDown_board.text = this.CountDown.text;
                }
            }
        }
        lwgOnUpdate() {
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
            }
            else {
                this.timeSwitch = true;
                this.countDownAddEx();
            }
        }
        lwgDisable() {
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("TJ/Promo/script/PromoOpen.ts", PromoOpen);
            reg("TJ/Promo/script/ButtonScale.ts", ButtonScale);
            reg("TJ/Promo/script/PromoItem.ts", PromoItem);
            reg("TJ/Promo/script/P201.ts", P201);
            reg("TJ/Promo/script/P202.ts", P202);
            reg("TJ/Promo/script/P204.ts", P204);
            reg("TJ/Promo/script/P205.ts", P205);
            reg("TJ/Promo/script/P106.ts", P106);
            reg("script/Game/UIAdvertising.ts", UIAdvertising);
            reg("script/Game/UIAnchorXD.ts", UIAnchorXD);
            reg("script/Game/UICaidanPifu.ts", UICaidanPifu);
            reg("ZhuanPan/SkinItem.ts", SkinItem);
            reg("ZhuanPan/CaiDanQiang.ts", CaiDanQiang);
            reg("script/Game/UICheckIn.ts", UICheckIn);
            reg("script/Game/UIDefeated.ts", UIDefeated);
            reg("script/Game/UIExecutionHint.ts", UIExecutionHint);
            reg("script/Game/UILoding.ts", UILoding);
            reg("script/Game/UIMain.ts", UIMain);
            reg("script/Game/UIMain_Aisle.ts", UIMain_Aisle);
            reg("script/Game/UIMain_Dog.ts", Dog);
            reg("script/Game/UIMain_Rival.ts", UIMain_Rival);
            reg("script/Game/UIMain_Bonfire.ts", UIMain_Bonfire);
            reg("script/Game/UIMain_Gongzhu.ts", UIMain_Gongzhu);
            reg("script/Game/UIMain_Wangzi.ts", UIMain_Wangzi);
            reg("script/Game/UIMain_Houzi.ts", UIMain_Houzi);
            reg("script/Game/UIMain_StaticDog.ts", UIMain_StaticDog);
            reg("script/Game/UIMain_Houma.ts", UIMain_Houma);
            reg("script/Game/UIMain_Room.ts", UIMain_Room);
            reg("script/Game/UIPassHint.ts", UIPassHint);
            reg("script/Game/UIPuase.ts", UIPuase);
            reg("script/Game/UIPifu.ts", UIPifu);
            reg("script/Game/UIPifuTry.ts", UIPifuTry);
            reg("script/Game/UIRedeem.ts", UIRedeem);
            reg("script/Game/UISet.ts", UISet);
            reg("script/Game/UIShare.ts", UIShare);
            reg("script/Game/UISmallHint.ts", UISmallHint);
            reg("script/Game/UIStart.ts", UIStart);
            reg("script/Game/UIStart_House.ts", UIStart_House);
            reg("ZhuanPan/RotateSelfPro.ts", RotateSelfPro);
            reg("ZhuanPan/ZhuanPan.ts", ZhuanPan);
            reg("script/Game/UIVictory.ts", UIVictory);
            reg("script/Game/UIVictoryBox_Cell.ts", UIVictoryBox_Cell);
            reg("script/Game/UIVictoryBox.ts", UIVictoryBox);
            reg("script/Game/UIXDpifu.ts", UIXDpifu);
            reg("script/Game/UILoding_ExecutionNumNode.ts", UILoding_ExecutionNumNode);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode = "fixedauto";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Promo.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
