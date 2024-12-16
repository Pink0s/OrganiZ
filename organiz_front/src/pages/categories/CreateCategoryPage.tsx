import Header from '../../components/Header'
import { useCreateCategory } from '../../hooks/useCategories'
import { Error } from '../../components/Error'
import { StyledTitle } from '../../components/StyledTitle'
import { StyledInput } from '../../components/StyledInput'

export const CreateCategoryPage = () => {
  const { formik, isError, errorContent } = useCreateCategory()

  return (
    <>
      <Header />
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          {isError && (
            <Error title={errorContent.title} errors={errorContent.errors} />
          )}
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
