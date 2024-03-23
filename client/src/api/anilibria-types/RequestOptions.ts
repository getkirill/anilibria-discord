export type TitleRequestOptionsT = {
  id?: number;
  code?: string;
  torrent_id?: number;
  filter?: string;
  remove?: string;
  include?: string;
  description_type?: string;
  playlist_type?: string;
};

export type TitleListRequestOptionsT = {
  id_list?: number;
  code_list?: string;
  filter?: string;
  remove?: string;
  include?: string;
  description_type?: string;
  playlist_type?: string;
};

export type TitleUpdateRequestOptionsT = {
  filter?: string;
  remove?: string;
  include?: string;
  limit?: number;
  since?: number;
  description_type?: string;
  playlist_type?: string;
  after?: number;
  page?: number;
  items_per_page?: number;
};

export type TitleChangesRequestOptionsT = {
  filter?: string;
  remove?: string;
  include?: string;
  limit?: number;
  since?: number;
  description_type?: string;
  playlist_type?: string;
  after?: number;
  page?: number;
  items_per_page?: number;
};

export type TitleScheduleRequestOptionsT = {
  filter?: string;
  remove?: string;
  include?: string;
  days?: string;
  description_type?: string;
  playlist_type?: string;
};

export type TitleRandomRequestOptionsT = {
  filter?: string;
  remove?: string;
  include?: string;
  description_type?: string;
  playlist_type?: string;
};

export type YouTubeRequestOptionsT = {
  filter?: string;
  remove?: string;
  limit?: number;
  since?: number;
  after?: number;
  page?: number;
  items_per_page?: number;
};

export type FeedRequestOptionsT = {
  filter?: string;
  remove?: string;
  include?: string;
  limit?: number;
  since?: number;
  description_type?: number;
  playlist_type?: number;
  after?: number;
};

export type TitleSearchRequestOptionsT = {
  search?: string;
  year?: string;
  season_code?: string;
  genres?: string;
  team?: string;
  voice?: string;
  type?: string;
  filter?: string;
  remove?: string;
  include?: string;
  description_type?: string;
  playlist_type?: string;
  limit?: number;
  after?: number;
  order_by?: string;
  sort_direction?: number;
  page?: number;
  items_per_page?: number;
};

export type TitleSearchAdvancedRequestOptionsT = {
  query: string;
  filter?: string;
  remove?: string;
  include?: string;
  description_type?: string;
  playlist_type?: string;
  limit?: number;
  after?: number;
  order_by?: string;
  sort_direction?: number;
  page?: number;
  items_per_page?: number;
};

export type TorrentSeed_statsRequestOptionsT = {
  users?: string;
  filter?: string;
  remove?: string;
  limit?: number;
  after?: number;
  sort_by?: string;
  order?: number;
  page?: number;
  items_per_page?: number;
};

export type TorrentRSSRequestOptionsT = {
  rss_type?: string;
  session?: string;
  limit?: number;
  since?: number;
  after?: number;
};
