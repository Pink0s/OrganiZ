import { Link } from "react-router";
import Header from "../../components/Header";
import IProject from "../../interfaces/IProject";
import { useProjects } from "../../hooks/useProjects";
import { LoaderPage } from "../common/LoaderPage";
import React from "react";
import ICategory from "../../interfaces/ICategory";
import { useCategories } from "../../hooks/useCategories";
import { useQueryClient } from "@tanstack/react-query";

const categoriesFields = [
  { name: "id" },
  { name: "name" },
  { name: "description" },
  { name: "status" },
  { name: "categories" },
  { name: "created_at" },
  { name: "updated_at" },
];

const TableHeader = () => {
  return (
    <thead>
      <tr>
        {categoriesFields.map((item: { name: string }) => (
          <th
            key={item.name}
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
          >
            {item.name}
          </th>
        ))}
        <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
          <span className="sr-only">View</span>
        </th>
      </tr>
    </thead>
  );
};

const ProjectsPage = () => {
  const [categoryFilter, setCategoryFilter] = React.useState<string | undefined>();
  
  
  const { data, isError, error, isLoading } = useProjects({
    category: categoryFilter,
  });

  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  const queryClient = useQueryClient()

  React.useEffect(() => {

    queryClient.invalidateQueries({ queryKey: ['projects'] })
   
  }, [categoryFilter])
  if (isLoading || categoriesLoading) {
    return <LoaderPage />;
  }

  if (categoriesError) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-600">Error loading categories.</p>
        </div>
      </>
    );
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
    );
  }

  return (
    <>
      <Header />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">Projects</h1>
            <p className="mt-2 text-sm text-gray-700">A list of all projects.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              to={"/categories/create"}
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add a Project
            </Link>
          </div>
        </div>
        {/* Category Filter Dropdown */}
        <div className="mt-6">
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">
            Filter by Category
          </label>
          <select
            id="categoryFilter"
            value={categoryFilter || undefined}
            onChange={(e) => setCategoryFilter(e.target.value || undefined)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {categories?.map((category: ICategory) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <TableHeader />
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data!.map((data: IProject) => (
                    <tr key={data.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {data.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {data.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {data.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {data.status.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {data.categories.map((category: ICategory, index) => (
                          <span
                            key={index}
                            className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 mr-2"
                          >
                            {category.name}
                          </span>
                        ))}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {data.createdAt}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {data.updatedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
