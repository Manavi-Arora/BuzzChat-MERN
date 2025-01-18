import React from 'react'
import { useNavigate } from 'react-router-dom'
import Front2 from './Front2'
import Front3 from './Front3'

export default function Front() {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/signup')
    }

    return (
        <div>
            <div className="hero bg-[#e0e1e1] h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img
                        src="chatGif.gif"
                        className="rounded-lg min-w-fit" />
                    <div className="font-sans text-gray-700">
                        <h1 className="text-5xl font-extrabold">Welcome to BuzzChat - Where Conversations Come Alive!</h1>
                        <p className="py-6 text-md">
                            Dive into lively chats, make new connections, and stay updated with the buzz. Join the conversation and never miss a moment!
                        </p>
                        <button
                            onClick={handleClick}
                            className="bg-blue-500 text-white font-semibold py-3 px-7 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-300"
                        >
                            Get Started &gt;
                        </button>
                    </div>
                </div>
            </div>
            <div className="divider bg-gray-400 h-0.5"></div>
            <Front2 />
            <div className="divider bg-gray-400 h-0.5"></div>
            <Front3 />
        </div>
    )
}
