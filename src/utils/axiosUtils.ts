import axios from "axios";

export function axiosGet(url: string) {
    return axios.get(url, { withCredentials: true });
}

export function axiosPost(url: string, data: any) {
    return axios.post(url, data, { withCredentials: true });
}