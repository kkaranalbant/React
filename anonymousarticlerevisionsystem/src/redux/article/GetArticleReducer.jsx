import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: null,
    data: null,
    decryptedArticleData: null,
    decryptedCensoredArticleData: null,
    decryptedReviewedArticleData: null,
    decryptedCensoredReviewedArticleData: null,
    loading: false,
    error: null
};

export const handleQuery = createAsyncThunk(
    "getArticle/handleQuery",
    async (_, { getState, rejectWithValue }) => {
        const state = getState().getArticleReducer;
        try {
            const response = await fetch(`https://localhost:8080/v1/article/get?id=${state.id}`);

            if (!response.ok) {
                return rejectWithValue(await response.text());
            }

            const formData = await response.formData();
            const result = {};
            const pdfUrls = {};

            for (const [key, value] of formData.entries()) {
                if (value instanceof Blob) {
                    const blob = new Blob([value], {
                        type: value.type || 'application/pdf'
                    });
                    pdfUrls[key] = URL.createObjectURL(blob);
                } else {
                    result[key] = value;
                }
            }

            return {
                data: result,
                ...pdfUrls
            };

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const handleQueryWithId = createAsyncThunk(
    "getArticle/handleQueryWithId",
    async (id, { getState, rejectWithValue }) => {
        const state = getState().getArticleReducer;
        try {
            const response = await fetch(`https://localhost:8080/v1/article/get?id=${id}`);
            if (!response.ok) {
                return rejectWithValue(await response.text());
            }

            const formData = await response.formData();
            const result = {};
            const pdfUrls = {};

            for (const [key, value] of formData.entries()) {
                if (value instanceof Blob) {
                    const blob = new Blob([value], {
                        type: value.type || 'application/pdf'
                    });
                    pdfUrls[key] = URL.createObjectURL(blob);
                } else {
                    result[key] = value;
                }
            }

            return {
                data: result,
                ...pdfUrls
            };

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const getArticleReducer = createSlice({
    name: 'getArticle',
    initialState,
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        reset: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleQuery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleQuery.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.decryptedArticleData = action.payload.decryptedArticleData;
                state.decryptedCensoredArticleData = action.payload.decryptedCensoredArticleData;
                state.decryptedReviewedArticleData = action.payload.decryptedReviewedArticleData;
                state.decryptedCensoredReviewedArticleData = action.payload.decryptedCensoredReviewedArticleData;
            })
            .addCase(handleQuery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(handleQueryWithId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handleQueryWithId.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.decryptedArticleData = action.payload.decryptedArticleData;
                state.decryptedCensoredArticleData = action.payload.decryptedCensoredArticleData;
                state.decryptedReviewedArticleData = action.payload.decryptedReviewedArticleData;
                state.decryptedCensoredReviewedArticleData = action.payload.decryptedCensoredReviewedArticleData;
            })
            .addCase(handleQueryWithId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setId, reset } = getArticleReducer.actions;
export default getArticleReducer.reducer;