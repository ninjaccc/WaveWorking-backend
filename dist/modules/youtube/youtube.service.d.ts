import { youtube_v3 } from 'googleapis';
export declare class YoutubeService {
    youtube: youtube_v3.Youtube;
    searchByQuery(query: string, maxResults: number): Promise<import("gaxios").GaxiosResponse<youtube_v3.Schema$VideoListResponse>>;
    getInfoByVideoIds(ids: string[]): import("gaxios").GaxiosPromise<youtube_v3.Schema$VideoListResponse>;
}
