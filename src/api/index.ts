import axios from "axios";

/**
 * An axios base client responsible for the HTTP requests.
 */
export const baseAxiosClient = () => ({
  _client: axios.create({
    baseURL: process.env.REACT_APP_MMF_BACKEND_URL,
    withCredentials: true
  }),

  _handleError(error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  },

  get(url: string) {
    return this._client.get(url).catch(this._handleError);
  },

  post(url: string, data: any) {
    return this._client.post(url, data).catch(this._handleError);
  }
});