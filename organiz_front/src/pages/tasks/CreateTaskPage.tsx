import Header from "../../components/Header"
import { Error } from "../../components/Error"
import { StyledTitle } from "../../components/StyledTitle"
import { StyledInput } from "../../components/StyledInput"
import { useParams } from "react-router"
import { useCreateTask } from "../../hooks/useTasks"

export const CreateTaskPage = () => {
    const {projectId} = useParams();
    const { formik, isError, errorContent } = useCreateTask({projectId: Number(projectId!!)})

  return (
    <>
      <Header />
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          {isError && (
            <Error title={errorContent.title} errors={errorContent.errors} />
          )}
          <StyledTitle text="Create a new Task" />

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <StyledInput
                label="Task name"
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
              <StyledInput
                label="Task description"
                id="description"
                type="text"
                name="description"
                required={true}
                autocomplete={undefined}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                touched={formik.touched.description}
                errors={formik.errors.description}
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
