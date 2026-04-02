import React from 'react'

const UserSkeleton = () => {
    return (
        <div className="flex flex-col w-full lg:w-1/3 xl:w-1/5 gap-8">
            <div className="bg-white p-6 animate-pulse flex flex-col gap-6">
                <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <div className="w-32 h-4 bg-gray-300 rounded" />
                        <div className="w-20 h-3 bg-gray-200 rounded" />
                    </div>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded" />
                <div className="w-2/3 h-3 bg-gray-200 rounded" />

                <div className="flex flex-col gap-2">
                    <div className="w-32 h-3 bg-gray-200 rounded" />
                    <div className="w-32 h-3 bg-gray-200 rounded" />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="w-full h-3 bg-gray-200 rounded" />
                    <div className="w-full h-3 bg-gray-200 rounded" />
                    <div className="w-full h-3 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    )
}

export default UserSkeleton