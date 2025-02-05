import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



function Front3() {
    return (

        <div className="hero bg-#feebf4 h-screen hero-content flex-col lg:flex-row gap-x-14">
            <div className="font-sans text-gray-700">
                <h1 className="lg:text-5xl text-3xl font-extrabold">BuzzChat – Your New Favorite Chat App!</h1>
                <p className="py-6 md:text-md">
                    Don’t wait – join the BuzzChat community now and stay connected like never before. Your next conversation is just a tap away. See you in the chat!
                </p>

            </div>

            <DotLottieReact
                src="https://lottie.host/1cb0878b-2f18-4679-a483-18f0c137e575/ObUpAODp0m.lottie"
                loop
                autoplay
                className='w-9/12 md:w-6/12 shadow-xl shadow-black rounded-md h-1/2'
                
            />


        </div>

    )
}

export default Front3