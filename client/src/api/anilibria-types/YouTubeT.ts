import { PaginationT } from "./Pagination";

export type YouTubeDataT = {
  list: Array<YouTube>;
  pagination: PaginationT;
};

export type YouTubeT = Array<YouTube>;

export type YouTube = {
  id: number;
  title: string;
  image: string;
  preview: YoutubePreviewT;
  youtube_id: string;
  comments: number;
  views: number;
  timestamp: number;
};

export type YoutubePreviewT = {
  src: string;
  thumbnail: string;
};
