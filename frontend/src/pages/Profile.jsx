import React, { useRef, useState } from 'react'
import { IoCameraOutline } from "react-icons/io5";
import dp from "../assets/dp.png"
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';


function Profile() {
    let {userData} = useSelector(state=>state.user)
    let navigate = useNavigate()
    let  [name, setName] = useState(userData.name || "")
    let [frontendImage , setFrontendImage] = useState(userData.image || dp)
    let [backendImage , setBackendImage] = useState(null)
    let dispatch = useDispatch()
    let [loading, setLoading] = useState(false)

    let image = useRef()

    const handleImage = (e)=>{
        let file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleProfile = async (e)=>{
      e.preventDefault()
      setLoading(true)
      try {
        let formData = new FormData()
        formData.append("name",name)
        if(backendImage){
          formData.append("image", backendImage)
        }

        let result = await axios.put(`${serverUrl}/api/user/profile`, formData, {withCredentials:true})
        console.log("user profile is done")
        setLoading(false)
        navigate("/")
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(`error in handleProfile ${error}`)
        setLoading(false)
      }
    }


  return (
    <div className='w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-[40px] relative'>
        <div className=' fixed absolute top-[30px] left-[30px]' >
            <FaArrowLeft className='w-[30px] h-[30px] text-gray-600 cursor-pointer' onClick={()=>navigate("/")} />
        </div>
     <div className=' bg-white rounded-full border-2 border-[#20c7ff] shadow-gray-400 shadow-lg cursor-pointer  relative'
        onClick={()=>image.current.click()} >
        <div className='w-[200px] h-[200px] overflow-hidden rounded-full flex justify-center items-center' >
            <img src={frontendImage} alt="" className=' h-[100%] ' />
        </div>
            <div  className='border-2 border-white w-[40px] h-[40px] absolute text-gray-700 top-[160px] right-[25px] rounded-full
             bg-[#20c7ff] flex justify-center items-center shadow-gray-500 shadow-lg hover:shadow-inner'>
               <IoCameraOutline className='text-3xl absolute text-gray-700 ' />
            </div>
     </div>

     <form  onSubmit={handleProfile} className='w-[37%] flex flex-col gap-[20px]  items-center '>

        <input type="file" accept='image/*' ref={image} hidden onChange={handleImage} />

        <input type="text" placeholder='Enter your Name' onChange={(e)=>setName(e.target.value)} value={name}
        className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] rounded-lg px-[20px] bg-white shadow-gray-400 shadow-lg' />

         <input type="text" readOnly value={userData?.userName} 
        className='text-zinc-500 w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] rounded-lg px-[20px] bg-white shadow-gray-400 shadow-lg' />

         <input type="email" readOnly value={userData?.email}
        className='text-zinc-500 w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] rounded-lg px-[20px] bg-white shadow-gray-400 shadow-lg' />

        <button className=' px-[60px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg font-semibold mt-[8px]
             hover:shadow-inner text-2xl ' disabled={loading}>{loading? "Saving....":"Save Profile"}</button>
     </form>
    </div>
  )
}

export default Profile