import {Feature} from "@turf/turf";
import Lane from "./Lane";

export type GeometryType = "RECTANGLE" | "POLYGON" | "CIRCLE" | "POLYLINE" | "POINT" ;
export type ObjectType = "BUILDING" | "CONTAREA" |  "GATE"|  "OPENAREA"|   "RORO"|   "TANK"|  "TRACK" |  "WAREHOUSE" | "WORKZONE";
export type ObjectUsage = "BGB" | "CFS" | "CRB" | "ECD" | "GATEIN" | "GATEOUT" | "IZ" | "NONE" | "RLB" | "WH";

export default interface YardViewObject {  
    Structure: "BAY" | "NONE" | "ROW" | "LANE"
    PositionNameStructure: string | null
    AngleX: number | null
    AngleY: number | null
    PositionLength: number | null
    PositionWidth: number | null
    PositionHeight: number | null
    NumberOfRows: number | null
    NumberOfBays: number | null
    NumberOfLayers: number | null
    RowStartNumber: number | null
    BayStartNumber: number | null
    LayerStartNumber: number | null
    RowInterspace: number | null
    BayInterspace: number | null
    BayStepSize: number | null
    TEUGroundSlots: number | null
    OneTEUPositions: boolean
    TwoTEUPositions: boolean
    ThreeTEUPositions: boolean
    TwoTEUPositionStart:  string | null
    ThreeTEUPositionStart:  string | null
    AllowLessThan20ftOnOneTEU: boolean
    Allow20ftOnOneTeu: boolean
    BayPosForAbove20ftUpToAndInc30ftOnOneTEU: string
    Allow40ftOnTwoTeu: boolean
    AllowAbove40ftUpToAndInc45ftOnTwoTEU: boolean
    BayPosForAbove40ftUpToAndInc45ftOnTwoTEU: string
    BayPosForAbove45ftUpToAndInc48ftOnTwoTEU: string
    Allow45ftOnThreeTeu: boolean
    AllowAbove45ftUpToAndInc48ftOnThreeTEU: boolean
    AllowAbove48ftUpToAndInc53ftOnThreeTEU: boolean
    AllowAbove53ftUpToAndInc60ftOnThreeTEU: boolean
    AllowLessThan20ftOnNoneTEU: boolean
    Allow20ftOnNoneTEU: boolean
    AllowAbove20ftUpToAndInc30ftOnNoneTEU: boolean
    AllowAbove30ftUpToAndInc40ftOnNoneTEU: boolean
    AllowAbove40ftUpToAndInc45ftOnNoneTEU: boolean
    AllowAbove45ftUpToAndInc48ftOnNoneTEU: boolean
    AllowAbove48ftUpToAndInc53ftOnNoneTEU: boolean
    AllowAbove53ftUpToAndInc60ftOnNoneTEU: boolean
    TwoTEUPlusPositionStart: number | null
    AllowedContainerLength: number | null
    InterchangezoneFore: number | null
    InterchangezoneAft: number | null
    EquipmentClass1: string | null
    EquipmentClass2: string | null
    EquipmentClass3: string | null
    EquipmentClass4: string | null
    NumberOfTruckLanesFore: number | null
    NumberOfTruckLanesAft: number | null
    ParentUid: string | null
    Sequence: string | null
    Terminal: string | null
    GeoShape: GeometryType
    GeoNorthernBoundary:  number | null
    GeoEasternBoundary:  number | null
    GeoSouthernBoundary:  number | null
    GeoWesternBoundary:  number | null
    GeoPointLatitude:  number | null
    GeoPointLongitude:  number | null
    GeoRadius:  number | null
    GeoShapePoints: string 
    InvoiceEventCodes: string | null
    QuayDefinition: string | null
    BoundaryPositions: string | null
    UpdateCount: number
    Uid: number
    Code: string
    Description: string
    Type: ObjectType
    DedicatedUse: ObjectUsage
    FacilityCode: string
    ParentCode: string | null
    Deleted: boolean  
    Feature: Feature | null

    LaneFillPriority: null
    LaneInterspace: number | null
    LaneLength: number | null
    LaneStartNumber:number | null
    LaneWidth:number | null
    Lanes: Lane[] | null
    VehicleInterspace: number | null

}
