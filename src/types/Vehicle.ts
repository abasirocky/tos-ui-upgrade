export default interface Vehicle {
  Uid: number;
  Sequence: number;
  Offset: number;
  Present: boolean;
  PlannedOut: boolean;
  HandlingUid: number;
  VIN: string;
  /// <summary>
  /// Type of vehicle. Used only differentiate the rendering.
  /// E.g. CAR (generic), BIKE, SEDAN, HATCHBACK, STATIONWAGON, MINIVAN, VAN, PICKUP, SUV, TRUCK, BUS
  /// </summary>
  Type: string;
  Length: number;
  Width :number | null;
  Weight  :number | null;
  UpdateCount :number;

}
