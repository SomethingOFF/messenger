"use client"
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

interface MobileFooterProps {
    key:string
    href:string
    active?:boolean
    icon:any
    onClick?:()=>void
}

const MobileItem:React.FC<MobileFooterProps> = ({
    href,
    icon:Icon,
    onClick,
    active
}) => {
    const handleClick = ()=>{
        if(onClick){
            return onClick()
        }
    }
  return (
    <Link href={href} onClick={handleClick} className={clsx(`group flex gap-x-1 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100`,active && `bg-gray-100 text-black`)}>
        <Icon clasname="h-6 w-6" />
    </Link>
  )
}

export default MobileItem