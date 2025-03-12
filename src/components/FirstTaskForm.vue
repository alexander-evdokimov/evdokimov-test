<script setup lang="ts">
import { useFormValidation, type FormSchema, type ValidationRule } from '@/composables'

const EMAIL_REGEXP = /^\S+@\S+$/

const required: ValidationRule = (value) => (!value ? 'Поле обязательно' : null)
const email: ValidationRule = (val) => (!EMAIL_REGEXP.test(val) ? 'Введите корректный email!' : null)
const password: ValidationRule = (val) => (val.length < 8 ? 'Пароль должен быть не менее 8 символов!' : null)
const passwordConfirmation: ValidationRule = (val, values) => (val !== values?.password ? 'Пароли не совпадают!' : null)

const formSchema: FormSchema = {
  password: [required, password],
  passwordConfirmation: [passwordConfirmation],
  email: [required, email],
}

const formValues = {
  email: '',
  password: '',
  passwordConfirmation: '',
}

const { errors, handleSubmit, values, updateField } = useFormValidation({
  initialValues: formValues,
  schema: formSchema,
})
</script>

<template>
  <form
    @submit.prevent="
      handleSubmit((values) => {
        console.log(values)
      })
    "
    :class="[$style.form]"
  >
    <div :class="$style.formField">
      <input
        v-model="values.email"
        @input="updateField('email', values.email)"
        placeholder="Email"
      />
      <p v-if="errors.email">{{ errors.email }}</p>
    </div>

    <div :class="$style.formField">
      <input
        v-model="values.password"
        @input="updateField('password', values.password)"
        placeholder="Пароль"
      />
      <p v-if="errors.password">{{ errors.password }}</p>
    </div>

    <div :class="$style.formField">
      <input
        v-model="values.passwordConfirmation"
        @input="updateField('passwordConfirmation', values.passwordConfirmation)"
        placeholder="Повторите пароль"
      />
      <p v-if="errors.passwordConfirmation">{{ errors.passwordConfirmation }}</p>
    </div>

    <button type="submit">Зарегистрироваться</button>
  </form>
</template>

<style module>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form button {
  padding: 10px;
}

.formField {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.formField input {
  padding: 10px;
  font-size: 16px;
}

.formField p {
  color: tomato;
}
</style>
