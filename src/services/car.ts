import { Car, SearchParams } from 'types/api'
import { api } from './baseQuery'

const carWithTags = api.enhanceEndpoints({
    addTagTypes: ['Car'],
})

export const carAPI = carWithTags.injectEndpoints({
    endpoints: build => ({
        fetchCars: build.query<Car.List, SearchParams>({
            query: params => ({
                url: '/vehicle/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['Car'],
        }),
        fetchCar: build.query<Car.DTO, string>({
            query: id => `/vehicle/${id}/`,
            providesTags: () => ['Car'],
        }),
        createCar: build.mutation<unknown, Car.DTO>({
            query: data => ({
                url: '/vehicle/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Car'],
        }),
        updateCar: build.mutation<unknown, Car.DTO>({
            query: data => ({
                url: `/vehicle/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Car'],
        }),
        addCarImage: build.mutation<
        { vehicle: number, id: number, image: number }, 
        { vehicle: number, image: number }>({
            query: data => ({
                url: '/vehicle_image/',
                method: 'POST',
                body: data,
            }),
        }),
        deleteCarImage: build.mutation<unknown, { id: number }>({
            query: ({ id }) => ({
                url: `/vehicle_image/${id}/`,
                method: 'DELETE',
            }),
        })
    }),
})

export const {
    useFetchCarsQuery,
    useFetchCarQuery,
    useCreateCarMutation,
    useUpdateCarMutation,
    useAddCarImageMutation,
    useDeleteCarImageMutation,
} = carAPI
