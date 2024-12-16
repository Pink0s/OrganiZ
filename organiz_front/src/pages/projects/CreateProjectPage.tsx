import Header from '../../components/Header'
import { useCreateProject } from '../../hooks/useProjects'
import ICategory from '../../interfaces/ICategory'
import { Error } from '../../components/Error'
import { StyledTitle } from '../../components/StyledTitle'
import { StyledInput } from '../../components/StyledInput'

export const CreateProjectPage = () => {
  const { formik, isError, errorContent, useCategoriesHooks } =
    useCreateProject()

  if (isError) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-600">
            {errorContent.title} : {errorContent.errors[0]}
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        {isError && (
          <Error title={errorContent.title} errors={errorContent.errors} />
        )}
        <StyledTitle text="Create a new project" />

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <StyledInput
              label="Project Name"
              id="name"
              type="text"
              name="name"
              required={true}
              autocomplete={undefined}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              touched={formik.touched.name}
              errors={formik.errors.name}
            />

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
                {useCategoriesHooks?.data?.map((category: ICategory) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`category-${category.id}`}
                      name="categories"
                      type="checkbox"
                      value={category.id}
                      checked={formik.values.categories.includes(category.id)}
                      onChange={(e) => {
                        const checked = e.target.checked
                        const value = Number(e.target.value)

                        let newCategories
                        if (checked) {
                          newCategories = [...formik.values.categories, value]
                        } else {
                          newCategories = formik.values.categories.filter(
                            (id) => id !== value
                          )
                        }

                        formik.setFieldValue('categories', newCategories)
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-3 block text-sm font-medium text-gray-900"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
              {formik.touched.categories && formik.errors.categories ? (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.categories}
                </p>
              ) : null}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
