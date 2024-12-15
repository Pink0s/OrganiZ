import { Link } from "react-router";
import Header from "../../components/Header";
import { useCategories } from "../../hooks/useCategories";
import { LoaderPage } from "../common/LoaderPage";
import ICategory from "../../interfaces/ICategory";

const categoriesFields = [
  {  name: "id" },
  {  name: "name" },
  {  name: "created_at" },
  {  name: "updated_at" },
]

const TableHeader = () => {
  return <thead>
    <tr>
      {categoriesFields.map((item: {name: string}) => <th key={item.name} scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">{item.name}</th>)}
      <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
        <span className="sr-only">Edit</span>
      </th>
    </tr>
  </thead>
}

const CategoriesPage = () => {
  const {data, isError, error, isLoading, isSuccess} = useCategories()

  if(isLoading) {
    return <LoaderPage/>
  }

  if(isError) {
    return <>
    <Header/>
    <div className="flex items-center justify-center h-screen">
      <p className="text-red-600">{error?.name} : {error?.message}</p>
    </div>
    </>
  }
    
  if (isSuccess) {
    return (
      <>
        <Header />
        <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the categories.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link to={"/categories/create"}
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add a category
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <TableHeader/>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data!.map((data: ICategory) => (
                  <tr key={data.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {data.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{data.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{data.createdAt}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{data.updatedAt}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link to={`/categories/${data.id}`} className="text-indigo-600 hover:text-indigo-900">
                        Edit<span className="sr-only">, {data.id}</span>
                      </Link>
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
  }

  return null;
    

}



export default CategoriesPage;