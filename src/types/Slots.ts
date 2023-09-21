export interface SlotFeatureDictionaryInterface {
  Areas: { [area: string]: { [row: number]: { [bay: number]: mapboxgl.MapboxGeoJSONFeature } } };
}

export class SlotFeatureDictionary implements SlotFeatureDictionaryInterface {
  public Areas: {
    [area: string]: { [row: number]: { [bay: number]: mapboxgl.MapboxGeoJSONFeature } };
  } = {};

  /**
   * Returns the Mapbox feature object about a given
   * area, row and bay combination
   */
  public getFeature(
    area: string,
    bay: number | null,
    row: number | null
  ): mapboxgl.MapboxGeoJSONFeature | null {
    if (row &&
      bay &&
      this.Areas[area] &&
      this.Areas[area][row] &&
      this.Areas[area][row][bay]
    ) {
      return this.Areas[area][row][bay];
    }
    return null;
  }

  /**
   * Returns all the slot features of an entire area
   * @param area Area code
   */
  public getAreaFeatures(area: string): mapboxgl.MapboxGeoJSONFeature[] {
    const features: mapboxgl.MapboxGeoJSONFeature[] = [];
    if (this.Areas[area]) {
      for (const iRow in this.Areas[area]) {
        const row = this.Areas[area][iRow];
        for (const iCol in row) {
          features.push(row[iCol]);
        }
      }
    }
    return features;
  }

  /**
   * Returns all the slot features of an entire row within an area
   * @param area Area code
   * @param row Row number
   */
  public getRowFeatures(area: string, row: number): mapboxgl.MapboxGeoJSONFeature[] {
    const features: mapboxgl.MapboxGeoJSONFeature[] = [];
    if (this.Areas[area] && this.Areas[area][row] ) {
        for (const iCol in this.Areas[area][row]) {
          features.push( this.Areas[area][row][iCol]);
        }   
    }
    return features;
  }

  /**
   * Returns all the slot features of an entire bay within an area
   * @param area Area code
   * @param row Bay number
   */  
  public getBayFeatures(area: string, bay:number): mapboxgl.MapboxGeoJSONFeature[] {
    const features: mapboxgl.MapboxGeoJSONFeature[] = [];
    if (this.Areas[area]) {
      for (const iRow in this.Areas[area]) {
        const row = this.Areas[area][iRow];
        features.push(row[bay]);
      }
    }
    return features;
  }

  /**
   * Insert a feature into the dictionary
   * @param area 
   * @param row 
   * @param bay 
   * @param feature 
   */
  public insert(
    area: string,
    row: number,
    bay: number,
    feature: mapboxgl.MapboxGeoJSONFeature
  ) {
    if (!this.Areas[area] || !this.Areas[area][row]) {
      this.SetRow(area, row);
    }
    this.Areas[area][row][bay] = feature;
  }

  private SetArea(area: string) {
    if (!this.Areas[area]) {
      this.Areas[area] = {};
    }
  }
  
  private SetRow(area: string, row: number) {
    if (!this.Areas[area]) {
      this.SetArea(area);
    }

    if (!this.Areas[area][row]) {
      this.Areas[area][row] = {};
    }
  }
}
