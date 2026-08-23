import { useContext, useState } from 'react'
import { userContext } from '../context/UseContext'
import { Loader2Icon } from 'lucide-react'
import { useNavigate } from 'react-router'

const SigninPage = () => {
  const [userName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const { signinUser } = useContext(userContext)

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!userName || !email || !password) {
      return alert("Please fill the Details")
    }

    try {
      setSubmitting(true)
      await signinUser({ userName, email, password })
      navigate("/study")
    } catch {
      alert("Sign up failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <div className='shadow-2xl w-125 p-5 rounded-xl flex justify-start items-start flex-col mb-1 bg-blue-900'>
        <h1 className='mx-auto text-4xl mb-3 font-sans font-bold p-1.5 px-4 rounded-md'>Sign in to Skillora</h1>
        <form className='w-full flex flex-col justify-start items-start' onSubmit={handleSubmit}>
          <div className='flex flex-col justify-start w-full gap-1.5'>
            <label htmlFor="fullname" className='text-xl font-semibold'>Enter your name</label>
            <input type="text" value={userName} onChange={(e) => setFullName(e.target.value)} placeholder='Enter your name' className='p-2 rounded-md outline-none shadow-xl focus:ring-2 focus:ring-orange-800' />
          </div>
          <div className='flex flex-col justify-start gap-1.5 w-full'>
            <label htmlFor="fullname" className='text-xl font-semibold'>Enter your Email</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' className='p-2 rounded-md outline-none shadow-xl border-blue-700 focus:ring-2 focus:ring-orange-800' />
          </div>
          <div className='flex flex-col justify-start gap-1.5 w-full'>
            <label htmlFor="fullname" className='text-xl font-semibold'>Enter your password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' className='p-2 rounded-md outline-none shadow-xl border-blue-700 focus:ring-2 focus:ring-orange-800' />
          </div>

          <button disabled={submitting} type='submit' className='bg-red-400 w-full rounded-lg py-2 mt-4 mx-auto cursor-pointer'>
            {
              submitting ? (
                <div className='flex justify-center'>
                  <Loader2Icon className='size-4 animate-spin transition-all' />
                </div>
              ) :
                (
                  <h1>Sign in</h1>
                )
            }
          </button>
        </form>
      </div>
    </div>
  )
}

export default SigninPage

