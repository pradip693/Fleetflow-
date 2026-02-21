'use client';

import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { signUpFormSchema } from '../auth.type';
import CustomInput from '../../form-fields/CustomInput';
import { CustomPasswordInput } from '../../form-fields/CustomPasswordInput';
import { SubmitButton } from '../../custom-components/SubmitButton';
import Link from 'next/link';
import { SmallText } from '../../custom-components/Typography';
import { CustomCheckbox } from '../../form-fields/CustomCheckbox';
import SimpleGlassCard from "../../custom-components/GlassCard";

export default function GlassSignUpForm() {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      remember: undefined,
    },
  })

  function onSubmit(data: z.infer<typeof signUpFormSchema>) {
    console.log(data);
  };

  return (
    <SimpleGlassCard title='Create Your Account' subtitle='Sign up to get started and access your dashboard' maxWidth='max-w-md lg:max-w-lg'>
      <div className="flex-1 flex flex-col justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          <FieldGroup className='grid gap-4'>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <CustomInput
                    showLabel
                    required
                    uiVariant="glass"
                    labelClassName='text-white'
                    label='Full Name'
                    placeholder='Enter full name'
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className='text-xs' />
                  )}
                </Field>
              )}
            />

            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <CustomInput
                    showLabel
                    label='Email'
                    required
                    uiVariant="glass"
                    labelClassName='text-white'
                    placeholder='Email address'
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className='text-xs' />
                  )}
                </Field>
              )}
            />

            <Controller
              name='password'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <CustomPasswordInput
                    showLabel
                    required
                    uiVariant="glass"
                    labelClassName='text-white'
                    label='Password'
                    placeholder='Password'
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className='text-xs' />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Controller
            name='remember'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <CustomCheckbox
                  id="terms"
                  showLabel
                  uiVariant="glass"
                  labelClassName='text-white'
                  label="I agree to the Terms and Conditions"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} className='text-xs' />
                )}
              </Field>
            )}
          />

          <SubmitButton
            type='submit'
            content={'Sign in to dashboard'}
            uiVariant="glass"
            className='w-full text-white mt-8'
          />

        </form>

        <div className="mt-6 flex items-center gap-3 justify-center">
          <SmallText className="text-white/60">
            Already have an account?
          </SmallText>
          <Link
            href='/login'
            className='text-white hover:text-white/90 group inline-flex cursor-pointer items-center gap-1 text-sm leading-none font-medium hover:underline'
          >
            Login
          </Link>
        </div>

      </div>
    </SimpleGlassCard>
  );
}
