const episodeRegex = /([s|e][0-9]{1,2})/g

const getEpisode = (str: string): string => {
    const res = str.match(episodeRegex) || []
    return res.join('')
}

const getName = (str: string): string => {
    return str.replace(episodeRegex, '').trim() || ''
}

export interface ParseQueryStringRes {
    name: string;
    episode: string;
}

export const parseQueryString = (str: string): ParseQueryStringRes => {
    const rawStr = str.toLowerCase()
    const episode = getEpisode(rawStr)
    const name = getName(rawStr)

    return {
        name,
        episode,
    };
};
