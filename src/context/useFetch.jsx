import { useReducer, useCallback } from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null,
};

function httpReducer(state, action) {
    switch (action.type) {
        case 'SEND':
            return { loading: true, error: null, data: null };
        case 'SUCCESS':
            return { loading: false, error: null, data: action.responseData };
        case 'ERROR':
            return { loading: false, error: action.errorMessage, data: null };
        case 'CLEAR':
            return initialState;
        default:
            return state;
    }
}

const useFetch = () => {
    const [httpState, dispatch] = useReducer(httpReducer, initialState);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        dispatch({ type: 'SEND' });
        try {
            const response = await fetch(url, {
                method,
                body: body ? JSON.stringify(body) : null,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Something went wrong!');
            }
            dispatch({ type: 'SUCCESS', responseData });
            return responseData;
        } catch (err) {
            dispatch({ type: 'ERROR', errorMessage: err.message });
            throw err;
        }
    }, []);

    return {
        isLoading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        sendRequest,
    };
};


export { useFetch };