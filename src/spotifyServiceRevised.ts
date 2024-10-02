import axios from 'axios';
const clientId: string = process.env.CLIENT_ID || '';
const clientSecret: string = process.env.CLIENT_SECRET || '';

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



// Function to obtain an access token using client credentials (for server-side usage)
export const getClientAccessToken = async (clientId: string, clientSecret: string): Promise<string | null> => {
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
export const getUserAccessToken = async (code: string, redirectUri: string, clientId: string, clientSecret: string): Promise<string | null> => {
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

// Function to refresh the user's access token (when using refresh tokens)
export const refreshAccessToken = async (refreshToken: string, clientId: string, clientSecret: string): Promise<string | null> => {
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
