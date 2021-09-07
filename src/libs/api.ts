import axios, {Canceler} from 'axios';
import get from 'lodash/get';

import {API_URL} from '../constants';

const CancelToken = axios.CancelToken
export let cancel: Canceler

interface GetSuggestionsParams {
    name: string;
    episode: string;
}

export const getSuggestions = async (params: GetSuggestionsParams) => {
    try {
        const res = await axios({
            url: API_URL,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            cancelToken: new CancelToken(function executor(c) { cancel = c }),
            data: {
                query: `
                query {
                    episodes(filter: { name: "${params.name}", episode: "${params.episode}" }) {
                        results {
                            name episode
                        }
                    }
                }
            `,
            },
        })

        return get(res, 'data.data.episodes.results', [])
    } catch(err) {
        console.log('There was a problem', err)
    }
};
