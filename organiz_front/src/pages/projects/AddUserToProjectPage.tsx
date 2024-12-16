import { Error } from '../../components/Error';
import Header from '../../components/Header'
import { useAddUserToProject } from '../../hooks/useProjects'
import { StyledTitle } from '../../components/StyledTitle';
import { StyledInput } from '../../components/StyledInput';
import { useParams } from 'react-router';

export const AddUserToProjectPage = () => {
    const {projectId} = useParams()
    const {formik,isError,errorContent } = useAddUserToProject({projectId: projectId!!});
    
    return (
        <>
          <Header />
          <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              {isError && (
                <Error title={errorContent.title} errors={errorContent.errors} />
              )}
              <StyledTitle text="Add an user to the project" />
    
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <StyledInput
                    label="User email"
                    id="email"
                    type="text"
                    name="email"
                    required={true}
                    autocomplete={undefined}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    touched={formik.touched.email}
                    errors={formik.errors.email}
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
