export interface Configuration {
  backgroundColor: string;
  pixelPerMeter: number;
  pixelPerHour: number;
  timeGridColor: string;
  bollardGridColor: string;
  cornerBoxBackgroundColor: string;
  cornerBoxForegroundColor: string;
  cornerBoxBorderThickness: number;
  cornerBoxBorderColor: string;
  timeLineBackgroundColor: string;
  timeLineForegroundColor: string;
  timeLineBorderThickness: number;
  timeLineBorderColor: string;
  timeLineStartOfDayBackgroundColor: string;
  timeLineStartOfDayForegroundColor: string;
}

export interface Berth {
  foregroundColor: string;
  backgroundColor: string;
  borderColor: string;
  borderThickness: number;
}

export interface Bollard {
  backgroundColor: string;
  borderColor: string;
  borderThickness: number;
}

export interface Setting {
  configuration: Configuration;
  berth: Berth;
  bollard: Bollard;
}

export interface Bollard2 {
  id: string;
  name: string;
  distance: number;
  code?: any;
}

export interface Berth2 {
  id?: any;
  name: string;
  code?: any;
  length: number;
  connected: boolean;
  bollards: Bollard2[];
}

export interface Vessel {
  id: string;
  name: string;
  foregroundColor: string;
  borderColor: string;
  lenght: number;
  loa: number;
  nationality: string;
  vesselType: string;
}

export interface Schedule {
  id: string;
  rowVersion: string;
  name: string;
  voyageId: string;
  conceptId?: any;
  isAllowSave: boolean;
  isPlan: boolean;
  operationTimeLocked: boolean;
  moveLocked: boolean;
  backgroundColor: string;
  foregroundColor: string;
  borderColor: string;
  borderThickness: number;
  description: string;
  startBollardId: string;
  endBollardId: string;
  startDate: string;
  endDate: string;
  voyageNoIn: string;
  voyageNoOut: string;
  side: string;
  vessel: Vessel;
  eta: string;
  etd: string;
  anchorage: string;
  berthDate: string;
  unberthDate: string;
  fullaway: string;
  ept: string;
  portTime: string;
  berthTime: string;
  voyageStatusId: string;
  voyageStatus: string;
  startBollardName: string;
  endBollardName: string;
  berthName: string;
  plannedPortTime_PPT: string;
  voyageBerthPlanId: string;
  voyageBerthPlanRowVersion: string;
  isMARKS: boolean;
  vesselCallUpdateCount: number;
  inboundHandlingUid: number;
  inboundHandlingUpdateCount: number;
  outboundHandlingUid: number;
  outboundHandlingUpdateCount: number;
}

export interface Data {
  startDate: string;
  endDate: string;
  setting: Setting;
  berths: Berth2[];
  schedules: Schedule[];
  schedule_NoneWorkingZone: any[];
}

export interface RootObject {
  data: Data;
  isSuccessful: boolean;
  tag?: any;
  message: any[];
}
