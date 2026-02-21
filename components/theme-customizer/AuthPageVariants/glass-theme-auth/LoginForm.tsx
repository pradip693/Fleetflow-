'use client';

import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { formSchema } from '../auth.type';
import CustomInput from '../../form-fields/CustomInput';
import { CustomPasswordInput } from '../../form-fields/CustomPasswordInput';
import { SubmitButton } from '../../custom-components/SubmitButton';
import Link from 'next/link';
import { SmallText } from '../../custom-components/Typography';
import { CustomCheckbox } from '../../form-fields/CustomCheckbox';
import { redirect } from 'next/navigation';
import SimpleGlassCard from "../../custom-components/GlassCard";

export default function GlassLoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: undefined,
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    redirect('/admin/dashboard')
  };


  return (
    <SimpleGlassCard title='Welcome Back' subtitle='Sign in to your account' maxWidth='max-w-md lg:max-w-lg'>
      <div className="flex-1 flex flex-col justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          <FieldGroup className='grid gap-4'>
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

          <div className="flex items-center justify-between">
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
                    label="Remember me"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className='text-xs' />
                  )}
                </Field>
              )}
            />

            <Link
              href='/forgot-password'
              className='w-full text-end text-white hover:text-white/90 group cursor-pointer gap-2 text-sm leading-none font-medium transition-colors duration-200 hover:underline'
            >
              Forgot password?
            </Link>
          </div>

          <SubmitButton
            type='submit'
            content={'Sign in to dashboard'}
            uiVariant="glass"
            className='w-full text-white mt-8'
          />
        </form>
        <div className="mt-6 flex items-center gap-3 justify-center">
          <SmallText className="text-white/60">
            Don&apos;t have an account?
          </SmallText>
          <Link
            href='/sign-up'
            className='text-white hover:text-white/90 group inline-flex cursor-pointer items-center gap-1 text-sm leading-none font-medium hover:underline'
          >
            Sign up
          </Link>
        </div>
      </div>
    </SimpleGlassCard>
  );
}
