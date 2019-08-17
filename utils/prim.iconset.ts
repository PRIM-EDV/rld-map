import { Iconset } from './iconset.util';
import { BehaviorSubject } from 'rxjs';

export class PrimIconset extends Iconset {
    public resourceReadyState = new BehaviorSubject<boolean>(false);

    public friend: HTMLImageElement = new Image();
    public foe: HTMLImageElement = new Image();
    public object: HTMLImageElement = new Image();
    public pinned: HTMLImageElement = new Image();
    public select: HTMLImageElement = new Image();
    public self: HTMLImageElement = new Image();
    public tracked: HTMLImageElement = new Image();
    public tech: HTMLImageElement = new Image();
    public medic: HTMLImageElement = new Image();
    public science: HTMLImageElement = new Image();

    public objectSubtype: Array<HTMLImageElement> = [];
    public unitSizeFriend: Array<HTMLImageElement> = [];
    public woundedFriend: Array<HTMLImageElement> = [];


    private _nbIconsReady = 0;

    constructor() {
        super();

        this.friend.onload = this._onIconLoad.bind(this);
        this.friend.src = 'assets/icons/friend.svg';

        this.foe.onload = this._onIconLoad.bind(this);
        this.foe.src = 'assets/icons/foe.svg';

        this.object.onload = this._onIconLoad.bind(this);
        this.object.src = 'assets/icons/object.svg';

        this.select.onload = this._onIconLoad.bind(this);
        this.select.src = 'assets/imgs/corners.png';

        this.self.onload = this._onIconLoad.bind(this);
        this.self.src = 'assets/icons/self.svg';

        this.tech.onload = this._onIconLoad.bind(this);
        this.tech.src = 'assets/icons/tech.png';

        this.medic.onload = this._onIconLoad.bind(this);
        this.medic.src = 'assets/icons/medic.png';

        this.science.onload = this._onIconLoad.bind(this);
        this.science.src = 'assets/icons/science.png';
        
        this.tracked.onload = this._onIconLoad.bind(this);
        this.tracked.src = 'assets/icons/tracked.png';

        this.pinned.onload = this._onIconLoad.bind(this);
        this.pinned.src = 'assets/icons/btn_pin.png';

        for (let i = 0; i < 6; i++) {
            this.objectSubtype.push(new Image());
            this.objectSubtype[this.objectSubtype.length - 1].onload = this._onIconLoad.bind(this);
            this.objectSubtype[this.objectSubtype.length - 1].src = `assets/icons/object_subtype/st${i}.png`;
        }

        for (let i = 0; i < 30; i++) {
            this.unitSizeFriend.push(new Image());
            this.unitSizeFriend[this.unitSizeFriend.length - 1].onload = this._onIconLoad.bind(this);
            this.unitSizeFriend[this.unitSizeFriend.length - 1].src = `assets/icons/unit_size/s${i + 1}.svg`;
        }

        for (let i = 0; i < 30; i++) {
            this.woundedFriend.push(new Image());
            this.woundedFriend[this.woundedFriend.length - 1].onload = this._onIconLoad.bind(this);
            this.woundedFriend[this.woundedFriend.length - 1].src = `assets/icons/casualties_size/s${i + 1}.svg`;
        }
    }

    private _onIconLoad() {
        this._nbIconsReady += 1;

        if (this._nbIconsReady >= 76) {
            this.resourceReadyState.next(true);
        }
    }
}
