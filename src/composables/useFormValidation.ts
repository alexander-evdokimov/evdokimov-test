import { reactive, toRefs } from 'vue'

export type ValidationRule = (value: any, values?: Record<string, any>) => string | null

export interface FormSchema {
  [key: string]: ValidationRule[]
}

type FormValues = Record<string, unknown>
type RevalidateMode = 'onChange' | 'onSubmit'

interface FormState {
  values: FormValues
  errors: Record<string, string | null>
  isValid: boolean
  isReValidateActive: boolean
}

interface FormValidationProps {
  initialValues: FormValues
  schema: FormSchema
  reValidateMode?: RevalidateMode
}

export function useFormValidation({ initialValues, schema, reValidateMode = 'onSubmit' }: FormValidationProps) {
  const defaultState = {
    values: { ...initialValues },
    errors: Object.keys(initialValues).reduce((acc, key) => ({ ...acc, [key]: null }), {}),
    isValid: true,
    isReValidateActive: false,
  }

  const state = reactive<FormState>(defaultState)

  const validateField = (field: string) => {
    const rules = schema[field]
    if (!rules) return

    for (const rule of rules) {
      const error = rule(state.values[field], state.values)
      if (error) {
        state.errors[field] = error
        return
      }
    }
    state.errors[field] = null
  }

  const validateForm = () => {
    let valid = true
    for (const field in schema) {
      validateField(field)
      if (state.errors[field]) valid = false
    }
    state.isValid = valid
  }

  const reValidateForm = (mode: RevalidateMode) => {
    if (!state.isReValidateActive && reValidateMode === mode) {
      state.isReValidateActive = true
    }

    if (state.isReValidateActive) {
      validateForm()
    }
  }

  const resetForm = () => {
    state.values = { ...initialValues }
    state.errors = defaultState.errors
    state.isValid = defaultState.isValid
    state.isReValidateActive = defaultState.isReValidateActive
  }

  const updateField = (field: string, value: unknown) => {
    state.values[field] = value
    reValidateForm('onChange')
  }

  const handleSubmit = (onSubmit: (values: FormValues) => void) => {
    reValidateForm('onSubmit')

    if (!state.isValid) {
      return
    }

    onSubmit(state.values)
    resetForm()
  }

  return {
    ...toRefs(state),
    handleSubmit,
    updateField,
    validateForm,
    resetForm,
  }
}
