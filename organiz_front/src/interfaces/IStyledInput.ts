export interface IStyledInput {
  label: string
  id: string
  name: string
  type: string
  required: boolean
  autocomplete: string | undefined
  onChange: {
    (e: React.FocusEvent<any, Element>): void
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void
  }
  onBlur: {
    (e: React.FocusEvent<any, Element>): void
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void
  }
  value: string | number
  touched: boolean | undefined | any
  errors: string | null | undefined | any
}
