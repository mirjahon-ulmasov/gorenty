import { Branch, SearchParams } from 'types/api'
import { api } from './baseQuery'

const branchWithTags = api.enhanceEndpoints({
    addTagTypes: ['Branch'],
})

export const branchAPI = branchWithTags.injectEndpoints({
    endpoints: build => ({
        fetchBranches: build.query<Branch.List, SearchParams>({
            query: () => ({
                url: '/branch/',
                method: 'GET',
            }),
            providesTags: () => ['Branch'],
        }),
        fetchBranch: build.query<Branch.DTO, string>({
            query: id => `/branch/${id}/`,
            providesTags: () => ['Branch'],
        }),
        createBranch: build.mutation<unknown, Branch.DTO>({
            query: data => ({
                url: '/branch/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Branch'],
        }),
        updateBranch: build.mutation<unknown, Branch.DTO>({
            query: data => ({
                url: `/branch/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Branch'],
        }),

        addBranchImage: build.mutation<
        { branch: number, id: number, image: number }, 
        { branch: number, image: number }>({
            query: data => ({
                url: '/branch_image/',
                method: 'POST',
                body: data,
            }),
        }),
        deleteBranchImage: build.mutation<unknown, { id: number }>({
            query: ({ id }) => ({
                url: `/branch_image/${id}/`,
                method: 'DELETE',
            }),
        })
    }),
})

export const {
    useFetchBranchQuery,
    useFetchBranchesQuery,
    useCreateBranchMutation,
    useUpdateBranchMutation,
    useAddBranchImageMutation,
    useDeleteBranchImageMutation
} = branchAPI
