import { Link } from "react-router"
import { StyledInput } from "../../components/StyledInput.tsx";
import { Error } from "../../components/Error.tsx";
import { StyledTitle } from "../../components/StyledTitle.tsx";
import { useLogin } from "../../hooks/useLogin.ts";

export const Login = () => {
    const {formik, isError, errorContent} = useLogin()
    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          {isError && <Error title={errorContent.title} errors={errorContent.errors}/>}
          <StyledTitle text="Sign in to your account"/>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <StyledInput 
                label="Email Address"
                id="email" 
                type="email" 
                name="email" 
                required={true} 
                autocomplete="email" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.email} 
                touched={formik.touched.email} 
                errors={formik.errors.email}
              />
              <StyledInput 
                label="Password" 
                id="password" 
                type="password" 
                name="password" 
                required={true} 
                autocomplete="current-password" 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} 
                value={formik.values.password}
                touched={formik.touched.password}
                errors={formik.errors.password}
              />
              <div>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Not a member?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Register
              </Link>
            </p>
          </div>
        </div>
      </>
  )
}
