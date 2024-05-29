export interface IProject {
  id: string;
  name: string;
  teamSize: number;
  status: string;
  dateOfStart: string;
  clientLocationId: string;
  active: boolean;
}

export interface ICreateProject {
  name: string;
  teamSize: number;
  status: string;
  dateOfStart: Date;
  clientLocationId: string;
  active: boolean;
}

export interface IClientLocation {
  id: string;
  name: string;
}
