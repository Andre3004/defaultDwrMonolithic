import {Component, EventEmitter, forwardRef, HostListener, Input, OnInit, Output} from "@angular/core";
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator} from "@angular/forms";

/**
 * Overrited from https://github.com/pleerock/ng2-rating
 */

@Component({
    selector: "rating-component",
    templateUrl: "rating.component.html",
    styleUrls: ["./rating.component.css"],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RatingComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => RatingComponent), multi: true },
    ],
})
export class RatingComponent implements OnInit, ControlValueAccessor, Validator {

    // -------------------------------------------------------------------------
    // Inputs
    // -------------------------------------------------------------------------

    @Input()
    iconClass = "star-icon";

    @Input()
    fullIcon = "★";

    @Input()
    emptyIcon = "☆";

    @Input()
    readonly: boolean;

    @Input()
    disabled: boolean;

    @Input()
    required: boolean;

    @Input()
    float: boolean;

    @Input()
    titles: string[] = [];

    // -------------------------------------------------------------------------
    // Input Accessors
    // -------------------------------------------------------------------------

    @Input()
    set max(max: number) {
        this._max = max;
        this.buildRanges();
    }

    get max() {
        return this._max;
    }

    // -------------------------------------------------------------------------
    // Outputs
    // -------------------------------------------------------------------------

    @Output()
    onHover = new EventEmitter();

    @Output()
    onLeave = new EventEmitter();

    // -------------------------------------------------------------------------
    // Public properties
    // -------------------------------------------------------------------------

    model: number;
    ratingRange: number[];
    hovered: number = 0;
    hoveredPercent: number = undefined;

    // -------------------------------------------------------------------------
    // public Properties
    // -------------------------------------------------------------------------

    public _max: number = 5;
    public onChange: (m: any) => void;
    public onTouched: (m: any) => void;

    // -------------------------------------------------------------------------
    // Implemented from ControlValueAccessor
    // -------------------------------------------------------------------------

    writeValue(value: number): void {
        /*if (value % 1 !== value) {
         this.model = Math.round(value);
         return;
         }*/

        this.model = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // -------------------------------------------------------------------------
    // Implemented from Va..
    // -------------------------------------------------------------------------

    validate(c: AbstractControl) {
        if (this.required && !c.value) {
            return {
                required: true
            };
        }
        return null;
    }

    // -------------------------------------------------------------------------
    // Lifecycle callbacks
    // -------------------------------------------------------------------------

    ngOnInit() {
        this.buildRanges();
    }

    // -------------------------------------------------------------------------
    // Host Bindings
    // -------------------------------------------------------------------------

    @HostListener("keydown", ["$event"])
    onKeydown(event: KeyboardEvent): void {
        if ([37, 38, 39, 40].indexOf(event.which) === -1 || this.hovered)
            return;

        event.preventDefault();
        event.stopPropagation();
        const increment = this.float ? 0.5 : 1;
        this.rate(this.model + (event.which === 38 || event.which === 39 ? increment : increment * -1));
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    calculateWidth(item: number) {
        if (this.hovered > 0) {
            if (this.hoveredPercent !== undefined && this.hovered === item)
                return this.hoveredPercent;

            return this.hovered >= item ? 100 : 0;
        }
        return this.model >= item ? 100 : 100 - Math.round((item - this.model) * 10) * 10;
    }

    setHovered(hovered: number): void {
        if (!this.readonly && !this.disabled) {
            this.hovered = hovered;
            this.onHover.emit(hovered);
        }
    }

    changeHovered(event: MouseEvent): void {
        if (!this.float) return;
        const target = event.target as HTMLElement;
        const relativeX = event.pageX - target.offsetLeft;
        const percent = Math.round((relativeX * 100 / target.offsetWidth) / 10) * 10;
        this.hoveredPercent = percent > 50 ? 100 : 50;
    }

    resetHovered() {
        this.hovered = 0;
        this.hoveredPercent = undefined;
        this.onLeave.emit(this.hovered);
    }


    rate(value: number) {
        if (!this.readonly && !this.disabled && value >= 0 && value <= this.ratingRange.length) {
            const newValue = this.hoveredPercent ? (value - 1) + this.hoveredPercent / 100 : value;
            this.onChange(newValue);
            this.model = newValue;
        }
    }

    // -------------------------------------------------------------------------
    // public Methods
    // -------------------------------------------------------------------------

    public buildRanges() {
        this.ratingRange = this.range(1, this.max);
    }

    public range(start: number, end: number) {
        const foo: number[] = [];
        for (let i = start; i <= end; i++) {
            foo.push(i);
        }
        return foo;
    }

}
