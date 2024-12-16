import { useParams } from 'react-router'
import Header from '../../components/Header'
import { Error } from '../../components/Error'
import { StyledTitle } from '../../components/StyledTitle'
import { StyledInput } from '../../components/StyledInput'
import { useCategory, useModifyCategory } from '../../hooks/useCategories'
import { LoaderPage } from '../common/LoaderPage'

export const UpdateCategoryPage = () => {
  const { categoryId } = useParams()
  const useCategoryHook = useCategory(categoryId!)
  const { isError, error, formik } = useModifyCategory(
    categoryId!!,
    useCategoryHook.data,
    useCategoryHook.isSuccess
  )
  if (useCategoryHook.isLoading) {
    return <LoaderPage />
  }

  if (useCategoryHook.isError) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-600">
            {useCategoryHook.error?.name} : {useCategoryHook.error?.message}
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          {isError && <Error title={error[0]} errors={error} />}
          <StyledTitle text="Create a new Category" />

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <StyledInput
                label="Category Name"
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
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    </>
  )
}
