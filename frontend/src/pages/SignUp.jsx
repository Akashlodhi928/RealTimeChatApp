import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { serverUrl } from '../main'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    let [loading, setLoading] = useState(false)
    let [err, setErr] = useState(false)
    let dispatch = useDispatch()
    

    const handleSignUp = async(e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signup`,{
                userName,email,password
            },{withCredentials:true})

            dispatch(setUserData(result.data))
             setUserName("")
              setEmail("")
            setPassword("")
            navigate("/profile")
             window.location.reload();
            setErr("")
            setLoading(false)
        } catch (error) {
            console.log(`error in signup ${error}`)
            setLoading(false)
               if (error.response && error.response.data && error.response.data.message) {
                setErr(error.response.data.message);
            } else {
                setErr("Something went wrong. Please try again.");
            }
           
        }
    }
    
   
  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center  '>
        <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg 
         shadow-gray-400 shadow-lg flex flex-col gap-[35px]'>
            <div className='w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex justify-center items-center rounded-t-lg'>
                <h1 className='text-2xl text-zinc-800 font-bold'>Welcone to <span className='text-white hover:underline'>BaatCheet</span></h1>
            </div>
  {/* inputs */}

         <form onSubmit={handleSignUp} className='w-full flex flex-col gap-[20px]  items-center ' >
            <input type="text" placeholder='userName' name='userName' required value={userName}
            onChange={(e)=>setUserName(e.target.value)}
            className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] rounded-lg px-[20px] bg-white shadow-gray-200 shadow-lg'/>

            <input type="email" placeholder='email' name='email' required
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] rounded-lg px-[20px] bg-white shadow-gray-200 shadow-lg'/>

           <div className='w-[90%] h-[50px] border-2  border-[#20c7ff] rounded-lg bg-white shadow-gray-200 shadow-lg relative'>
             <input type={`${show ? "text" : "password" }`} placeholder='password' name='password' required
             value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className='outline-none  w-full h-full px-[20px]'/>
            <span onClick={()=>setShow(prev => !prev)} className=' cursor-pointer font-semibold text-[#20c7ff] absolute top-[11px] right-[10px]'>{`${show ? "hidden" : "show" }`}</span>
           </div>

            {err && <p className='text-red-500'>{"*" + err}</p>}
        

            <button className='  px-[60px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg font-bold mt-[8px]
             hover:shadow-inner ' disabled={loading} >{loading? "Loading...": "Sign Up"}</button>

             <p className='mt-[5px] cursor-pointer'>Already Have An Account?{" "}
                <sapn onClick={()=>navigate("/login")} className='text-red-600 font-bold hover:underline' >Login</sapn></p>
        </form>


        </div>   
    </div>
  )
}

export default SignUp