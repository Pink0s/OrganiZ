import { IStyledInput } from '../interfaces/IStyledInput'

export const StyledInput = (props: IStyledInput) => {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {props.label}
      </label>
      <div className="mt-2">
        <input
          id={props.id}
          name={props.name}
          type={props.type}
          required={props.required}
          autoComplete={props.autocomplete}
          onChange={props.onChange}
          onBlur={props.onBlur}
          value={props.value}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        {props.touched && props.errors ? (
          <p className="text-error">{props.errors}</p>
        ) : null}
      </div>
    </div>
  )
}
