'use client';

import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { ForgotFormSchema } from '../auth.type';
import CustomInput from '../../form-fields/CustomInput';
import { SubmitButton } from '../../custom-components/SubmitButton';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import SimpleGlassCard from "../../custom-components/GlassCard";
import { ChevronRight } from "lucide-react";

export default function GlassForgotPassForm() {
  const form = useForm<z.infer<typeof ForgotFormSchema>>({
    resolver: zodResolver(ForgotFormSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit(data: z.infer<typeof ForgotFormSchema>) {
    console.log(data);
    redirect('/login')
  };

  return (
    <SimpleGlassCard title='Forgot Password' subtitle='Enter your email address and we&apos;ll send you a link to reset your password.' maxWidth='max-w-md lg:max-w-lg'>
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

          </FieldGroup>

          <SubmitButton
            type='submit'
            content={'Send Reset Link'}
            uiVariant="glass"
            className='w-full text-white mt-8'
          />

          <Link
            href='/login'
            className='w-full flex justify-center items-center text-end text-white hover:text-white/90 group cursor-pointer gap-2 text-sm leading-none font-medium transition-colors duration-200 hover:underline'
          >
            <span>Back To Login</span>
            <ChevronRight className='w-4 transition-all duration-300 group-hover:-mx-1' />
          </Link>
        </form>
      </div>
    </SimpleGlassCard>
  );
}
