import { Link } from 'react-router'
import Header from '../../components/Header'

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <section
          aria-labelledby="project-management-heading"
          className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img
                alt="Organized workspace"
                src="https://tailwindui.com/plus/img/ecommerce-images/home-page-01-feature-section-01.jpg"
                className="size-full object-cover"
              />
            </div>
            <div className="relative bg-gray-900/75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2
                  id="project-management-heading"
                  className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                >
                  <span className="block sm:inline">Organize</span>
                  <span className="block sm:inline">Your Projects</span>
                </h2>
                <p className="mt-3 text-xl text-white">
                  Take control of your tasks and projects with ease. Track
                  progress, collaborate, and achieve your goals efficiently—all
                  from one intuitive platform.
                </p>
                <Link
                  to="/projects"
                  className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home
