import { CarBrand, SearchParams } from 'types/api'
import { api } from './baseQuery'

const carBrandWithTags = api.enhanceEndpoints({
    addTagTypes: ['CarBrand'],
})

export const carBrandAPI = carBrandWithTags.injectEndpoints({
    endpoints: build => ({
        fetchCarBrands: build.query<CarBrand.List, SearchParams>({
            query: params => ({
                url: '/brand/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['CarBrand'],
        }),
        createCarBrand: build.mutation<unknown, CarBrand.DTO>({
            query: data => ({
                url: '/brand/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['CarBrand'],
        }),
        updateCarBrand: build.mutation<unknown, CarBrand.DTO>({
            query: data => ({
                url: `/brand/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['CarBrand'],
        }),
    }),
})

export const {
    useFetchCarBrandsQuery,
    useCreateCarBrandMutation,
    useUpdateCarBrandMutation,
} = carBrandAPI
