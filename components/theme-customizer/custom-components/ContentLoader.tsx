'use client'

import BaseLoader from './LogoLoader'

export const ContentLoader = () => {
  return (
    <div className='flex h-full min-h-60 w-full items-center justify-center p-8'>
      <BaseLoader fullScreen />
    </div>
  )
}
