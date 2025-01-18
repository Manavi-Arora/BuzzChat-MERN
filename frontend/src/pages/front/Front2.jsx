import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


function Front2() {
    return (

        <div className="hero bg-#feebf4 h-screen hero-content flex-col lg:flex-row gap-x-14">

            <DotLottieReact
                src="https://lottie.host/26942994-b18e-48e5-b13c-3c4402452e59/FURkBID1S5.json"
                loop
                autoplay
                className='w-11/12 shadow-xl shadow-black rounded-md h-1/2'
            />

            <div className="font-sans text-gray-700">
                <h1 className="text-5xl font-extrabold">BuzzChat - Your Ultimate Chat Experience!</h1>
                <p className="py-6 text-md">
                Stay connected with real-time messaging, group chats, and instant sharing of text, photos, and videos. Enjoy complete privacy with end-to-end encryption, customizable themes, and expressive emojis and stickers. BuzzChat redefines simplicity, fun, and security in messaging!
                </p>
            </div>

        </div>

    )
}

export default Front2