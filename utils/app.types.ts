import { Request } from "express";

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

export type TSponsorsBar = {
  barName: string;
  sponsorsBarImage: string;
};

export type TGameName = {
  gameName: string;
  gameImage: string;
};

export type TDeleteFileResponse =
  | "FILE_DELETED"
  | "FILE_UNDELETED"
  | " FILE_NOT_FOUND";

export enum IImageProcessingError {
  THUMBNAIL_CREATION_FAILURE = "THUMBNAIL_CREATION_FAILURE",
  NAME_ALREADY_IN_DATABASE = "NAME_ALREADY_IN_DATABASE",
  DATABASE_CREATION_DOCUMENT_ERROR = "DATABASE_CREATION_DOCUMENT_ERROR",
}

export type TUnprocessedImageResponse = {
  fileName: string;
  error: IImageProcessingError;
};

export type TProcessedImageFile = Express.Multer.File & {
  thumbnailPath: string;
};

export type TRequestWithFiles = Request & { file?: File; files?: File[] };
