import apiSlice from "../core/apiSlice";

const extendedApiSlice = apiSlice.injectEndpoints({
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getGoals: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => "/goals",
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Goals", id })),
              { type: "Goals", id: "LIST" },
            ]
          : [{ type: "Goals", id: "LIST" }],
    }),
    /*
     * We could add a 'Post' tag to both the getPost query and the editPost mutation, but that would force all the other individual goals
     * to be refetched as well. Fortunately, RTK Query lets us define specific tags, which let us be more selective in invalidating data.
     * These specific tags look like {type: 'Goal', id: 123}.
     */
    getGoal: builder.query({
      query: (goalId) => `/goals/${goalId}`,
      providesTags: (result, error, arg) => [{ type: "Goals", id: arg }], // 这里的arg即goalId
    }),
    createGoal: builder.mutation({
      query: (initialGoal) => ({
        url: "/goals",
        method: "POST",
        body: initialGoal,
      }),
      invalidatesTags: [{ type: "Goals", id: "LIST" }],
    }),
    updateGoal: builder.mutation({
      query: (goal) => ({
        url: `/goals/${goal.id}`,
        method: "PATCH",
        body: goal,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Goals", id: arg.id }], // 这里的arg即goal
    }),
    deleteGoal: builder.mutation({
      query: (goalId) => ({
        url: `/goals/${goalId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Goals", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetGoalsQuery,
  useGetGoalQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
} = extendedApiSlice;
