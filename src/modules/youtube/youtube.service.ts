import { Injectable } from '@nestjs/common';
import { google, youtube_v3 } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  // get auth json file from root directory
  keyFile: './google-application-credentials.json',
  scopes: ['https://www.googleapis.com/auth/youtube'],
});

const DEFAULT_PART = 'snippet';
const DEFAULT_FIELD =
  'items(id,snippet(publishedAt,title,channelTitle,thumbnails),contentDetails(duration))';

@Injectable()
export class YoutubeService {
  youtube: youtube_v3.Youtube = google.youtube({
    version: 'v3',
    auth: auth,
  });

  async searchByQuery(query: string, maxResults: number) {
    const videoIdList = (
      await this.youtube.search.list({
        part: [DEFAULT_PART],
        q: query,
        fields: 'items(id)',
        maxResults,
      })
    ).data.items.map((item) => item.id.videoId);

    // 只有使用videos分類才可以取到影片時長
    return await this.youtube.videos.list({
      part: [DEFAULT_PART, 'contentDetails'],
      id: videoIdList,
      fields: DEFAULT_FIELD,
      maxResults,
    });
  }

  getInfoByVideoIds(ids: string[]) {
    return this.youtube.videos.list({
      part: [DEFAULT_PART, 'contentDetails'],
      fields: DEFAULT_FIELD,
      id: [...ids],
    });
  }
}
