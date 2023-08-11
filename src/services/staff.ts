import { Staff, SearchParams } from 'types/api'
import { api } from './baseQuery'

const staffWithTags = api.enhanceEndpoints({
    addTagTypes: ['Staff'],
})

export const staffAPI = staffWithTags.injectEndpoints({
    endpoints: build => ({
        fetchStaffList: build.query<Staff.List, SearchParams>({
            query: params => ({
                url: '/staff/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['Staff'],
        }),
        fetchStaff: build.query<Staff.DTO, string>({
            query: id => `/staff/${id}/`,
            providesTags: () => ['Staff'],
        }),
        createStaff: build.mutation<unknown, Staff.DTO>({
            query: data => ({
                url: '/staff/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Staff'],
        }),
        updateStaff: build.mutation<unknown, Staff.DTO>({
            query: data => ({
                url: `/staff/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Staff'],
        }),
        addStaffImage: build.mutation<
        { staff: number, id: number, image: number }, 
        { staff: number, image: number }>({
            query: data => ({
                url: '/staff_image/',
                method: 'POST',
                body: data,
            }),
        }),
        deleteStaffImage: build.mutation<unknown, { id: number }>({
            query: ({ id }) => ({
                url: `/staff_image/${id}/`,
                method: 'DELETE',
            }),
        })
    }),
})

export const {
    useFetchStaffListQuery,
    useFetchStaffQuery,
    useCreateStaffMutation,
    useUpdateStaffMutation,
    useAddStaffImageMutation,
    useDeleteStaffImageMutation,
} = staffAPI
