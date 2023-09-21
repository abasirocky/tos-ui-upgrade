declare namespace BerthManagment {
  export interface Bollard {
    id: number;
    name: string;
    distance: number;
  }

  export interface Berth {
    id: number;
    name: string;
    length: number;
    latitude: number;
    longitude: number;
    angleX: number;
    angleY: number;
    width: number;
    bollards: Bollard[];
    polygon: string;
    quayWall: number;
  }

  export interface VoyageInBerth {
    id: string;
    vesselName: string;
    voyageNoIn: string;
    voyageNoOut: string;
    startBollardId: string;
    endBollardId: string;
    loa: number;
    side: string;
    nationality: string;
    vesselType: string;
  }

  export interface VoyageInAnchorage {
    id: string;
    vesselName: string;
    voyageNoIn: string;
    voyageNoOut: string;
    loa: number;
    nationality: string;
    vesselType: string;
    marginLeft: number;
    marginReft: number;
  }

  export interface Data {
    id: string;
    name: string;
    portName: string;
    geoAnchorageLine: string;
    portUnCode: string;
    berths: Berth[];
    voyageInBerths: VoyageInBerth[];
    voyageInAnchorages: VoyageInAnchorage[];
    mapLatitude: string;
    mapLongitude: string;
    mapBearing: string;
  }

  export interface RootObject {
    data: Data;
    isSuccessful: boolean;
    message: any[];
  }
}
