import { api } from '@/api'
import { CameraIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import React, { useState } from 'react'

export default function check() {

    const [images, setImages] = useState([])

    const [showImages, setShowImages] = useState([])

    const imageName = new Date().getTime()

    const handleImage = async (event) => {
        if (event.target.files && event.target.files[0]) {
            setImages([...images, event.target.files[0]])
            setShowImages([...showImages, URL.createObjectURL(event.target.files[0])])
        }
    }

    const removeImage = (indexToRemove) => {
        setShowImages([...showImages.filter((_, index) => index !== indexToRemove)])
        setImages([...images.filter((_, index) => index !== indexToRemove)])
    }

    const onSubmit = () => {
        images.forEach((element, i) => {
            const formData = new FormData();
            const format = element.name.split(".")[1];
            const renamedFile = new File([element], `${i + imageName}_${element.name}`, { type: element.type });
            formData.append('fileToUpload', renamedFile);
            api.UploadApi.File(formData);
        });
    }


    return (
        <>
            <fieldset className="lg:col-span-6 md:col-span-4 col-span-2 w-full">
                <label htmlFor="images" className="text-sm">
                    Add Images
                </label>
                <input
                    id="images"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImage(e)}
                    accept="image/png, image/jpg, image/jpeg"
                    name="fileToUpload"

                />
                <div className="flex flex-wrap gap-2 relative z-0">
                    {showImages.map((e, i) => (
                        <div key={i} className="relative">
                            <button
                                className="absolute right-1 top-1 z-10"
                                onClick={() => removeImage(i)}
                                title="Close"
                            >
                                <XCircleIcon className="h-5 w-5 stroke-2  stroke-red-500 rounded-full" />
                            </button>
                            <Image
                                src={e}
                                className="md:h-40 h-24 md:w-40 w-24 object-contain rounded border border-primary-1 bg-white/5 backdrop-blur-sm relative"
                                alt=""
                                width={100}
                                height={100}
                            />
                        </div>
                    ))}
                    {showImages.length <= 7 && (
                        <label
                            className="col-span-1 md:h-40 h-24 md:w-40 w-24 flex justify-center items-center rounded border border-primary-1 text-gray-400 hover:text-red-500 cursor-pointer"
                            htmlFor="images"
                        >
                            <CameraIcon className="h-8 w-8 stroke-primary-1" />
                        </label>
                    )}
                </div>
            </fieldset>
            <div className="lg:col-span-6 col-span-3 w-full flex justify-end">
                <button
                    type="button"
                    onClick={onSubmit}
                    className="py-2 px-4 hover:text-primary-1 text-white hover:bg-transparent bg-primary-1 2xl:text-base lg:text-xs text-sm border border-primary-1 rounded"
                >
                    Upload
                </button>
            </div>
        </>
    )
}
