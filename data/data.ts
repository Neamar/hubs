
export interface ILevelCityData {
  x: number,
  y: number,
  edges?: number[]
}


export interface ILevelData {
  cities: ILevelCityData[],
}
