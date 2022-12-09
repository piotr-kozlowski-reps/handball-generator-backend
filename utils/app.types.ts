import { type } from "os";

export type TUser = {
  userName: string;
  password: string;
  roles: number[];
  refreshToken: string;
};

export type TTeam = {
  teamName: string;
  place: string;
  teamCrestImage: string;
};

export type TBackgroundImage = {
  backgroundImageName: string;
  backgroundImage: string;
  backgroundImageThumbnail: string;
};
