class Car {


    //class attributes
    private image: HTMLImageElement
    private _name: string
    private _distance: number
    private _xPosition: number
    private _yPosition: number
    private color: string


    constructor(
        name: string,
        xPosition: number,
        yPosition: number,
        color: string
    ) {
        this._name = name;
        this._xPosition = xPosition;
        this._yPosition = yPosition;
        this._distance = 0;
        this.color = color;
        this.image = this.loadNewImage(`./assets/img/${color}-racing-car.png`);
        console.log(this.image);
    }

    //getters and setters
    public set distance(dist: number) {
        this._distance = dist;
    }


    public get distance(): number {
        return this._distance;
    }

    public get xPosition(): number {
        return this._xPosition;
    }

    public get yPosition(): number {
        return this._yPosition;
    }


    public get name(): string {
        return this._name;
    }

    /**
     * moves car x amount of pixels
     */
    public move(speed: number) {
        this._xPosition += speed
    }


    /**
     * draws cars
     * @param ctx 
     */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this._xPosition, this._yPosition);
    }

    /**
    * Method to load an image
    * @param {HTMLImageElement} source
    * @return HTMLImageElement - returns an image
    */
    private loadNewImage(source: string): HTMLImageElement {
        const img = new Image();
        img.src = source;
        return img;
    }
}