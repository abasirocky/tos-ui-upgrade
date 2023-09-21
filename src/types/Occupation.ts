export class Occupation {
  public Area: string;
  public Bay: number | null;
  public Bay2: number | null;
  public Bay3: number | null;
  public ContainerLength: number;
  public MaxLayer: number;
  public Row: number;
  public slotParameters!: object;
  public isFirstOrLastPos = false;

  constructor(
    area: string,
    bay: number | null,
    bay2: number | null,
    bay3: number | null,
    ContainerLength: number,
    maxLayer: number,
    row: number
  ) {
    this.Area = area;
    this.Bay = bay;
    this.Bay2 = bay2;
    this.Bay3 = bay3;
    this.ContainerLength = ContainerLength;
    this.MaxLayer = maxLayer;
    this.Row = row;
  }
}

export interface OccupationDictionaryInterface {
  Areas: { [area: string]: { [row: number]: { [bay: number]: Occupation } } };
}

export class OccupationDictionary implements OccupationDictionaryInterface {
  public Areas: {
    [area: string]: { [row: number]: { [bay: number]: Occupation } };
  } = {};

  /**
   * Returns occupation information about a given
   * area, row and bay combination
   */
  public getOccupation(
    area: string,


    
    bay: number,
    row: number
  ): Occupation | null {
    if (
      this.Areas[area] &&
      this.Areas[area][row] &&
      this.Areas[area][row][bay]
    ) {
      return this.Areas[area][row][bay];
    }
    return null;
  }

  public SetArea(area: string) {
    if (!this.Areas[area]) {
      this.Areas[area] = {};
    }
  }

  public SetRow(area: string, row: number) {
    if (!this.Areas[area]) {
      this.SetArea(area);
    }

    if (!this.Areas[area][row]) {
      this.Areas[area][row] = {};
    }
  }

  public SetBay(
    area: string,
    row: number,
    bay: number,
    occupation: Occupation
  ) {
    if (!this.Areas[area] || !this.Areas[area][row]) {
      this.SetRow(area, row);
    }
    this.Areas[area][row][bay] = occupation;
  }
}
