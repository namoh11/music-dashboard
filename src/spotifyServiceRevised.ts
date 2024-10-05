import axios from 'axios';

const clientId: string = process.env.REACT_APP_CLIENT_ID || '';
const clientSecret: string = process.env.REACT_APP_CLIENT_SECRET || '';
const redirectUri: string = process.env.REACT_APP_REDIRECT_URI || '';

interface Track {
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

// Function to obtain a user's access token using an authorization code (for client-side usage)
export const getUserAccessToken = async (code: string): Promise<string | null> => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
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
    console.error('Error fetching user access token:', error);
    return null;
  }
};
