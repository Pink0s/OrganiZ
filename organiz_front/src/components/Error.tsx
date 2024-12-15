import { XCircleIcon } from "@heroicons/react/20/solid"
import IError from "../interfaces/IError"

export const Error = (props: IError) => {
    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 rounded-md bg-red-50 p-4 shadow-lg">
        <div className="flex">
          <div className="shrink-0">
            <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{props.title}</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                {
                  props.errors.map((error, idx) => <li key={idx}>{error}</li>)
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
}