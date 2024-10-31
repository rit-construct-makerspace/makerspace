export default interface Equipment {
  id: number;
  name: string;
  imageUrl?: string;
  sopUrl: string;
  trainingModules: any;
  numAvailable: number;
  numInUse: number;
  
}
