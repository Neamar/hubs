import { Application, Container, Ticker } from "pixi.js";
import { ILevelData } from '../../data/data';
import { IScene } from '../manager';
import { City } from './city';

export class Level extends Container implements IScene {
    application: Application;
    private cities: City[] = [];
    constructor(application: Application, levelData: ILevelData) {
        super();
        this.application = application;

        // First pass to generate cities
        levelData.cities.forEach(cityData => {
            const city = new City();
            city.x = cityData.x;
            city.y = cityData.y;
            this.addChild(city);
            this.cities.push(city);
        });

        //

        Ticker.shared.add(this.update, this);
    }

    update(deltaTime: number): void {

    }
}
