import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


function Front2() {
    return (

        <div className="hero bg-#feebf4 h-screen hero-content flex-col lg:flex-row gap-x-14">

            <DotLottieReact
                src="https://lottie.host/26942994-b18e-48e5-b13c-3c4402452e59/FURkBID1S5.json"
                loop
                autoplay
                className='w-9/12 md:w-11/12 shadow-xl shadow-black rounded-md h-1/2'
            />

            <div className="font-sans text-gray-700">
                <h1 className="md:text-5xl text-3xl font-extrabold mt-6 lg:mt-0">BuzzChat - Your Ultimate Chat Experience!</h1>
                <p className="py-6 md:text-md">
                BuzzChat redefines communication with seamless real-time messaging, high-quality voice/video calls, secure authentication, and multimedia sharing including text and images, all wrapped in customizable themes and end-to-end encryption for privacy, offering an intuitive experience for both one-on-one and group chats, along with easy profile management and personalized settings and suggestions.

                </p>
            </div>

        </div>

    )
}

export default Front2