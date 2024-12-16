import { useParams, useNavigate } from 'react-router'
import Header from '../../components/Header'
import { useProject, useUpdateProject } from '../../hooks/useProjects'
import { useCategories } from '../../hooks/useCategories'
import { LoaderPage } from '../common/LoaderPage'
import { useStatus } from '../../hooks/useStatus'

export const UpdateProjectPage = () => {
  const { projectId } = useParams()
  const { data: statuses, isLoading: isStatusesLoading } = useStatus()
  const { data, isLoading, isError, error } = useProject({ id: projectId!! })
  const { data: allCategories, isLoading: isCategoriesLoading } =
    useCategories()
  const navigate = useNavigate()

  const {
    formik,
    isError: updateError,
    error: updateErrorMessages,
    isSuccess,
  } = useUpdateProject(data)

  if (isLoading || isCategoriesLoading || isStatusesLoading) {
    return <LoaderPage />
  }

  if (isError) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-600">
            {error?.name}: {error?.message}
          </p>
        </div>
      </>
    )
  }

  if (isSuccess) {
    navigate(`/projects/${projectId}`)
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <h3 className="text-base font-semibold text-gray-900">
          Update Project
        </h3>
        <form onSubmit={formik.handleSubmit} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Project Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="categories"
              className="block text-sm font-medium text-gray-700"
            >
              Categories
            </label>
            <div className="mt-2 space-y-2">
              {allCategories?.map((category: any) => (
                <div key={category.id} className="flex items-center">
                  <input
                    id={`category-${category.id}`}
                    name="categories"
                    type="checkbox"
                    value={category.id}
                    checked={formik.values.categories.includes(category.id)}
                    onChange={(e) => {
                      const selected = [...formik.values.categories]
                      if (e.target.checked) {
                        selected.push(Number(e.target.value))
                      } else {
                        const index = selected.indexOf(Number(e.target.value))
                        if (index > -1) {
                          selected.splice(index, 1)
                        }
                      }
                      formik.setFieldValue('categories', selected)
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-3 text-sm text-gray-700"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.status}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                Select a status
              </option>
              {statuses?.map((status: any) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Project
            </button>
          </div>
          {updateError && (
            <div className="mt-4 p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">Error updating project:</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-red-600">
                {updateErrorMessages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </>
  )
}
