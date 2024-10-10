import axios from 'axios';

const clientId: string = process.env.REACT_APP_CLIENT_ID || '';
const clientSecret: string = process.env.REACT_APP_CLIENT_SECRET || '';

export interface Track {
  track: {
    name: string;
    album: {
      images: { url: string }[];
      name: string;
    };
    artists: { name: string }[];
  };
}

export const getListeningHistory = async (accessToken: string): Promise<Track[]> => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 10, // Limit the number of recently played tracks to 10
      },
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching listening history:', error);
    return [];
  }
};
export const getTopTracks = async (accessToken: string) : Promise<Track[]> =>{
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks' ,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit:20, // minimum # of tracks allowed by api
      },
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return [];
  }
};

// Function to obtain an access token using client credentials (for server-side usage)
export const getClientAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching client access token:', error);
    return null;
  }
};

// Function to obtain a user's access token using an authorization code (for client-side usage)
export const getUserAccessToken = async (code: string): Promise<string | null> => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REACT_APP_REDIRECT_URI || '',
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios specific error with a response
      console.error('Error fetching user access token:', error.response ? error.response.data : error.message);
    } else {
      // General error handling
      console.error('Error fetching user access token:', error);
    }
    return null;
  }
};

// Function to refresh the user's access token (when using refresh tokens)
export const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
};
