import React, {ChangeEvent} from 'react';
import debounce from 'lodash/debounce';

import {QUERY_DEBOUNCE_TIME, MIN_SEARCH_QUERY_LENGTH} from '../../constants';
import {getSuggestions} from '../../libs/api';
import {parseQueryString} from '../../libs/strings';
import './Search.css';

interface SearchResult {
    name: string;
    episode: string;
}

interface SearchListProps {
    values: SearchResult[],
}

function handleSearchSuggestionClick(suggestion: SearchResult): void {
    console.log(`Click on ${suggestion.name} | ${suggestion.episode}`)
}

function SearchList({values = []}: SearchListProps) {
    if (!values.length) return null

    return (
        <div className="Search-suggestions">
            <ul className="Search-suggestions-list">
                {values.map((v: SearchResult) => (
                    <li
                        key={v.name}
                        className="Search-suggestions-item"
                        onClick={() => handleSearchSuggestionClick(v)}
                    >
                        <b>Name:</b> {v.name} | <b>Episode:</b> {v.episode}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function Search() {
    const [results, setResults] = React.useState([]);
    const [value, setValue] = React.useState('');
    const getSuggests = React.useRef(debounce(async (searchStr: string) => {
        const queryParams = parseQueryString(searchStr)
        const suggestions = await getSuggestions(queryParams)
        setResults(suggestions)
    }, QUERY_DEBOUNCE_TIME));

    React.useEffect(() => {
        if (value.length >= MIN_SEARCH_QUERY_LENGTH) {
            getSuggests.current(value);
        }

        if (!value) {
            setResults([])
        }
    }, [value]);

    return (
        <div className="Search">
            <input type="text" className="Search-input" value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)} />
            <SearchList values={results} />
        </div>
    );
}
