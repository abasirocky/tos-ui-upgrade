import { Schedule } from "../ChartApiResult";

export default class Layer {
  x: number;
  y: number;
  h: number;
  w: number;
  margin: number;
  objectType: string;
  canMove: boolean;
  selected: boolean;
  visible: boolean;
  schedule: Schedule;
  offssetY: Date;
  Id: string;
  Bottomgrip: any;
  canSelect: boolean;

  constructor(schedule: Schedule, offssetY: Date) {
    this.schedule = schedule;
    this.offssetY = offssetY;
    this.schedule.startDate;
    this.margin = 0;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.h;
  }
  get start() {
    return this.x;
  }
  get end() {
    return this.x + this.w;
  }
}
