'use client'

import type { GlassCardProps } from './types'
import { BaseText, MediumTitleText } from './Typography'


export default function GlassCardProps({
    children,
    title,
    subtitle,
    maxWidth = 'max-w-md',
}: GlassCardProps) {
    return (
        <div className={`${maxWidth} w-full relative`}>
            <div className='bg-white/20 backdrop-blur-xs border border-white/15 rounded-2xl px-8 py-10 shadow-2xl shadow-white/20'>
                {title && (
                    <div className='mb-6 md:mb-10 space-y-1'>
                        <MediumTitleText className='font-semibold text-white '>
                            {title}
                        </MediumTitleText>
                        {subtitle && (
                            <BaseText className="text-white/70 leading-relaxed">
                                {subtitle}
                            </BaseText>
                        )}
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}
