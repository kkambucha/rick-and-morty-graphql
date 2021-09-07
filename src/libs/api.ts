import axios from 'axios';
import get from 'lodash/get';

import {API_URL} from '../constants';

interface GetSuggestionsParams {
    name: string;
    episode: string;
}

export const getSuggestions = async (params: GetSuggestionsParams) => {
    const res = await axios({
        url: API_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
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
};