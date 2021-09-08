import React, {ChangeEvent} from 'react';
import debounce from 'lodash/debounce';

import {QUERY_DEBOUNCE_TIME, MIN_SEARCH_QUERY_LENGTH} from '../../constants';
import {getSuggestions, cancel as axiosCancel, Suggestion} from '../../libs/api';
import {parseQueryString, ParseQueryStringRes} from '../../libs/strings';
import './Search.css';

interface SearchListProps {
    values: Suggestion[],
}

const SearchList: React.FC<SearchListProps> = ({values = []}) => {

    const handleSearchSuggestionClick = React.useRef((suggestion: Suggestion) => {
        console.log(`Click on ${suggestion.name} | ${suggestion.episode}`)
    })

    if (!values.length) return null

    return (
        <div className="Search-suggestions">
            <ul className="Search-suggestions-list">
                {values.map((v: Suggestion) => (
                    <li
                        key={v.name}
                        className="Search-suggestions-item"
                        onClick={() => handleSearchSuggestionClick.current(v)}
                    >
                        <b>Name:</b> {v.name} | <b>Episode:</b> {v.episode}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export const Search: React.FC = () => {
    const [results, setResults] = React.useState<Suggestion[]>([])
    const [value, setValue] = React.useState<string>('')
    const getSuggests = React.useRef(debounce(async (searchStr: string) => {
        const queryParams: ParseQueryStringRes = parseQueryString(searchStr)
        const suggestions: Suggestion[] = await getSuggestions(queryParams)
        setResults(suggestions)
    }, QUERY_DEBOUNCE_TIME))

    React.useEffect(() => {
        if (value.length >= MIN_SEARCH_QUERY_LENGTH) {
            getSuggests.current(value);
        }

        if (!value) {
            setResults([])

            if (axiosCancel) {
                axiosCancel()
            }
        }
    }, [value])

    return (
        <div className="Search">
            <input
                placeholder="Search text"
                type="text"
                className="Search-input"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            />
            <SearchList values={results} />
        </div>
    );
}
