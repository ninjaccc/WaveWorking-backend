import { Injectable } from '@nestjs/common';
import { google, youtube_v3 } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  // get auth json file from root directory
  keyFile: './google-application-credentials.json',
  scopes: ['https://www.googleapis.com/auth/youtube'],
});

const DEFAULT_PART = 'snippet';

@Injectable()
export class YoutubeService {
  youtube: youtube_v3.Youtube = google.youtube({
    version: 'v3',
    auth: auth,
  });

  searchByQuery(query: string) {
    return this.youtube.search.list({
      part: [DEFAULT_PART],
      q: query,
    });
  }

  getInfoByVideoIds(ids: string[]) {
    return this.youtube.videos.list({
      part: [DEFAULT_PART, 'statistics'],
      fields:
        'items(id,snippet(publishedAt,channelId,title,description,channelTitle,thumbnails),statistics)',
      id: [...ids],
    });
  }
}
