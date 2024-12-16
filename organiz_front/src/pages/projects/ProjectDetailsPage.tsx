import { Link, useNavigate, useParams } from 'react-router'
import Header from '../../components/Header'
import { useDeleteProject, useProject } from '../../hooks/useProjects'
import { useTasks } from '../../hooks/useTasks'
import { LoaderPage } from '../common/LoaderPage'

interface DetailsRowProps {
  label: string
  value: React.ReactNode
}

const DetailsRow: React.FC<DetailsRowProps> = ({ label, value }) => {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium text-gray-900">{label}</dt>
      <dd className="mt-1 flex flex-wrap gap-2 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
        {value}
      </dd>
    </div>
  )
}

export const ProjectDetailsPage = () => {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const { data, isError, error, isLoading } = useProject({ id: projectId!! })
  const {
    data: tasks,
    isError: isTasksError,
    isLoading: isTasksLoading,
  } = useTasks({ projectId: projectId!! })
  const {
    deleteProject,
    isError: deleteError,
    error: deleteErrorMessages,
  } = useDeleteProject()

  if (isLoading || isTasksLoading) {
    return <LoaderPage />
  }

  if (isError) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-600">
            {error?.name} : {error?.message}
          </p>
        </div>
      </>
    )
  }

  const handleDelete = () => {
    if (projectId) {
      deleteProject(projectId)
    }
  }

  return (
    <>
      <Header />
      <div className="p-6">
        {/* Project Details */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900">
            Project Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Details project ID: {data?.id}
          </p>
        </div>
        <div className="border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <DetailsRow label="Project Name" value={data?.name} />
            <DetailsRow label="Description" value={data?.description} />
            <DetailsRow
              label="Status"
              value={data?.status ? data.status.name : ''}
            />
            <DetailsRow
              label="Categories"
              value={data?.categories?.map((category) => (
                <span
                  key={category.id}
                  className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800"
                >
                  {category.name}
                </span>
              ))}
            />
            <DetailsRow label="Created at" value={data?.createdAt} />
            <DetailsRow label="Updated at" value={data?.updatedAt} />
          </dl>
        </div>
        {tasks!.length > 0 && (
          <div className="mt-8">
            <h3 className="text-base font-semibold text-gray-900">Tasks</h3>
            {isTasksError ? (
              <p className="text-red-600">Error loading tasks.</p>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                {tasks!.map((task) => (
                  <div
                    onClick={() => {
                      navigate(`/tasks/${task.id}`)
                    }}
                    key={task.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md"
                  >
                    <h4 className="text-lg font-medium text-gray-900">
                      {task.name}
                    </h4>
                    <p className="mt-2 text-sm text-gray-500">
                      {task.description || 'No description provided.'}
                    </p>
                    <span
                      className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        task.status.name === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.status.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleDelete}
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Project
          </button>
          <Link
            to={`/projects/update/${projectId}`}
            className="inline-flex items-center rounded-md bg-orange-400 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Modify Project
          </Link>
          <Link
            to={`/projects/addUser/${projectId}`}
            className="inline-flex items-center rounded-md bg-orange-400 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Add User
          </Link>
          <Link
            to={`/tasks/create/${projectId}`}
            className="inline-flex items-center rounded-md bg-orange-400 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Create a task
          </Link>
        </div>

        {deleteError && (
          <div className="mt-4 p-4 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">Error deleting project:</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-red-600">
              {deleteErrorMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
