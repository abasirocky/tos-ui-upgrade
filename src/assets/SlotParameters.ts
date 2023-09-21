/**
 * Object that contains all the information that is needed to
 * generate a slot or related feature.
 */
interface ISlotParameters {
  origin: any
  angleX: any
  angleY: any
  length: any
  width: any,
  multiplier: any,
  interspace: any,
  row: any,
  bay: any,
  areaCode: any
}

export default class SlotParameters {
  origin: any
  angleX: any
  angleY: any
  length: any
  width: any
  multiplier: any
  interspace: any
  row: any
  bay: any
  areaCode: any
  
  constructor(
    {origin,
    angleX,
    angleY,
    length,
    width,
    multiplier,
    interspace,
    row,
    bay,
    areaCode}: ISlotParameters
  ) {
      (this.origin = origin),
      (this.angleX = angleX),
      (this.angleY = angleY),
      (this.length = length),
      (this.width = width),
      (this.multiplier = multiplier),
      (this.interspace = interspace),
      (this.row = row),
      (this.bay = bay),
      (this.areaCode = areaCode);
  }
}
